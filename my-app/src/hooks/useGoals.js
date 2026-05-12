/**
 * useGoals - Hook for personal goals management
 */
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useGoals = () => {
  const [goals, setGoals] = useLocalStorage("goals", {
    current: [],
    completed: [],
  });

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

  return {
    goals,
    addGoal,
    completeGoal,
    deleteGoal,
  };
};
