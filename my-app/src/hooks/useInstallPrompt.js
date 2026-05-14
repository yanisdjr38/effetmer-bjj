import { useEffect, useState } from "react";

/**
 * useInstallPrompt - Manages PWA installation state and logic
 *
 * Features:
 * - Detects beforeinstallprompt availability (Android)
 * - Tracks installation state and dismissals
 * - Manages 7-day dismissal cooldown
 * - Detects standalone mode (already installed)
 * - Session-aware display logic
 * - Custom PWA events
 */
export const useInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);

  // Storage keys
  const STORAGE_DISMISSAL_KEY = "pwa_install_dismissed_at";
  const STORAGE_INSTALLED_KEY = "pwa_installed_at";
  const DISMISSAL_COOLDOWN_DAYS = 7;

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandaloneMode = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;
    if (isStandaloneMode) {
      setIsStandalone(true);
      setIsInstalled(true);
      console.log("✅ Running in standalone PWA mode");
      return;
    }

    // Check localStorage for previous installation
    if (localStorage.getItem(STORAGE_INSTALLED_KEY)) {
      setIsInstalled(true);
      console.log("✅ App was previously installed");
      return;
    }

    // Check if user dismissed in this session
    if (sessionDismissed) {
      console.log("ℹ️ User dismissed install prompt this session");
      return;
    }

    // Check if recently dismissed (7-day cooldown)
    const dismissedAt = localStorage.getItem(STORAGE_DISMISSAL_KEY);
    if (dismissedAt) {
      const dismissedDate = new Date(dismissedAt);
      const now = new Date();
      const daysSinceDismissal = (now - dismissedDate) / (1000 * 60 * 60 * 24);

      if (daysSinceDismissal < DISMISSAL_COOLDOWN_DAYS) {
        console.log(
          `ℹ️ Install prompt dismissed ${Math.floor(daysSinceDismissal)} days ago, cooldown active`,
        );
        return;
      } else {
        // Cooldown expired, remove dismissal marker
        localStorage.removeItem(STORAGE_DISMISSAL_KEY);
      }
    }

    // Setup beforeinstallprompt listener (Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log("🎯 beforeinstallprompt event fired - app can be installed");
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    // Setup appinstalled listener
    const handleAppInstalled = () => {
      console.log("✅ App successfully installed");
      setDeferredPrompt(null);
      setCanInstall(false);
      setIsInstalled(true);
      setIsStandalone(true);

      // Mark installation in storage
      localStorage.setItem(STORAGE_INSTALLED_KEY, new Date().toISOString());
      localStorage.removeItem(STORAGE_DISMISSAL_KEY);

      // Trigger custom event
      window.dispatchEvent(new CustomEvent("pwa:installed"));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [sessionDismissed]);

  /**
   * Trigger native install prompt (Android/Chrome)
   */
  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.warn("Install prompt not available");
      return false;
    }

    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice();

      if (result.outcome === "accepted") {
        console.log("✅ User accepted install prompt");
        return true;
      } else {
        console.log("❌ User dismissed install prompt");
        handleDismiss(true); // Start 7-day cooldown
        return false;
      }
    } catch (error) {
      console.error("❌ Install prompt error:", error);
      return false;
    }
  };

  /**
   * Handle user dismissal of install prompt
   * @param {boolean} cooldown - If true, set 7-day dismissal cooldown
   */
  const handleDismiss = (cooldown = true) => {
    setCanInstall(false);
    setSessionDismissed(true);

    if (cooldown) {
      localStorage.setItem(STORAGE_DISMISSAL_KEY, new Date().toISOString());
      console.log("ℹ️ Install prompt dismissed, 7-day cooldown started");
    } else {
      console.log("ℹ️ Install prompt dismissed this session only");
    }
  };

  /**
   * Check if app is installable and should show prompt
   */
  const shouldShowPrompt = () => {
    return canInstall && !isInstalled && !sessionDismissed && deferredPrompt;
  };

  return {
    deferredPrompt,
    canInstall,
    isInstalled,
    isStandalone,
    shouldShowPrompt,
    handleInstall,
    handleDismiss,
  };
};
