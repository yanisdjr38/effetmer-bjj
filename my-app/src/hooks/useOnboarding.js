/**
 * useOnboarding - Hook for onboarding flow state
 */
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useOnboarding = () => {
  const [onboarding, setOnboarding] = useLocalStorage("onboarding", {
    isComplete: false,
    startedAt: null,
    completedAt: null,
  });

  const completeOnboarding = useCallback(
    (profileData) => {
      setOnboarding((prev) => ({
        ...prev,
        isComplete: true,
        completedAt: new Date().toISOString(),
        startedAt: prev.startedAt || new Date().toISOString(),
      }));
    },
    [setOnboarding],
  );

  return {
    onboarding,
    completeOnboarding,
  };
};
