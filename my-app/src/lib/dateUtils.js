/**
 * dateUtils - Safe, unit-testable date and streak calculations
 * All functions normalize dates to midnight UTC for consistency
 */

/**
 * Normalize a date to midnight (00:00:00) for consistent date comparisons
 * @param {Date|string} date - Date object or ISO string
 * @returns {Date} - New Date at midnight UTC
 */
export const normalizeDateToMidnight = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

/**
 * Calculate the number of complete days between two dates (end - start)
 * Negative if start > end. Normalized to midnight.
 * @param {Date|string} endDate
 * @param {Date|string} startDate
 * @returns {number} - Days diff (integer)
 */
export const daysBetween = (endDate, startDate) => {
  const end = normalizeDateToMidnight(endDate);
  const start = normalizeDateToMidnight(startDate);
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
};

/**
 * Check if a session date falls on a specific calendar date
 * @param {Date|string} sessionDate
 * @param {Date|string} calendarDate
 * @returns {boolean}
 */
export const isSameDay = (sessionDate, calendarDate) => {
  const s = normalizeDateToMidnight(sessionDate);
  const c = normalizeDateToMidnight(calendarDate);
  return s.getTime() === c.getTime();
};

/**
 * Calculate training streak: consecutive days with at least one session
 * Counts from today backwards; streak breaks on any gap.
 * @param {Array} sessions - Array of {date, ...} objects (ISO strings)
 * @param {Date|string} asOf - Reference date (default: today)
 * @returns {number} - Streak length (0 if no sessions or gap)
 */
export const calculateStreak = (sessions, asOf = new Date()) => {
  if (!sessions || sessions.length === 0) return 0;

  // Sort sessions by date descending (most recent first)
  const sorted = [...sessions]
    .map((s) => ({ ...s, sessionDate: normalizeDateToMidnight(s.date) }))
    .sort((a, b) => b.sessionDate - a.sessionDate);

  const referenceDate = normalizeDateToMidnight(asOf);
  let streak = 0;

  // Iterate backwards from referenceDate
  for (let i = 0; i <= 365; i++) {
    const checkDate = new Date(referenceDate);
    checkDate.setDate(checkDate.getDate() - i);

    // Check if any session exists on checkDate
    const hasSession = sorted.some((s) => isSameDay(s.sessionDate, checkDate));

    if (hasSession) {
      streak++;
    } else if (i > 0) {
      // Gap found (but allow today to be a gap for counting from "yesterday")
      break;
    }
  }

  return streak;
};

/**
 * Get ISO date string (YYYY-MM-DD) for a date at midnight
 * @param {Date|string} date
 * @returns {string} - ISO date string (no time component)
 */
export const toISODateString = (date) => {
  return normalizeDateToMidnight(date).toISOString().split("T")[0];
};

/**
 * Get start of day (for filtering sessions within a day)
 * @param {Date|string} date
 * @returns {Date} - Start of day at midnight
 */
export const getStartOfDay = (date) => normalizeDateToMidnight(date);

/**
 * Get end of day (for filtering sessions within a day)
 * @param {Date|string} date
 * @returns {Date} - End of day (23:59:59.999)
 */
export const getEndOfDay = (date) => {
  const d = normalizeDateToMidnight(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};

/**
 * Get start of the current week (Sunday or Monday based on convention)
 * Uses Monday as start of week (ISO 8601)
 * @param {Date|string} date
 * @returns {Date}
 */
export const getStartOfWeek = (date) => {
  const d = normalizeDateToMidnight(date);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  d.setUTCDate(diff);
  return d;
};

/**
 * Get start of the current month
 * @param {Date|string} date
 * @returns {Date}
 */
export const getStartOfMonth = (date) => {
  const d = normalizeDateToMidnight(date);
  d.setUTCDate(1);
  return d;
};

/**
 * Filter sessions within a date range (inclusive)
 * @param {Array} sessions
 * @param {Date|string} fromDate
 * @param {Date|string} toDate
 * @returns {Array} - Filtered sessions
 */
export const filterSessionsByDateRange = (sessions, fromDate, toDate) => {
  const from = getStartOfDay(fromDate);
  const to = getEndOfDay(toDate);
  return sessions.filter((s) => {
    const sessionDate = new Date(s.date);
    return sessionDate >= from && sessionDate <= to;
  });
};
