import { memo, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { calculateWeeklyIntensity } from "../lib/analyticsService";
import { normalizeDateToMidnight, toISODateString } from "../lib/dateUtils";
import styles from "./AnalyticsPage.module.scss";

/**
 * LineChart Component - Simple SVG line chart
 * Memoized for performance optimization
 */
const LineChart = memo(function LineChart({ data, label, color = "#59d8e5" }) {
  // Guard: ensure data is array and non-empty
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  // Filter out invalid data points
  const validData = data.filter((d) => typeof d === "number" && !isNaN(d));
  if (validData.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  const maxValue = Math.max(...validData, 1);
  const padding = 40;
  const chartHeight = 200;
  const chartWidth = 400;
  const pointsSpacing =
    (chartWidth - padding * 2) / (validData.length - 1 || 1);

  const points = validData
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
        {validData.map((value, index) => (
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
});

/**
 * PieChart Component - Simple SVG pie chart
 * Memoized for performance optimization
 */
const PieChart = memo(function PieChart({ data, label, colors }) {
  // Guard: ensure data is object and not empty
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  const validData = Object.entries(data).reduce((acc, [key, value]) => {
    const num = Number(value);
    if (!isNaN(num) && num >= 0) {
      acc[key] = num;
    }
    return acc;
  }, {});

  const total = Object.values(validData).reduce((sum, val) => sum + val, 0);

  if (total === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>Pas encore de sessions</p>
      </div>
    );
  }

  let currentAngle = -Math.PI / 2;
  const slices = Object.entries(validData).map(([name, value], index) => {
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
        {Object.entries(validData).map(([name, value], index) => (
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
});

/**
 * HeatmapCalendar - Github-style activity heatmap
 * Shows training activity over last 12 weeks
 * Memoized for performance optimization
 */
const HeatmapCalendar = memo(function HeatmapCalendar({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className={styles.heatmapContainer}>
        <h3>Training Activity (Last 12 Weeks)</h3>
        <p style={{ textAlign: "center", opacity: 0.6 }}>No sessions yet</p>
      </div>
    );
  }

  // Create session count by ISO date string
  const sessionsByDate = {};
  sessions.forEach((session) => {
    const dateStr = toISODateString(session.date);
    sessionsByDate[dateStr] = (sessionsByDate[dateStr] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(sessionsByDate), 1);

  // Generate grid for last 12 weeks (84 days)
  const today = normalizeDateToMidnight(new Date());
  const twelveWeeksAgo = new Date(today);
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);

  const days = [];
  const currentDate = new Date(twelveWeeksAgo);

  while (currentDate <= today) {
    const dateStr = toISODateString(currentDate);
    const count = sessionsByDate[dateStr] || 0;
    const intensity = Math.min(count / maxCount, 1);

    days.push({
      dateStr,
      count,
      intensity,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Organize into weeks (7 days per week)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, Math.min(i + 7, days.length)));
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
});

/**
 * AnalyticsPage - Comprehensive analytics and statistics dashboard
 */
function AnalyticsPage() {
  usePageTitle("Analytics");
  const { stats, trainingSessions, achievements, userProfile } = useApp();

  // Generate last 30 days of data
  const last30Days = useMemo(() => {
    const daily = {};
    const today = normalizeDateToMidnight(new Date());

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = toISODateString(date);
      daily[dateStr] = 0;
    }

    trainingSessions.forEach((session) => {
      const dateStr = toISODateString(session.date);
      if (dateStr in daily) {
        daily[dateStr] += Number(session.duration || 0);
      }
    });

    return Object.values(daily);
  }, [trainingSessions]);

  // Training volume by type (last 30 days)
  const typeDistribution = useMemo(() => {
    const dist = {};
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    trainingSessions
      .filter((s) => new Date(s.date) >= thirtyDaysAgo)
      .forEach((session) => {
        const type = session.type || "other";
        dist[type] = (dist[type] || 0) + 1;
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
              {(() => {
                // Calculate real intensity based on actual sessions
                const weeklyGoal = userProfile?.weeklyGoal || 4;
                const intensityData = calculateWeeklyIntensity(
                  trainingSessions,
                  weeklyGoal,
                );

                // Show empty state for new users
                if (intensityData.intensity === 0) {
                  return (
                    <>
                      <div className={styles.intensityBar}>
                        <div
                          className={styles.intensityFill}
                          style={{ width: "0%" }}
                        />
                      </div>
                      <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                        {intensityData.label}
                      </p>
                      <p className={styles.intensityNote}>
                        {intensityData.detail}
                      </p>
                    </>
                  );
                }

                return (
                  <>
                    <div className={styles.intensityBar}>
                      <div
                        className={styles.intensityFill}
                        style={{
                          width: `${intensityData.intensity}%`,
                          backgroundColor:
                            intensityData.intensity >= 75
                              ? "#fbbf24" // gold for elite
                              : intensityData.intensity >= 60
                                ? "#59d8e5" // turquoise for advanced
                                : intensityData.intensity >= 45
                                  ? "#3b82f6" // blue for intermediate
                                  : "#9ca3af", // gray for light
                        }}
                      />
                    </div>
                    <p style={{ fontWeight: 600 }}>
                      {intensityData.label} : {intensityData.intensity}%
                    </p>
                    <p className={styles.intensityNote}>
                      {intensityData.detail}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#9ca3af",
                        marginTop: "0.5rem",
                      }}
                    >
                      {intensityData.sessionsThisWeek} session
                      {intensityData.sessionsThisWeek !== 1 ? "s" : ""}
                      {" · "}
                      {intensityData.daysActive} jour
                      {intensityData.daysActive !== 1 ? "s" : ""} actif
                      {intensityData.daysActive !== 1 ? "s" : ""}
                      {" · "}
                      {intensityData.totalDurationHours}h total
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <HeatmapCalendar sessions={trainingSessions} />
      </div>

      {/* Top Partners section removed per request */}
    </section>
  );
}

export default AnalyticsPage;
