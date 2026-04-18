import {
  faBook,
  faCalendarAlt,
  faClock,
  faDumbbell,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import logo from "../assets/logo.png";
import ProgressCircle from "../components/ProgressCircle.jsx";
import StatCard from "../components/StatCard.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.jsx";
import styles from "./HomePage.module.scss";

/**
 * HomePage - Home page with training statistics overview
 * Displays weekly progress, session count, total time, techniques learned
 */
function HomePage() {
  const [trainingSessions] = useLocalStorage("trainingSessions", []);
  const [techniques] = useLocalStorage("techniques", []);

  // Optimized statistics calculation with memoization
  const stats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeek = trainingSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek;
    });

    const totalDuration = trainingSessions.reduce(
      (sum, s) => sum + Number(s.duration || 0),
      0,
    );

    const lastSession =
      trainingSessions.length > 0
        ? trainingSessions[trainingSessions.length - 1].date
        : null;

    return {
      total: trainingSessions.length,
      thisWeek: thisWeek.length,
      totalDuration: Math.round(totalDuration),
      totalHours: Math.round(totalDuration / 60),
      lastDate: lastSession,
      techniqueCount: techniques.length,
    };
  }, [trainingSessions, techniques]);

  const formatDate = (dateString) => {
    if (!dateString) return "Aucun";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Date invalide";
    }
  };

  const WEEKLY_GOAL = 5;

  return (
    <section className={styles.homepage} role="main">
      {/* Hero header with welcome message */}
      <div className={styles.homepage__header}>
        <div className={styles.homepage__hero}>
          <img src={logo} alt="EffetMer BJJ Logo" loading="lazy" />
          <div className={styles.homepage__hero_text}>
            <h1>Bienvenue</h1>
            <p>Suivi de progression BJJ</p>
          </div>
        </div>
      </div>

      {/* Weekly progress circle */}
      <div className={styles.homepage__progress}>
        <ProgressCircle
          value={Math.min(stats.thisWeek, WEEKLY_GOAL)}
          max={WEEKLY_GOAL}
          size={140}
          label="Objectif hebdomadaire"
        />
      </div>

      {/* Main statistics with gradient cards */}
      <div className={styles.homepage__stats_row}>
        <StatCard
          icon={faCalendarAlt}
          label="Cette semaine"
          value={stats.thisWeek}
          variant="primary"
        />
        <StatCard
          icon={faDumbbell}
          label="Au total"
          value={stats.total}
          variant="accent"
        />
      </div>

      <div className={styles.homepage__stats_row}>
        <StatCard
          icon={faClock}
          label="Temps"
          value={`${stats.totalHours}h`}
          variant="success"
        />
        <StatCard
          icon={faBook}
          label="Techniques"
          value={stats.techniqueCount}
          variant="primary"
        />
      </div>

      {/* Last training session */}
      <div className={styles.homepage__last_session}>
        <StatCard
          icon={faHistory}
          label="Dernier entraînement"
          value={formatDate(stats.lastDate)}
          variant="accent"
        />
      </div>
    </section>
  );
}

export default HomePage;
