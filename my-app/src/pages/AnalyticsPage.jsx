import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import styles from "./AnalyticsPage.module.scss";

/**
 * LineChart Component - Simple SVG line chart
 */
function LineChart({ data, label, color = "#59d8e5" }) {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>No data available yet</p>
      </div>
    );
  }

  const maxValue = Math.max(...data, 1);
  const padding = 40;
  const chartHeight = 200;
  const chartWidth = 400;
  const pointsSpacing = (chartWidth - padding * 2) / (data.length - 1 || 1);

  const points = data
    .map((value, index) => {
      const x = padding + index * pointsSpacing;
      const y = chartHeight - (value / maxValue) * (chartHeight - padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartLabel}>{label}</h3>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className={styles.chart}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={i}
            x1={padding}
            y1={chartHeight - ratio * (chartHeight - padding)}
            x2={chartWidth - padding}
            y2={chartHeight - ratio * (chartHeight - padding)}
            stroke="var(--color-outline)"
            opacity="0.2"
          />
        ))}

        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight - padding}
          stroke="var(--color-outline)"
        />

        {/* X-axis */}
        <line
          x1={padding}
          y1={chartHeight - padding}
          x2={chartWidth - padding}
          y2={chartHeight - padding}
          stroke="var(--color-outline)"
        />

        {/* Line with gradient */}
        <defs>
          <linearGradient
            id={`grad-${label}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Area under line */}
        <polyline points={points} fill={`url(#grad-${label})`} opacity="0.3" />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Points */}
        {data.map((value, index) => (
          <circle
            key={index}
            cx={padding + index * pointsSpacing}
            cy={chartHeight - (value / maxValue) * (chartHeight - padding)}
            r="5"
            fill={color}
            opacity="0.8"
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * PieChart Component - Simple SVG pie chart
 */
function PieChart({ data, label, colors }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>No data available yet</p>
      </div>
    );
  }

  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  if (total === 0)
    return (
      <div className={styles.emptyChart}>
        <p>No sessions yet</p>
      </div>
    );

  let currentAngle = -Math.PI / 2;
  const slices = Object.entries(data).map(([name, value], index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = 100 + 80 * Math.cos(startAngle);
    const y1 = 100 + 80 * Math.sin(startAngle);
    const x2 = 100 + 80 * Math.cos(endAngle);
    const y2 = 100 + 80 * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    currentAngle = endAngle;

    return (
      <g key={name}>
        <path
          d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
          fill={colors[index % colors.length]}
          opacity="0.8"
          style={{ cursor: "pointer" }}
        />
        <text
          x={100 + 50 * Math.cos(startAngle + sliceAngle / 2)}
          y={100 + 50 * Math.sin(startAngle + sliceAngle / 2)}
          textAnchor="middle"
          dy=".35em"
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
        >
          {Math.round((value / total) * 100)}%
        </text>
      </g>
    );
  });

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartLabel}>{label}</h3>
      <svg viewBox="0 0 200 200" className={styles.pieChart}>
        <circle
          cx="100"
          cy="100"
          r="85"
          fill="transparent"
          stroke="var(--color-outline)"
          opacity="0.2"
          strokeWidth="1"
        />
        {slices}
      </svg>
      <div className={styles.legend}>
        {Object.entries(data).map(([name, value], index) => (
          <div key={name} className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span>
              {name}: {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * HeatmapCalendar - Github-style activity heatmap
 */
function HeatmapCalendar({ sessions }) {
  const weeks = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay());
  startDate.setDate(startDate.getDate() - startDate.getDay() * 7 + 7 * 12); // 12 weeks back

  // Create session count by date
  const sessionsByDate = {};
  sessions.forEach((session) => {
    const dateStr = session.date.split("T")[0];
    sessionsByDate[dateStr] = (sessionsByDate[dateStr] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(sessionsByDate), 1);

  // Generate grid
  let currentDate = new Date(startDate);
  let weekDays = [];

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const count = sessionsByDate[dateStr] || 0;
    const intensity = Math.min(count / maxCount, 1);

    weekDays.push({
      date: new Date(currentDate),
      count,
      intensity,
      dateStr,
    });

    if (weekDays.length === 7 || currentDate.getTime() === today.getTime()) {
      weeks.push([...weekDays]);
      if (weekDays.length === 7) {
        weekDays = [];
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const getColor = (intensity) => {
    if (intensity === 0) return "#2a2a2a";
    if (intensity < 0.33) return "#006971";
    if (intensity < 0.66) return "#2db8c6";
    return "#59d8e5";
  };

  return (
    <div className={styles.heatmapContainer}>
      <h3>Training Activity (Last 12 Weeks)</h3>
      <div className={styles.heatmap}>
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={styles.heatmapCell}
              style={{ backgroundColor: getColor(day.intensity) }}
              title={`${day.dateStr}: ${day.count} session(s)`}
            />
          )),
        )}
      </div>
    </div>
  );
}

/**
 * AnalyticsPage - Comprehensive analytics and statistics dashboard
 */
function AnalyticsPage() {
  const { stats, trainingSessions, achievements } = useApp();

  // Generate last 30 days of data
  const last30Days = useMemo(() => {
    const daily = {};
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      daily[dateStr] = 0;
    }

    trainingSessions.forEach((session) => {
      const dateStr = session.date.split("T")[0];
      if (dateStr in daily) {
        daily[dateStr] += Number(session.duration || 0);
      }
    });

    return Object.values(daily);
  }, [trainingSessions]);

  // Training volume by type (last 30 days)
  const typeDistribution = useMemo(() => {
    const dist = {};
    const types = new Set();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    trainingSessions
      .filter((s) => new Date(s.date) >= thirtyDaysAgo)
      .forEach((session) => {
        const type = session.type || "other";
        dist[type] = (dist[type] || 0) + 1;
        types.add(type);
      });

    return dist;
  }, [trainingSessions]);

  const chartColors = [
    "#59d8e5",
    "#b1c6f9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
  ];

  return (
    <section className={styles.analyticsPage} role="main">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Analytics de Performance</h1>
          <p>Progression technique des 30 derniers jours</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>⏱️</div>
          <div className={styles.metricContent}>
            <h3>Volume d'entraînement</h3>
            <p className={styles.metricValue}>{stats.monthlyHours}h</p>
            <span className={styles.metricLabel}>ce mois</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🔥</div>
          <div className={styles.metricContent}>
            <h3>Série actuelle</h3>
            <p className={styles.metricValue}>{achievements.streak}</p>
            <span className={styles.metricLabel}>jours</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>🏆</div>
          <div className={styles.metricContent}>
            <h3>Sessions</h3>
            <p className={styles.metricValue}>{stats.thisMonth}</p>
            <span className={styles.metricLabel}>ce mois</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📅</div>
          <div className={styles.metricContent}>
            <h3>Durée moyenne</h3>
            <p className={styles.metricValue}>{stats.avgSessionDuration}m</p>
            <span className={styles.metricLabel}>par session</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsSection}>
        <div className={styles.chartRow}>
          <LineChart
            data={last30Days}
            label="Volume d'entraînement quotidien (minutes)"
          />
        </div>

        <div className={styles.chartRow}>
          <div className={styles.chartHalf}>
            <PieChart
              data={typeDistribution}
              label="Distribution des styles"
              colors={chartColors}
            />
          </div>
          <div className={styles.chartHalf}>
            <div className={styles.weeklyIntensity}>
              <h3>Intensité hebdomadaire</h3>
              <div className={styles.intensityBar}>
                <div
                  className={styles.intensityFill}
                  style={{ width: "88%" }}
                />
              </div>
              <p>Avancé : 88%</p>
              <p className={styles.intensityNote}>
                Vous avez atteint la fréquence cardiaque de niveau compétition
                dans 4/5 sessions cette semaine.
              </p>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <HeatmapCalendar sessions={trainingSessions} />
      </div>

      {/* Top Partners Section */}
      <div className={styles.topPartnersSection}>
        <div className={styles.sectionHeader}>
          <h2>Meilleurs partenaires d'entraînement</h2>
          <a href="#all" className={styles.viewAll}>
            Voir tout
          </a>
        </div>
        <div className={styles.partnersList}>
          {[
            {
              name: "Marcus Klitschko",
              rounds: 24,
              belt: "black",
              weight: "heavyweight",
            },
            {
              name: "Sarah Lopez",
              rounds: 18,
              belt: "purple",
              weight: "lightweight",
            },
            {
              name: "Julian Chen",
              rounds: 15,
              belt: "brown",
              weight: "middleweight",
            },
          ].map((partner, idx) => (
            <div key={idx} className={styles.partnerCard}>
              <div className={styles.partnerAvatar}>
                {partner.name.substring(0, 1)}
              </div>
              <div className={styles.partnerInfo}>
                <h4>{partner.name}</h4>
                <span
                  className={styles.beltBadge}
                  style={{
                    backgroundColor: {
                      white: "#e5e5e5",
                      blue: "#3b82f6",
                      purple: "#a855f7",
                      brown: "#92400e",
                      black: "#1f2937",
                    }[partner.belt],
                  }}
                >
                  {partner.belt.toUpperCase()}
                </span>
              </div>
              <div className={styles.partnerStats}>
                <span className={styles.roundsCount}>{partner.rounds}</span>
                <span className={styles.roundsLabel}>rounds</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnalyticsPage;
