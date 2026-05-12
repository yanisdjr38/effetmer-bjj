import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import styles from "./HomePage.module.scss";

/**
 * HomePage - Personal dashboard with streaks, next session, and key metrics
 * Displays current streak, next scheduled session, last training, and performance metrics
 */
function HomePage() {
  usePageTitle("Accueil");
  const {
    stats,
    achievements,
    userProfile,
    trainingSessions,
    trainingSchedule,
  } = useApp();

  // Calculate streak percentage
  const streakPercentage = Math.min((achievements.streak / 7) * 100, 100);

  // Calculate next scheduled session from recurring schedule
  const nextSession = useMemo(() => {
    if (trainingSchedule.sessions.length === 0) {
      // Fallback if no schedule configured
      return {
        time: "À configurer",
        location: userProfile.academy || "Academy",
        address: "-- Configurer votre horaire --",
        type: "Non planifié",
        daysUntil: null,
      };
    }

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    let nextSessionFound = null;
    let daysAhead = 0;

    // Check sessions for this week and next
    for (let i = 0; i < 14; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const dayName = daysOfWeek[checkDate.getDay()];

      const sessionsForDay = trainingSchedule.sessions.filter(
        (s) => s.day === dayName && s.enabled,
      );

      if (sessionsForDay.length > 0) {
        nextSessionFound = sessionsForDay[0];
        daysAhead = i;
        break;
      }
    }

    if (!nextSessionFound) {
      return {
        time: "Pas de session prévue",
        location: userProfile.academy || "Academy",
        address: "Configurez votre horaire",
        type: "Non planifié",
        daysUntil: null,
      };
    }

    return {
      time: nextSessionFound.startTime,
      location: userProfile.academy || "Academy HQ",
      address:
        nextSessionFound.notes || "-- Ajouter de détails à votre horaire --",
      type: nextSessionFound.trainingType,
      daysUntil: daysAhead,
      endTime: nextSessionFound.endTime,
    };
  }, [trainingSchedule, userProfile.academy]);

  // Get last training session details
  const lastTraining = useMemo(() => {
    if (trainingSessions.length === 0) return null;
    const last = trainingSessions[trainingSessions.length - 1];
    const date = new Date(last.date);
    return {
      ...last,
      dateStr: date.toLocaleDateString("fr-FR", {
        month: "short",
        day: "numeric",
      }),
      typeLabel:
        {
          techniques: "Technique",
          drill: "Drill",
          sparring: "Sparring",
          openmat: "Open Mat",
          muscu: "Musculation",
          cardio: "Cardio",
          competition: "Compétition",
        }[last.type] || "Entraînement",
    };
  }, [trainingSessions]);

  // Format day display
  const getDayDisplay = () => {
    if (nextSession.daysUntil === null) return "";
    if (nextSession.daysUntil === 0) return "Aujourd'hui";
    if (nextSession.daysUntil === 1) return "Demain";
    return `Dans ${nextSession.daysUntil} jours`;
  };

  return (
    <section className={styles.homepage} role="main">
      {/* Top Navigation for Home Page */}
      <div className={styles.homeHeader}>
        <div className={styles.headerTitleBox}>
          <h1>EFFETMER</h1>
        </div>
        <button className={styles.notificationBell} aria-label="Notifications">
          🔔
        </button>
      </div>

      {/* Current Streak Section */}
      <div className={styles.streakSection}>
        <div className={styles.streakContent}>
          <div className={styles.streakIcon}>🔥</div>
          <div className={styles.streakInfo}>
            <h2>
              {achievements.streak}{" "}
              <span className={styles.streakLabel}>Jours</span>
            </h2>
            <p className={styles.streakMotivation}>Continuez comme ça!</p>
            <div className={styles.streakProgress}>
              {[...Array(userProfile.weeklyGoal || 5)].map((_, i) => (
                <span
                  key={i}
                  className={`${styles.streakDot} ${
                    i < achievements.streak ? styles.active : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.streakMeta}>
          <span className={styles.streakNote}>
            {Math.max(0, (userProfile.weeklyGoal || 5) - achievements.streak)}{" "}
            plus pour cette semaine
          </span>
        </div>
      </div>

      {/* Next Session Card */}
      {trainingSchedule.sessions.length > 0 ? (
        <div className={styles.nextSessionCard}>
          <div className={styles.sessionHeader}>
            <span className={styles.sessionLabel}>PROCHAINE SESSION</span>
            <span className={styles.sessionCountdown}>{getDayDisplay()}</span>
          </div>

          <div className={styles.sessionTime}>
            <span className={styles.timeValue}>{nextSession.time}</span>
            <span className={styles.sessionType}>
              {nextSession.type || "Entraînement"}
            </span>
          </div>

          <div className={styles.sessionDetails}>
            <div className={styles.sessionDetail}>
              <span className={styles.detailLabel}>Lieu</span>
              <span className={styles.detailValue}>{nextSession.location}</span>
            </div>
            <div className={styles.sessionDetail}>
              <span className={styles.detailLabel}>Détails</span>
              <span className={styles.detailValue}>{nextSession.address}</span>
            </div>
          </div>

          <Link to="/settings" className={styles.navigateBtn}>
            GÉRER HORAIRE →
          </Link>
        </div>
      ) : (
        <div className={`${styles.nextSessionCard} ${styles.empty}`}>
          <p>📅 Configurez votre horaire d'entraînement dans les paramètres</p>
          <Link to="/settings" className={styles.navigateBtn}>
            CONFIGURER MAINTENANT
          </Link>
        </div>
      )}

      {/* Last Training Section */}
      {lastTraining && (
        <div className={styles.lastTrainingSection}>
          <h3>Dernier entraînement</h3>
          <div className={styles.lastTrainingCard}>
            <div className={styles.trainingHeader}>
              <span className={styles.trainingType}>
                {lastTraining.typeLabel}
              </span>
              <span className={styles.trainingDuration}>
                {lastTraining.duration}m
              </span>
            </div>
            <div className={styles.trainingDate}>{lastTraining.dateStr}</div>
            {lastTraining.note && (
              <p className={styles.trainingNote}>{lastTraining.note}</p>
            )}
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className={styles.metricsSection}>
        <h3>Aperçu de performance</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricBox}>
            <div className={styles.metricIcon}>⏱️</div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Volume d'entraînement</span>
              <span className={styles.metricValue}>{stats.monthlyHours}h</span>
              <span className={styles.metricNote}>Ce mois</span>
            </div>
          </div>

          <div className={styles.metricBox}>
            <div className={styles.metricIcon}>💪</div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Sessions</span>
              <span className={styles.metricValue}>{stats.thisMonth}</span>
              <span className={styles.metricNote}>Ce mois</span>
            </div>
          </div>

          <div className={styles.metricBox}>
            <div className={styles.metricIcon}>🏆</div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Accomplissements</span>
              <span className={styles.metricValue}>
                {achievements.badges.length}
              </span>
              <span className={styles.metricNote}>Débloqués</span>
            </div>
          </div>

          <div className={styles.metricBox}>
            <div className={styles.metricIcon}>📚</div>
            <div className={styles.metricContent}>
              <span className={styles.metricLabel}>Techniques</span>
              <span className={styles.metricValue}>{stats.techniqueCount}</span>
              <span className={styles.metricNote}>Apprises</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActionsSection}>
        <Link to="/training" className={styles.actionButton}>
          💪 Enregistrer l'entraînement
        </Link>
        <Link to="/timer" className={styles.actionButton}>
          ⏱️ Démarrer Timer
        </Link>
        <Link to="/analytics" className={styles.actionButton}>
          📊 Voir Analytics
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
