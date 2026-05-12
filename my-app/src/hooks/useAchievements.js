/**
 * useAchievements - Hook for badges, streaks, XP and gamification
 */
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useAchievements = () => {
  const [achievements, setAchievements] = useLocalStorage("achievements", {
    badges: [],
    streak: 0,
    longestStreak: 0,
    totalXp: 0,
    level: 1,
    lastTrainingDate: null,
  });

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

  return {
    achievements,
    setAchievements,
    unlockBadge,
  };
};
