/**
 * useTrainingSchedule - Hook for recurring weekly training sessions
 */
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useTrainingSchedule = () => {
  const [trainingSchedule, setTrainingSchedule] = useLocalStorage(
    "trainingSchedule",
    {
      sessions: [],
      preferences: {
        preferredTrainingDays: [],
      },
    },
  );

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

  return {
    trainingSchedule,
    addScheduleSession,
    updateScheduleSession,
    deleteScheduleSession,
    updatePreferredTrainingDays,
  };
};
