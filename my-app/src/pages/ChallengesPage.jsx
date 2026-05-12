import { useCallback, useState } from "react";
import { useApp } from "../context/AppContext";
import styles from "./ChallengesPage.module.scss";

/**
 * ChallengesPage - Personal goals and progress tracking (refactored for EFFETMER)
 * Removed community leaderboard, focused on individual progression
 */
function ChallengesPage() {
  const { goals, addGoal, completeGoal, deleteGoal, stats, userProfile } =
    useApp();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: 0,
    category: "sessions", // sessions, techniques, duration, submission
    deadline: "",
  });

  const goalCategories = [
    { value: "sessions", label: "📅 Séances d'entraînement", icon: "📅" },
    { value: "techniques", label: "📚 Techniques", icon: "📚" },
    { value: "duration", label: "⏱️ Durée", icon: "⏱️" },
    { value: "submission", label: "🔗 Soumissions", icon: "🔗" },
    { value: "other", label: "🎯 Autre", icon: "🎯" },
  ];

  // Handle add new goal
  const handleAddGoal = useCallback(() => {
    if (newGoal.title && newGoal.target > 0) {
      addGoal({
        ...newGoal,
        current: 0,
        createdAt: new Date().toISOString(),
      });
      setNewGoal({
        title: "",
        description: "",
        target: 0,
        category: "sessions",
        deadline: "",
      });
      setShowAddGoal(false);
    }
  }, [newGoal, addGoal]);

  // Handle complete goal
  const handleCompleteGoal = useCallback(
    (goalId) => {
      if (window.confirm("Marquer cet objectif comme complété ?")) {
        completeGoal(goalId);
      }
    },
    [completeGoal],
  );

  // Calculate goal progress percentage
  const getProgressPercentage = (goal) => {
    return Math.round((goal.current / goal.target) * 100);
  };

  return (
    <section className={styles.challengesPage} role="main">
      {/* Header */}
      <div className={styles.header}>
        <h1>🎯 Mes Objectifs</h1>
        <p>
          Suivez votre progression personnelle et atteignez vos objectifs BJJ
        </p>
      </div>

      {/* Add Goal Section */}
      {!showAddGoal ? (
        <button
          className={`${styles.btn} ${styles.addGoalBtn}`}
          onClick={() => setShowAddGoal(true)}
        >
          + Ajouter un nouvel objectif
        </button>
      ) : (
        <div className={styles.addGoalForm}>
          <h2>Créer un nouvel objectif</h2>

          <div className={styles.formGroup}>
            <label htmlFor="title">Nom de l'objectif</label>
            <input
              id="title"
              type="text"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="ex: Apprendre 10 nouvelles techniques"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Catégorie</label>
            <div className={styles.categoryGrid}>
              {goalCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={`${styles.categoryOption} ${
                    newGoal.category === cat.value ? styles.selected : ""
                  }`}
                  onClick={() =>
                    setNewGoal((prev) => ({ ...prev, category: cat.value }))
                  }
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.twoColumn}>
            <div className={styles.formGroup}>
              <label htmlFor="target">Cible</label>
              <input
                id="target"
                type="number"
                value={newGoal.target}
                onChange={(e) =>
                  setNewGoal((prev) => ({
                    ...prev,
                    target: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="10"
                min="1"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="deadline">Délai (optionnel)</label>
              <input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) =>
                  setNewGoal((prev) => ({ ...prev, deadline: e.target.value }))
                }
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Détails sur cet objectif..."
              rows="2"
            />
          </div>

          <div className={styles.formActions}>
            <button
              className={`${styles.btn} ${styles.primary}`}
              onClick={handleAddGoal}
            >
              Créer l'objectif
            </button>
            <button
              className={`${styles.btn} ${styles.secondary}`}
              onClick={() => setShowAddGoal(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Active Goals Section */}
      <div className={styles.goalsSection}>
        <h2>Objectifs Actifs ({goals.current.length})</h2>

        {goals.current.length === 0 ? (
          <div className={styles.emptyState}>
            <p>📭 Aucun objectif actif</p>
            <p className={styles.emptyHint}>
              Créez votre premier objectif pour commencer votre progression
              personnelle
            </p>
          </div>
        ) : (
          <div className={styles.goalsList}>
            {goals.current.map((goal) => (
              <div key={goal.id} className={styles.goalCard}>
                <div className={styles.goalHeader}>
                  <div className={styles.goalTitle}>
                    <span className={styles.categoryIcon}>
                      {
                        goalCategories.find((c) => c.value === goal.category)
                          ?.icon
                      }
                    </span>
                    <h3>{goal.title}</h3>
                  </div>
                  <div className={styles.goalActions}>
                    <button
                      className={styles.completeBtn}
                      onClick={() => handleCompleteGoal(goal.id)}
                      title="Mark as completed"
                    >
                      ✓
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => deleteGoal(goal.id)}
                      title="Delete goal"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className={styles.goalDescription}>{goal.description}</p>
                )}

                <div className={styles.progressSection}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${getProgressPercentage(goal)}%`,
                      }}
                    />
                  </div>
                  <div className={styles.progressText}>
                    <span>
                      {goal.current} / {goal.target}
                    </span>
                    <span>{getProgressPercentage(goal)}%</span>
                  </div>
                </div>

                {goal.deadline && (
                  <p className={styles.deadline}>
                    📅 Délai:{" "}
                    {new Date(goal.deadline).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Goals Section */}
      {goals.completed.length > 0 && (
        <div className={styles.completedSection}>
          <h2>Objectifs Réalisés ({goals.completed.length})</h2>
          <div className={styles.completedList}>
            {goals.completed.map((goal) => (
              <div key={goal.id} className={styles.completedCard}>
                <div className={styles.completedIcon}>✓</div>
                <div className={styles.completedInfo}>
                  <h4>{goal.title}</h4>
                  <p>
                    Complété le{" "}
                    {new Date(goal.completedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className={styles.statsSection}>
        <h2>Statistiques personnelles</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{goals.current.length}</div>
            <div className={styles.statLabel}>Objectifs actifs</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{goals.completed.length}</div>
            <div className={styles.statLabel}>Objectifs réalisés</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.thisWeek}</div>
            <div className={styles.statLabel}>Entraînements cete semaine</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {goals.current.length > 0
                ? Math.round(
                    goals.current.reduce(
                      (sum, g) => sum + getProgressPercentage(g),
                      0,
                    ) / goals.current.length,
                  )
                : 0}
              %
            </div>
            <div className={styles.statLabel}>Progression moyenne</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChallengesPage;
