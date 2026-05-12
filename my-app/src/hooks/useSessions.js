/**
 * useSessions - Hook for training sessions state and operations
 * Focused on session CRUD and related logic
 */
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useSessions = () => {
  const [trainingSessions, setTrainingSessions] = useLocalStorage(
    "trainingSessions",
    [],
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

  return {
    trainingSessions,
    addTrainingSession,
    updateTrainingSession,
    deleteTrainingSession,
  };
};
