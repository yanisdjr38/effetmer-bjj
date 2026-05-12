/**
 * progressionSystem.js - Real progression-based rank system
 * Calculates user rank based on actual achievements, not defaults
 * Ensures authentic, earned progression
 */

/**
 * Define progression tiers - scalable and motivating
 * Each tier unlocks new capabilities/badges in future updates
 */
const PROGRESSION_TIERS = [
  {
    tier: 0,
    name: "Débutant",
    threshold: 0,
    hoursThreshold: 0,
    description: "Première visite sur le tapis",
    icon: "🥋",
    color: "#9ca3af", // gray
  },
  {
    tier: 1,
    name: "Pratiquant Régulier",
    threshold: 5,
    hoursThreshold: 3,
    description: "Engagement initial montré",
    icon: "🔥",
    color: "#fbbf24", // amber
  },
  {
    tier: 2,
    name: "Combattant Discipliné",
    threshold: 20,
    hoursThreshold: 18,
    description: "Discipline et constance établies",
    icon: "⚔️",
    color: "#21b8ff", // cyan
  },
  {
    tier: 3,
    name: "Grappler Expérimenté",
    threshold: 50,
    hoursThreshold: 40,
    description: "Expérience significative acquise",
    icon: "🏆",
    color: "#59d8e5", // primary turquoise
  },
  {
    tier: 4,
    name: "Pratiquant Élite",
    threshold: 100,
    hoursThreshold: 80,
    description: "Maîtrise et dévouement démontrés",
    icon: "👑",
    color: "#fbbf24", // gold
  },
];

/**
 * Calculate user's progression tier based on real metrics
 * @param {number} sessionCount - Total number of sessions completed
 * @param {number} totalHours - Total training hours
 * @param {number} currentStreak - Current daily streak (bonus)
 * @param {number} goalsCompleted - Number of goals completed (bonus)
 * @param {number} achievementsUnlocked - Number of achievements unlocked (bonus)
 * @returns {Object} - Tier info {tier, name, next, progress, icon, color, description}
 */
export const calculateUserTier = (
  sessionCount = 0,
  totalHours = 0,
  currentStreak = 0,
  goalsCompleted = 0,
  achievementsUnlocked = 0,
) => {
  // Ensure numeric values
  sessionCount = Number(sessionCount) || 0;
  totalHours = Number(totalHours) || 0;
  currentStreak = Number(currentStreak) || 0;
  goalsCompleted = Number(goalsCompleted) || 0;
  achievementsUnlocked = Number(achievementsUnlocked) || 0;

  let currentTier = PROGRESSION_TIERS[0]; // Default to Débutant

  // Find the highest tier the user has unlocked
  for (let i = PROGRESSION_TIERS.length - 1; i >= 0; i--) {
    const tier = PROGRESSION_TIERS[i];
    // Check if user meets threshold for this tier
    if (sessionCount >= tier.threshold && totalHours >= tier.hoursThreshold) {
      currentTier = tier;
      break;
    }
  }

  // Calculate progress to next tier
  let nextTier =
    PROGRESSION_TIERS.find((t) => t.tier === currentTier.tier + 1) || null;
  let progressToNext = 0;
  let nextThreshold = null;

  if (nextTier) {
    // Use sessions as primary metric (most visible to user)
    const sessionsNeeded = Math.max(nextTier.threshold - sessionCount, 0);
    const sessionProgressPercent = Math.min(
      ((sessionCount - currentTier.threshold) /
        (nextTier.threshold - currentTier.threshold)) *
        100,
      100,
    );

    progressToNext = Math.round(sessionProgressPercent);
    nextThreshold = nextTier.threshold;
  }

  // Apply streak bonus for additional motivation (visual indicator only)
  const streakBonus = currentStreak > 0 ? Math.min(currentStreak * 5, 20) : 0;

  return {
    tier: currentTier.tier,
    name: currentTier.name,
    icon: currentTier.icon,
    color: currentTier.color,
    description: currentTier.description,
    progressToNext: nextTier ? progressToNext : 100,
    nextTier: nextTier ? nextTier.name : null,
    nextThreshold,
    streakBonus, // Show "Current streak gives +Xpts" style motivation
    isElite: currentTier.tier === 4,
    stats: {
      sessionCount,
      totalHours,
      currentStreak,
      goalsCompleted,
      achievementsUnlocked,
    },
  };
};

/**
 * Get all progression tiers for rendering progression bars/info
 * Useful for ProfilePage to show the full journey ahead
 * @returns {Array} - All tiers with thresholds
 */
export const getProgressionTiers = () => {
  return PROGRESSION_TIERS.map((tier) => ({
    ...tier,
  }));
};

/**
 * Calculate motivational message based on current progress
 * @param {Object} tierInfo - Result from calculateUserTier
 * @returns {string} - Motivational message
 */
export const getProgressionMessage = (tierInfo) => {
  const { name, progressToNext, nextTier, stats } = tierInfo;

  // Elite user - celebrate
  if (tierInfo.isElite) {
    return `🌟 ${name} - Continue à maintenir ta domination sur le tapis!`;
  }

  // No next tier
  if (!nextTier) {
    return `Tu es ${name} - Un statut remarquable! 🏆`;
  }

  // Users with some progress
  if (progressToNext > 75) {
    return `${name} → Presque ${nextTier}! (${progressToNext}%)`;
  }

  if (progressToNext > 50) {
    return `${name} - Avance régulière vers ${nextTier} (${progressToNext}%)`;
  }

  if (progressToNext > 25) {
    return `${name} - Continue tes efforts! ${progressToNext}% vers ${nextTier}`;
  }

  // Fresh tier
  return `Tu viens d'atteindre ${name}! Vers ${nextTier}? 🚀`;
};

export default {
  calculateUserTier,
  getProgressionTiers,
  getProgressionMessage,
};
