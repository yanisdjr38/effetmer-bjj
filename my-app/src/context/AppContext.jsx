import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useAchievements } from "../hooks/useAchievements";
import { useGoals } from "../hooks/useGoals";
import { useOnboarding } from "../hooks/useOnboarding";
import { useProfile } from "../hooks/useProfile";
import { useSessions } from "../hooks/useSessions";
import { useSettings } from "../hooks/useSettings";
import { useTechniques } from "../hooks/useTechniques";
import { useTrainingSchedule } from "../hooks/useTrainingSchedule";
import { computeStats } from "../lib/analyticsService";
import { calculateStreak } from "../lib/dateUtils";

/**
 * AppContext - Centralized access point for all app state
 * Delegates to specialized hooks and services for concerns
 * Maintains backward compatibility with existing code
 */
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // ============================================================================
  // DELEGATE STATE TO SPECIALIZED HOOKS
  // ============================================================================

  const { onboarding, completeOnboarding } = useOnboarding();
  const { userProfile, updateUserProfile } = useProfile();
  const {
    trainingSessions,
    addTrainingSession,
    updateTrainingSession,
    deleteTrainingSession,
  } = useSessions();
  const { settings, updateSettings } = useSettings();
  const { achievements, setAchievements, unlockBadge } = useAchievements();
  const { goals, addGoal, completeGoal, deleteGoal } = useGoals();
  const {
    trainingSchedule,
    addScheduleSession,
    updateScheduleSession,
    deleteScheduleSession,
    updatePreferredTrainingDays,
  } = useTrainingSchedule();
  const { techniques, setTechniques } = useTechniques();

  // ============================================================================
  // COMPUTED VALUES & STREAKS using pure service functions
  // ============================================================================

  // Update streak and achievements when sessions change
  useEffect(() => {
    const newStreak = calculateStreak(trainingSessions);
    const lastTrainingDate =
      trainingSessions.length > 0
        ? trainingSessions.reduce((latest, session) =>
            new Date(session.date) > new Date(latest.date) ? session : latest,
          ).date
        : null;

    const nextAchievements = {
      streak: newStreak,
      longestStreak: Math.max(achievements.longestStreak || 0, newStreak),
      lastTrainingDate,
    };

    const alreadySynced =
      achievements.streak === nextAchievements.streak &&
      achievements.longestStreak === nextAchievements.longestStreak &&
      achievements.lastTrainingDate === nextAchievements.lastTrainingDate;

    if (alreadySynced) {
      return;
    }

    setAchievements((prev) => ({
      ...prev,
      ...nextAchievements,
    }));
  }, [
    trainingSessions,
    setAchievements,
    achievements.longestStreak,
    achievements.streak,
    achievements.lastTrainingDate,
  ]);

  // Compute stats using pure service function
  const stats = useMemo(() => {
    return computeStats(trainingSessions, techniques);
  }, [trainingSessions, techniques]);

  // ============================================================================
  // CALLBACK WRAPPERS (for backward compatibility)
  // ============================================================================

  const handleCompleteOnboarding = useCallback(
    (data) => {
      completeOnboarding(data);
    },
    [completeOnboarding],
  );

  const handleUpdateUserProfile = useCallback(
    (updates) => {
      updateUserProfile(updates);
    },
    [updateUserProfile],
  );

  const handleAddTrainingSession = useCallback(
    (session) => {
      addTrainingSession(session);
    },
    [addTrainingSession],
  );

  const handleUpdateTrainingSession = useCallback(
    (sessionId, updates) => {
      updateTrainingSession(sessionId, updates);
    },
    [updateTrainingSession],
  );

  const handleDeleteTrainingSession = useCallback(
    (sessionId) => {
      deleteTrainingSession(sessionId);
    },
    [deleteTrainingSession],
  );

  const handleUpdateSettings = useCallback(
    (updates) => {
      updateSettings(updates);
    },
    [updateSettings],
  );

  const handleUnlockBadge = useCallback(
    (badgeId) => {
      unlockBadge(badgeId);
    },
    [unlockBadge],
  );

  const handleAddGoal = useCallback(
    (goal) => {
      addGoal(goal);
    },
    [addGoal],
  );

  const handleCompleteGoal = useCallback(
    (goalId) => {
      completeGoal(goalId);
    },
    [completeGoal],
  );

  const handleDeleteGoal = useCallback(
    (goalId) => {
      deleteGoal(goalId);
    },
    [deleteGoal],
  );

  const handleAddScheduleSession = useCallback(
    (session) => {
      addScheduleSession(session);
    },
    [addScheduleSession],
  );

  const handleUpdateScheduleSession = useCallback(
    (sessionId, updates) => {
      updateScheduleSession(sessionId, updates);
    },
    [updateScheduleSession],
  );

  const handleDeleteScheduleSession = useCallback(
    (sessionId) => {
      deleteScheduleSession(sessionId);
    },
    [deleteScheduleSession],
  );

  const handleUpdatePreferredTrainingDays = useCallback(
    (days) => {
      updatePreferredTrainingDays(days);
    },
    [updatePreferredTrainingDays],
  );

  const handleSetTechniques = useCallback(
    (newTechniques) => {
      setTechniques(newTechniques);
    },
    [setTechniques],
  );

  // ============================================================================
  // BADGE DEFINITIONS (Personal Milestones)
  // ============================================================================

  const BADGE_DEFINITIONS = {
    first_session: {
      id: "first_session",
      name: "Premier Pas",
      description: "Complète ta première séance d'entraînement",
      icon: "🥋",
      earned: achievements.badges?.includes("first_session"),
    },
    week_warrior: {
      id: "week_warrior",
      name: "Guerrier de la Semaine",
      description: "Entraîne-toi 5 fois en une semaine",
      icon: "⚡",
      earned: achievements.badges?.includes("week_warrior"),
    },
    consistency_7: {
      id: "consistency_7",
      name: "Champion de la Constance",
      description: "Maintiens une série de 7 jours d'entraînement",
      icon: "🔥",
      earned: achievements.badges?.includes("consistency_7"),
    },
    consistency_30: {
      id: "consistency_30",
      name: "Maîtrise du Mois",
      description: "Maintiens une série de 30 jours d'entraînement",
      icon: "👑",
      earned: achievements.badges?.includes("consistency_30"),
    },
    technique_collector: {
      id: "technique_collector",
      name: "Collecteur de Techniques",
      description: "Apprends 50 techniques",
      icon: "📚",
      earned: achievements.badges?.includes("technique_collector"),
    },
    progression_milestone: {
      id: "progression_milestone",
      name: "Athlète Progressif",
      description: "Progresse dans ton classement de ceinture",
      icon: "🎖️",
      earned: achievements.badges?.includes("progression_milestone"),
    },
  };

  // ============================================================================
  // CONTEXT VALUE - Maintain public API for backward compatibility
  // ============================================================================

  const value = {
    // Onboarding
    onboarding,
    completeOnboarding: handleCompleteOnboarding,

    // Profile
    userProfile,
    updateUserProfile: handleUpdateUserProfile,

    // Training Sessions
    trainingSessions,
    addTrainingSession: handleAddTrainingSession,
    updateTrainingSession: handleUpdateTrainingSession,
    deleteTrainingSession: handleDeleteTrainingSession,
    stats,

    // Training Schedule
    trainingSchedule,
    addScheduleSession: handleAddScheduleSession,
    updateScheduleSession: handleUpdateScheduleSession,
    deleteScheduleSession: handleDeleteScheduleSession,
    updatePreferredTrainingDays: handleUpdatePreferredTrainingDays,

    // Techniques
    techniques,
    setTechniques: handleSetTechniques,

    // Achievements
    achievements,
    unlockBadge: handleUnlockBadge,
    BADGE_DEFINITIONS,

    // Personal Goals
    goals,
    addGoal: handleAddGoal,
    completeGoal: handleCompleteGoal,
    deleteGoal: handleDeleteGoal,

    // Settings
    settings,
    updateSettings: handleUpdateSettings,
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
