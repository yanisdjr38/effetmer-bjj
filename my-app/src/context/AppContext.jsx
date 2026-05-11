import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

/**
 * AppContext - Centralized state management for the BJJ tracking app
 * Handles user profile, achievements, streaks, settings, and global app state
 */
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // ============================================================================
  // ONBOARDING STATE
  // ============================================================================
  const [onboarding, setOnboarding] = useLocalStorage("onboarding", {
    isComplete: false,
    startedAt: null,
    completedAt: null,
  });

  // ============================================================================
  // USER PROFILE & STATS
  // ============================================================================
  const [userProfile, setUserProfile] = useLocalStorage("userProfile", {
    firstName: "",
    lastName: "",
    belt: "white", // white, blue, purple, brown, black
    academy: "",
    weight: 0,
    yearsOfPractice: 0,
    weeklyGoal: 4, // target sessions per week
    joinDate: new Date().toISOString(),
  });

  // ============================================================================
  // TRAINING SCHEDULE (Recurring weekly sessions)
  // ============================================================================
  const [trainingSchedule, setTrainingSchedule] = useLocalStorage(
    "trainingSchedule",
    {
      sessions: [], // Array of recurring weekly training slots
      preferences: {
        preferredTrainingDays: [], // e.g., ["Monday", "Wednesday", "Friday", "Saturday"]
      },
    },
  );

  // ============================================================================
  // TRAINING SESSIONS
  // ============================================================================
  const [trainingSessions, setTrainingSessions] = useLocalStorage(
    "trainingSessions",
    [],
  );

  // ============================================================================
  // TECHNIQUES
  // ============================================================================
  const [techniques, setTechniques] = useLocalStorage("techniquesList", []);

  // ============================================================================
  // ACHIEVEMENTS & GAMIFICATION
  // ============================================================================
  const [achievements, setAchievements] = useLocalStorage("achievements", {
    badges: [], // Array of earned badge IDs
    streak: 0, // Current training streak
    longestStreak: 0,
    totalXp: 0,
    level: 1,
    lastTrainingDate: null,
  });

  // ============================================================================
  // PERSONAL GOALS
  // ============================================================================
  const [goals, setGoals] = useLocalStorage("goals", {
    current: [], // Active personal goals
    completed: [], // Completed goals with timestamps
  });

  // ============================================================================
  // SETTINGS & PREFERENCES
  // ============================================================================
  const [settings, setSettings] = useLocalStorage("appSettings", {
    theme: "dark",
    notifications: true,
    language: "fr",
    autoSync: true,
    syncedAt: null,
  });

  // ============================================================================
  // COMPUTED VALUES & STREAKS
  // ============================================================================

  // Calculate current streak
  const computeStreak = useCallback(() => {
    if (trainingSessions.length === 0) return 0;

    const sorted = [...trainingSessions].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sorted) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      // Check if session is today or yesterday relative to current check
      const daysDiff = (currentDate - sessionDate) / (1000 * 60 * 60 * 24);

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [trainingSessions]);

  // Update streak when sessions change
  React.useEffect(() => {
    const newStreak = computeStreak();
    setAchievements((prev) => ({
      ...prev,
      streak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastTrainingDate:
        trainingSessions.length > 0
          ? trainingSessions[trainingSessions.length - 1].date
          : null,
    }));
  }, [trainingSessions, computeStreak, setAchievements]);

  // ============================================================================
  // STATISTICS CALCULATIONS
  // ============================================================================

  const stats = useMemo(() => {
    const now = new Date();

    // Weekly stats
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeek = trainingSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek;
    });

    // Monthly stats
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonth = trainingSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfMonth;
    });

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

    // Session type breakdown
    const typeBreakdown = trainingSessions.reduce((acc, session) => {
      const type = session.type || "other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Last session
    const lastSession =
      trainingSessions.length > 0
        ? trainingSessions[trainingSessions.length - 1]
        : null;

    // Today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = trainingSessions.filter((s) => {
      const date = new Date(s.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });

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
  }, [trainingSessions, techniques]);

  // ============================================================================
  // UPDATE FUNCTIONS
  // ============================================================================

  const updateUserProfile = useCallback(
    (updates) => {
      setUserProfile((prev) => ({ ...prev, ...updates }));
    },
    [setUserProfile],
  );

  const addTrainingSession = useCallback(
    (session) => {
      setTrainingSessions((prev) => [
        ...prev,
        {
          ...session,
          id: Date.now(),
        },
      ]);
    },
    [setTrainingSessions],
  );

  const updateTrainingSession = useCallback(
    (id, updates) => {
      setTrainingSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      );
    },
    [setTrainingSessions],
  );

  const deleteTrainingSession = useCallback(
    (id) => {
      setTrainingSessions((prev) => prev.filter((s) => s.id !== id));
    },
    [setTrainingSessions],
  );

  const unlockBadge = useCallback(
    (badgeId) => {
      setAchievements((prev) => {
        if (!prev.badges.includes(badgeId)) {
          return {
            ...prev,
            badges: [...prev.badges, badgeId],
            totalXp: prev.totalXp + 100,
          };
        }
        return prev;
      });
    },
    [setAchievements],
  );

  const updateSettings = useCallback(
    (updates) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    [setSettings],
  );

  // ============================================================================
  // ONBOARDING FUNCTIONS
  // ============================================================================

  const completeOnboarding = useCallback(
    (profileData) => {
      setUserProfile((prev) => ({
        ...prev,
        ...profileData,
        joinDate: new Date().toISOString(),
      }));
      setOnboarding((prev) => ({
        ...prev,
        isComplete: true,
        completedAt: new Date().toISOString(),
        startedAt: prev.startedAt || new Date().toISOString(),
      }));
    },
    [setUserProfile, setOnboarding],
  );

  // ============================================================================
  // TRAINING SCHEDULE FUNCTIONS
  // ============================================================================

  const addScheduleSession = useCallback(
    (session) => {
      setTrainingSchedule((prev) => ({
        ...prev,
        sessions: [
          ...prev.sessions,
          {
            ...session,
            id: Date.now(),
          },
        ],
      }));
    },
    [setTrainingSchedule],
  );

  const updateScheduleSession = useCallback(
    (id, updates) => {
      setTrainingSchedule((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === id ? { ...s, ...updates } : s,
        ),
      }));
    },
    [setTrainingSchedule],
  );

  const deleteScheduleSession = useCallback(
    (id) => {
      setTrainingSchedule((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((s) => s.id !== id),
      }));
    },
    [setTrainingSchedule],
  );

  const updatePreferredTrainingDays = useCallback(
    (days) => {
      setTrainingSchedule((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          preferredTrainingDays: days,
        },
      }));
    },
    [setTrainingSchedule],
  );

  // ============================================================================
  // PERSONAL GOALS FUNCTIONS
  // ============================================================================

  const addGoal = useCallback(
    (goal) => {
      setGoals((prev) => ({
        ...prev,
        current: [
          ...prev.current,
          {
            ...goal,
            id: Date.now(),
            createdAt: new Date().toISOString(),
          },
        ],
      }));
    },
    [setGoals],
  );

  const completeGoal = useCallback(
    (goalId) => {
      setGoals((prev) => {
        const goal = prev.current.find((g) => g.id === goalId);
        if (!goal) return prev;

        return {
          current: prev.current.filter((g) => g.id !== goalId),
          completed: [
            ...prev.completed,
            {
              ...goal,
              completedAt: new Date().toISOString(),
            },
          ],
        };
      });
    },
    [setGoals],
  );

  const deleteGoal = useCallback(
    (goalId) => {
      setGoals((prev) => ({
        ...prev,
        current: prev.current.filter((g) => g.id !== goalId),
      }));
    },
    [setGoals],
  );

  // ============================================================================
  // BADGE DEFINITIONS (Personal Milestones)
  // ============================================================================

  const BADGE_DEFINITIONS = {
    first_session: {
      id: "first_session",
      name: "First Step",
      description: "Complete your first training session",
      icon: "🥋",
      earned: achievements.badges.includes("first_session"),
    },
    week_warrior: {
      id: "week_warrior",
      name: "Week Warrior",
      description: "Train 5 times in a week",
      icon: "⚡",
      earned: achievements.badges.includes("week_warrior"),
    },
    consistency_7: {
      id: "consistency_7",
      name: "Consistency Champion",
      description: "Maintain a 7-day training streak",
      icon: "🔥",
      earned: achievements.badges.includes("consistency_7"),
    },
    consistency_30: {
      id: "consistency_30",
      name: "Month Mastery",
      description: "Maintain a 30-day training streak",
      icon: "👑",
      earned: achievements.badges.includes("consistency_30"),
    },
    technique_collector: {
      id: "technique_collector",
      name: "Technique Collector",
      description: "Learn 50 techniques",
      icon: "📚",
      earned: achievements.badges.includes("technique_collector"),
    },
    progression_milestone: {
      id: "progression_milestone",
      name: "Progressive Athlete",
      description: "Advance your belt rank",
      icon: "🎖️",
      earned: achievements.badges.includes("progression_milestone"),
    },
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = {
    // Onboarding
    onboarding,
    completeOnboarding,

    // Profile
    userProfile,
    updateUserProfile,

    // Training
    trainingSessions,
    addTrainingSession,
    updateTrainingSession,
    deleteTrainingSession,
    stats,

    // Training Schedule
    trainingSchedule,
    addScheduleSession,
    updateScheduleSession,
    deleteScheduleSession,
    updatePreferredTrainingDays,

    // Techniques
    techniques,
    setTechniques,

    // Achievements
    achievements,
    unlockBadge,
    BADGE_DEFINITIONS,

    // Personal Goals
    goals,
    addGoal,
    completeGoal,
    deleteGoal,

    // Settings
    settings,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook to use AppContext
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export default AppContext;
