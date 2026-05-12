import { faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useState } from "react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useIOSDetection } from "../hooks/useIOSDetection";
import "./install-prompt.scss";
import IOSInstallGuide from "./IOSInstallGuide";

/**
 * InstallPrompt - Multi-platform PWA installation prompt
 * - Shows native browser install dialog on Android (via beforeinstallprompt)
 * - Shows iOS manual install guide for Safari on iOS
 * - Respects user dismissal for 7 days
 * - Memoized for performance
 */
const InstallPrompt = memo(() => {
  const { deferredPrompt, canInstall, handleInstall, handleDismiss } =
    useInstallPrompt();
  const { isIOSSafari, needsIOSGuide } = useIOSDetection();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Show iOS guide for Safari on iOS
  if (needsIOSGuide && showIOSGuide) {
    return (
      <IOSInstallGuide
        onDismiss={() => {
          setShowIOSGuide(false);
          handleDismiss(true); // 7-day snooze
        }}
      />
    );
  }

  // For iOS Safari, show banner that opens guide
  if (isIOSSafari) {
    if (showIOSGuide) return null;

    return (
      <div className="install-banner" role="alert" aria-live="polite">
        <div className="install-banner__content">
          <FontAwesomeIcon icon={faDownload} className="install-banner__icon" />
          <div className="install-banner__text">
            <p className="install-banner__title">Installer l'app</p>
            <p className="install-banner__subtitle">
              Ajoute EFFETMER à ton écran d'accueil
            </p>
          </div>
        </div>

        <div className="install-banner__actions">
          <button
            onClick={() => setShowIOSGuide(true)}
            className="install-banner__btn install-banner__btn--install"
            aria-label="Comment installer l'application"
          >
            Guide
          </button>
          <button
            onClick={() => handleDismiss(true)}
            className="install-banner__btn install-banner__btn--dismiss"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    );
  }

  // For Android or other browsers with beforeinstallprompt
  if (!canInstall || !deferredPrompt) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice();
      if (result.outcome === "accepted") {
        console.log("PWA installation accepted");
        handleInstall();
      }
    } catch (error) {
      console.warn("Installation prompt error:", error);
    }
  };

  return (
    <div className="install-banner" role="alert" aria-live="polite">
      <div className="install-banner__content">
        <FontAwesomeIcon icon={faDownload} className="install-banner__icon" />
        <div className="install-banner__text">
          <p className="install-banner__title">Installer l'app</p>
          <p className="install-banner__subtitle">
            Télécharge EffetMer BJJ pour un accès hors ligne
          </p>
        </div>
      </div>

      <div className="install-banner__actions">
        <button
          onClick={handleInstallClick}
          className="install-banner__btn install-banner__btn--install"
          aria-label="Installer l'application"
        >
          Ajouter
        </button>
        <button
          onClick={() => handleDismiss(true)}
          className="install-banner__btn install-banner__btn--dismiss"
          aria-label="Fermer"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
});

InstallPrompt.displayName = "InstallPrompt";

export default InstallPrompt;
