/**
 * useProfile - Hook for user profile state and operations
 */
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useProfile = () => {
  const [userProfile, setUserProfile] = useLocalStorage("userProfile", {
    firstName: "",
    lastName: "",
    belt: "white",
    academy: "",
    weight: 0,
    yearsOfPractice: 0,
    weeklyGoal: 4,
    joinDate: new Date().toISOString(),
  });

  const updateUserProfile = useCallback(
    (updates) => {
      setUserProfile((prev) => ({ ...prev, ...updates }));
    },
    [setUserProfile],
  );

  return {
    userProfile,
    updateUserProfile,
  };
};
