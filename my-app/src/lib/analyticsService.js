/**
 * analyticsService - Pure functions for analytics calculations
 * Extracted from AppContext for reusability and testability
 * All functions are pure and depend only on data, not React state
 */

import {
  calculateStreak,
  filterSessionsByDateRange,
  getStartOfMonth,
  getStartOfWeek,
  normalizeDateToMidnight,
} from "./dateUtils";

/**
 * Calculate comprehensive stats from sessions and techniques
 * @param {Array} trainingSessions - Array of {date, duration, type, ...}
 * @param {Array} techniques - Array of technique objects
 * @returns {Object} - Stats object with all computed metrics
 */
export const computeStats = (trainingSessions = [], techniques = []) => {
  if (!Array.isArray(trainingSessions)) trainingSessions = [];
  if (!Array.isArray(techniques)) techniques = [];

  const now = new Date();

  // Weekly stats
  const weekStart = getStartOfWeek(now);
  const weekEnd = new Date(now);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
  const thisWeek = filterSessionsByDateRange(
    trainingSessions,
    weekStart,
    weekEnd,
  );

  // Monthly stats
  const monthStart = getStartOfMonth(now);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const thisMonth = filterSessionsByDateRange(
    trainingSessions,
    monthStart,
    monthEnd,
  );

  // Today's sessions
  const todaySessions = filterSessionsByDateRange(trainingSessions, now, now);

  // Duration calculations
  const totalDuration = trainingSessions.reduce(
    (sum, s) => sum + Number(s.duration || 0),
    0,
  );

  const weeklyDuration = thisWeek.reduce(
    (sum, s) => sum + Number(s.duration || 0),
    0,
  );

  const monthlyDuration = thisMonth.reduce(
    (sum, s) => sum + Number(s.duration || 0),
    0,
  );

  // Session type breakdown (all-time)
  const typeBreakdown = trainingSessions.reduce((acc, session) => {
    const type = session.type || "other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Last session (most recent)
  const lastSession =
    trainingSessions.length > 0
      ? trainingSessions.reduce((latest, session) =>
          new Date(session.date) > new Date(latest.date) ? session : latest,
        )
      : null;

  return {
    total: trainingSessions.length,
    thisWeek: thisWeek.length,
    thisMonth: thisMonth.length,
    today: todaySessions.length,
    totalDuration: Math.round(totalDuration),
    totalHours: Math.round(totalDuration / 60),
    weeklyHours: Math.round(weeklyDuration / 60),
    monthlyHours: Math.round(monthlyDuration / 60),
    techniqueCount: techniques.length,
    lastSession,
    typeBreakdown,
    avgSessionDuration:
      trainingSessions.length > 0
        ? Math.round(totalDuration / trainingSessions.length)
        : 0,
  };
};

/**
 * Calculate achievements (streak, longest streak)
 * @param {Array} trainingSessions
 * @returns {Object} - {streak, longestStreak, lastTrainingDate}
 */
export const computeAchievements = (trainingSessions = []) => {
  if (!Array.isArray(trainingSessions)) trainingSessions = [];

  const currentStreak = calculateStreak(trainingSessions);

  // Find most recent session for lastTrainingDate
  const lastSession =
    trainingSessions.length > 0
      ? trainingSessions.reduce((latest, session) =>
          new Date(session.date) > new Date(latest.date) ? session : latest,
        )
      : null;

  return {
    streak: currentStreak,
    lastTrainingDate: lastSession?.date || null,
  };
};

/**
 * Get distribution of sessions by type for a specific period
 * @param {Array} trainingSessions
 * @param {number} days - Look back N days (0 = all time)
 * @returns {Object} - Type counts
 */
export const getTypeDistribution = (trainingSessions = [], days = 30) => {
  if (!Array.isArray(trainingSessions)) trainingSessions = [];

  let filtered = trainingSessions;

  if (days > 0) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    filtered = filterSessionsByDateRange(
      trainingSessions,
      startDate,
      new Date(),
    );
  }

  const dist = {};
  filtered.forEach((session) => {
    const type = session.type || "other";
    dist[type] = (dist[type] || 0) + 1;
  });

  return dist;
};

/**
 * Get daily volumes for a specific period
 * @param {Array} trainingSessions
 * @param {number} days - Number of days to return (default 30)
 * @returns {Array} - Array of durations, one per day
 */
export const getDailyVolumes = (trainingSessions = [], days = 30) => {
  if (!Array.isArray(trainingSessions)) trainingSessions = [];

  const daily = {};
  const today = normalizeDateToMidnight(new Date());

  // Initialize each day with 0
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    daily[dateStr] = 0;
  }

  // Accumulate durations
  trainingSessions.forEach((session) => {
    const dateStr = session.date.split("T")[0];
    if (dateStr in daily) {
      daily[dateStr] += Number(session.duration || 0);
    }
  });

  return Object.values(daily);
};

/**
 * Get heatmap data (session counts by date)
 * @param {Array} trainingSessions
 * @returns {Object} - Map of date string to session count
 */
export const getHeatmapData = (trainingSessions = []) => {
  if (!Array.isArray(trainingSessions)) trainingSessions = [];

  const sessionsByDate = {};
  trainingSessions.forEach((session) => {
    const dateStr = session.date.split("T")[0];
    sessionsByDate[dateStr] = (sessionsByDate[dateStr] || 0) + 1;
  });

  return sessionsByDate;
};
