import { useState } from "react";
import { useApp } from "../context/AppContext";
import styles from "./ProfilePage.module.scss";

/**
 * Badge Component - Display individual achievement badge
 */
function Badge({ badge, earned }) {
  return (
    <div className={`${styles.badge} ${earned ? styles.badgeEarned : ""}`}>
      <div className={styles.badgeIcon}>{badge.icon}</div>
      <h4>{badge.name}</h4>
      <p>{badge.description}</p>
      {!earned && <span className={styles.badgeLocked}>🔒 Verrouillé</span>}
    </div>
  );
}

/**
 * BeltProgress Component - Show belt progression journey
 */
function BeltProgress({ currentBelt, beltHistory }) {
  const BELT_ORDER = [
    { id: "white", label: "Blanc", color: "#e5e5e5", started: true },
    { id: "blue", label: "Bleu", color: "#3b82f6", started: false },
    { id: "purple", label: "Mauve", color: "#a855f7", started: false },
    { id: "brown", label: "Marron", color: "#92400e", started: false },
    { id: "black", label: "Noir", color: "#1f2937", started: false },
  ];

  const currentIndex = BELT_ORDER.findIndex((b) => b.id === currentBelt);

  return (
    <div className={styles.beltProgress}>
      <h3>Parcours de progression de ceinture</h3>
      <div className={styles.beltTimeline}>
        {BELT_ORDER.map((belt, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const beltData = beltHistory?.find((b) => b.belt === belt.id) || {};

          return (
            <div
              key={belt.id}
              className={`${styles.beltStep} ${isCurrent ? styles.beltStepCurrent : ""} ${isCompleted ? styles.beltStepCompleted : ""}`}
            >
              <div
                className={styles.beltCircle}
                style={{ backgroundColor: belt.color }}
              >
                {isCurrent && (
                  <span className={styles.beltCurrentMarker}>→</span>
                )}
                {isCompleted && <span className={styles.beltCheckmark}>✓</span>}
              </div>
              <div className={styles.beltInfo}>
                <h4>{belt.label}</h4>
                {isCompleted || isCurrent ? (
                  <p>
                    {beltData.awardedDate
                      ? new Date(beltData.awardedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                          },
                        )
                      : isCurrent
                        ? "Actuel"
                        : "Complété"}
                  </p>
                ) : (
                  <p className={styles.beltLocked}>Verrouillé</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ProfilePage - User profile, achievements, and statistics
 */
function ProfilePage() {
  const {
    userProfile,
    updateUserProfile,
    stats,
    achievements,
    BADGE_DEFINITIONS,
  } = useApp();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    belt: userProfile.belt,
    academy: userProfile.academy,
    weight: userProfile.weight,
    yearsOfPractice: userProfile.yearsOfPractice,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUserProfile({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      belt: editForm.belt,
      academy: editForm.academy,
      weight: editForm.weight,
      yearsOfPractice: editForm.yearsOfPractice,
    });
    setShowEditProfile(false);
  };

  const BELT_COLORS = {
    white: "#e5e5e5",
    blue: "#3b82f6",
    purple: "#a855f7",
    brown: "#92400e",
    black: "#1f2937",
  };

  const beltColor = BELT_COLORS[userProfile.belt] || "#e5e5e5";

  return (
    <section className={styles.profilePage} role="main">
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.hiLogo}>
          <div
            className={styles.profileAvatar}
            style={{ backgroundColor: beltColor }}
          >
            {userProfile.name.substring(0, 1)}
          </div>
        </div>

        <div className={styles.profileInfo}>
          <h1>
            {userProfile.firstName} {userProfile.lastName}
          </h1>
          <div className={styles.profileMeta}>
            <span
              className={styles.beltLabel}
              style={{ backgroundColor: beltColor }}
            >
              CEINTURE {userProfile.belt.toUpperCase()}
            </span>
            <span className={styles.academyName}>🏆 {userProfile.academy}</span>
          </div>
        </div>

        <button
          className={styles.editButton}
          onClick={() => setShowEditProfile(!showEditProfile)}
          aria-label="Edit profile"
        >
          ✏️ Modifier
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className={styles.editModal}>
          <div className={styles.editModalContent}>
            <h3>Modifier le profil</h3>
            <form onSubmit={handleSaveProfile}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Prénom</label>
                <input
                  id="firstName"
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstName: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="lastName">Nom</label>
                <input
                  id="lastName"
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastName: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="weight">Poids (kg)</label>
                <input
                  id="weight"
                  type="number"
                  value={editForm.weight}
                  onChange={(e) =>
                    setEditForm({ ...editForm, weight: Number(e.target.value) })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="yearsOfPractice">Années de Pratique</label>
                <input
                  id="yearsOfPractice"
                  type="number"
                  value={editForm.yearsOfPractice}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      yearsOfPractice: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="belt">Ceinture</label>
                <select
                  id="belt"
                  value={editForm.belt}
                  onChange={(e) =>
                    setEditForm({ ...editForm, belt: e.target.value })
                  }
                >
                  <option value="white">Blanc</option>
                  <option value="blue">Bleu</option>
                  <option value="purple">Mauve</option>
                  <option value="brown">Marron</option>
                  <option value="black">Noir</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="academy">Académie</label>
                <input
                  id="academy"
                  type="text"
                  value={editForm.academy}
                  onChange={(e) =>
                    setEditForm({ ...editForm, academy: e.target.value })
                  }
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => setShowEditProfile(false)}>
                  Annuler
                </button>
                <button type="submit" className={styles.primary}>
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* All-Time Stats */}
      <div className={styles.allTimeStats}>
        <h2>Statistiques de tous les temps</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <div className={styles.statIcon}>⏱️</div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stats.totalHours}</p>
              <p className={styles.statLabel}>Total heures</p>
            </div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statIcon}>🥋</div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stats.total}</p>
              <p className={styles.statLabel}>Total sessions</p>
            </div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statIcon}>📚</div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stats.techniqueCount}</p>
              <p className={styles.statLabel}>Techniques apprises</p>
            </div>
          </div>

          <div className={styles.statBox}>
            <div className={styles.statIcon}>🔥</div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{achievements.longestStreak}</p>
              <p className={styles.statLabel}>Meilleure série</p>
            </div>
          </div>
        </div>
      </div>

      {/* Belt Progression */}
      <BeltProgress
        currentBelt={userProfile.belt}
        beltHistory={[{ belt: "white", awardedDate: userProfile.joinDate }]}
      />

      {/* Hall of Fame - Achievements */}
      <div className={styles.hallOfFame}>
        <div className={styles.hallHeader}>
          <h2>🏅 Hall de la Gloire</h2>
          <p>Rang: Pratiquant élite</p>
        </div>

        <div className={styles.achievementsContainer}>
          <h3>Réalisations débloquées: {achievements.badges.length}</h3>
          <div className={styles.badgesGrid}>
            {Object.values(BADGE_DEFINITIONS).map((badge) => (
              <Badge key={badge.id} badge={badge} earned={badge.earned} />
            ))}
          </div>
        </div>

        {/* Mastery Section */}
        <div className={styles.masterySection}>
          <h3>Réalisations de maîtrise</h3>
          <div className={styles.masteryGrid}>
            <div className={styles.masteryCard}>
              <div className={styles.masteryIcon}>🛡️</div>
              <h4>Roi de la garde</h4>
              <p>Effectuez 50 balayages réussis depuis la garde fermée.</p>
              <div className={styles.masteryProgress}>
                <span>Progression: 27/50</span>
              </div>
            </div>

            <div className={styles.masteryCard}>
              <div className={styles.masteryIcon}>🏆</div>
              <h4>Spécialiste de soumission</h4>
              <p>Terminez 10 adversaires avec différentes étranglements.</p>
              <div className={styles.masteryProgress}>
                <span>Progression: 7/10</span>
              </div>
            </div>

            <div className={styles.masteryCard}>
              <div className={styles.masteryIcon}>💪</div>
              <h4>Puissance maison</h4>
              <p>Complétez 10 sessions de force en un mois.</p>
              <div className={styles.masteryProgress}>
                <span>Progression: 0/10 (Mensuel)</span>
              </div>
            </div>

            <div className={styles.masteryCard}>
              <div className={styles.masteryIcon}>⏱️</div>
              <h4>Heures supplémentaires</h4>
              <p>Passez 500 heures sur le tapis en un seul an.</p>
              <div className={styles.masteryProgress}>
                <span>Progression: {stats.totalHours}/500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Consistency Section */}
        <div className={styles.consistencySection}>
          <h3>Badges de cohérence</h3>
          <div className={styles.consistencyGrid}>
            <div className={styles.consistencyCard}>
              <div className={styles.consistencyIcon}>🔥</div>
              <h4>Encendido</h4>
              <p>Assister aux cours pendant 30 jours consécutifs.</p>
            </div>

            <div className={styles.consistencyCard}>
              <div className={styles.consistencyIcon}>⭐</div>
              <h4>Vétéran</h4>
              <p>Maintenez une série d'entraînement pendant 6 mois.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Section */}
      <div className={styles.socialSection}>
        <h3>Prouesses sociales</h3>
        <div className={styles.socialGrid}>
          <div className={styles.socialCard}>
            <div className={styles.socialIcon}>👥</div>
            <h4>Joueur d'équipe</h4>
            <p>
              Aidez 5 nouveaux ceintures blanches avec leur première foreuse.
            </p>
          </div>

          <div className={styles.socialCard}>
            <div className={styles.socialIcon}>🤝</div>
            <h4>Ambassadeur</h4>
            <p>Présentez 3 amis pour rejoindre l'académie.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
