/**
 * useSettings - Hook for app settings and preferences
 */
import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useSettings = () => {
  const [settings, setSettings] = useLocalStorage("appSettings", {
    theme: "dark",
    notifications: true,
    language: "fr",
    autoSync: true,
    syncedAt: null,
  });

  const updateSettings = useCallback(
    (updates) => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    [setSettings],
  );

  return {
    settings,
    updateSettings,
  };
};
