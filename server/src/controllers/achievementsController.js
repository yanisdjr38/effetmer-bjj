import Achievement from "../models/Achievement.js";

/**
 * Get achievements for current user
 */
export const getAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let achievement = await Achievement.findOne({ userId });

    if (!achievement) {
      achievement = new Achievement({ userId });
      await achievement.save();
    }

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update achievements
 */
export const updateAchievements = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      badge,
      streak,
      longestStreak,
      totalSessions,
      totalMinutes,
      lastTrainingDate,
      completedGoals,
    } = req.body;

    let achievement = await Achievement.findOne({ userId });

    if (!achievement) {
      achievement = new Achievement({ userId });
    }

    achievement.badge = badge || achievement.badge;
    achievement.streak = streak !== undefined ? streak : achievement.streak;
    achievement.longestStreak =
      longestStreak !== undefined ? longestStreak : achievement.longestStreak;
    achievement.totalSessions =
      totalSessions !== undefined ? totalSessions : achievement.totalSessions;
    achievement.totalMinutes =
      totalMinutes !== undefined ? totalMinutes : achievement.totalMinutes;
    achievement.lastTrainingDate =
      lastTrainingDate || achievement.lastTrainingDate;
    achievement.completedGoals =
      completedGoals !== undefined
        ? completedGoals
        : achievement.completedGoals;
    achievement.updatedAt = new Date();

    await achievement.save();

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Unlock badge
 */
export const unlockBadge = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { badge } = req.body;

    let achievement = await Achievement.findOne({ userId });

    if (!achievement) {
      achievement = new Achievement({ userId, badge });
    } else {
      achievement.badge = badge;
    }

    achievement.updatedAt = new Date();
    await achievement.save();

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};
