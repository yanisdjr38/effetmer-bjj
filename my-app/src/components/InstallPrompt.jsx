import { faDownload, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./install-prompt.scss";

/**
 * InstallPrompt - PWA installation banner
 * Appears when app can be installed as PWA
 */
const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent browser install prompt
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true); // Show custom UI
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice();
      if (result.outcome === "accepted") {
        setDeferredPrompt(null);
        setShow(false);
      }
    } catch (error) {
      console.warn("Installation prompt error:", error);
    }
  };

  const handleDismiss = () => {
    setShow(false);
  };

  if (!show || !deferredPrompt) return null;

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
          onClick={handleDismiss}
          className="install-banner__btn install-banner__btn--dismiss"
          aria-label="Fermer"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
