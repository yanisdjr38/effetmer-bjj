import { useEffect, useState } from "react";

/**
 * useInstallPrompt - Manages PWA installation state
 * Handles beforeinstallprompt, appinstalled events, and local persistence
 */
export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const STORAGE_KEY = "pwa-install-dismissed-at";
  const STORAGE_INSTALL_KEY = "pwa-installed";
  const DISMISS_DAYS = 7;

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
      setIsInstalled(true);
      return;
    }

    // Check localStorage for previous installation
    if (localStorage.getItem(STORAGE_INSTALL_KEY)) {
      setIsInstalled(true);
      return;
    }

    // Check if recently dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const dismissedAt = new Date(dismissed);
      const now = new Date();
      const daysSinceDismiss = (now - dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < DISMISS_DAYS) {
        return;
      }
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log("✅ EFFETMER installed successfully");
      setDeferredPrompt(null);
      setCanInstall(false);
      setIsInstalled(true);
      setIsStandalone(true);
      localStorage.setItem(STORAGE_INSTALL_KEY, new Date().toISOString());
      localStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return false;

    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice();

      if (result.outcome === "accepted") {
        console.log("✅ User accepted install prompt");
        setDeferredPrompt(null);
        setCanInstall(false);
        return true;
      } else {
        console.log("❌ User dismissed install prompt");
        return false;
      }
    } catch (error) {
      console.error("Install prompt error:", error);
      return false;
    }
  };

  const handleDismiss = (snoozeFor7Days = true) => {
    if (snoozeFor7Days) {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    }
    setCanInstall(false);
  };

  const remindLater = () => {
    handleDismiss(true);
  };

  return {
    deferredPrompt,
    canInstall,
    isInstalled,
    isStandalone,
    handleInstall,
    handleDismiss,
    remindLater,
  };
};
