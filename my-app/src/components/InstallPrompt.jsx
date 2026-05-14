import { memo, useState } from "react";
import {
  FaDownload,
  FaMobile,
  FaRocket,
  FaTimes,
  FaWifi,
} from "react-icons/fa";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { useIOSDetection } from "../hooks/useIOSDetection";
import styles from "./install-prompt.module.scss";
import IOSInstallGuide from "./IOSInstallGuide";

/**
 * InstallPrompt - Premium PWA installation modal experience
 *
 * Features:
 * - Modern premium modal (not banner)
 * - Android support via beforeinstallprompt
 * - iOS Safari manual install guide
 * - Smart dismissal with 7-day cooldown
 * - Smooth animations
 * - Dark mode integrated
 */
const InstallPrompt = memo(() => {
  const { deferredPrompt, canInstall, handleInstall, handleDismiss } =
    useInstallPrompt();
  const { isIOSSafari, needsIOSGuide } = useIOSDetection();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // Show iOS guide modal
  if (needsIOSGuide && showIOSGuide) {
    return (
      <IOSInstallGuide
        onDismiss={() => {
          setShowIOSGuide(false);
          handleDismiss(true);
        }}
      />
    );
  }

  // iOS Safari - show install prompt
  if (isIOSSafari && canInstall && !showIOSGuide) {
    return (
      <>
        <div className={styles.overlay} onClick={() => handleDismiss(true)} />
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-title"
        >
          {/* Header */}
          <div className={styles.modal__header}>
            <button
              className={styles.modal__close}
              onClick={() => handleDismiss(false)}
              aria-label="Fermer"
              title="Fermer"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className={styles.modal__content}>
            <div className={styles.icon_badge}>
              <FaMobile className={styles.icon_large} />
            </div>

            <h2 id="install-title" className={styles.modal__title}>
              Installer EFFETMER
            </h2>

            <p className={styles.modal__subtitle}>
              Accédez à votre suivi BJJ directement depuis votre écran d'accueil
            </p>

            {/* Benefits */}
            <div className={styles.benefits}>
              <div className={styles.benefit_item}>
                <FaRocket className={styles.benefit_icon} />
                <span>Accès ultra-rapide</span>
              </div>
              <div className={styles.benefit_item}>
                <FaWifi className={styles.benefit_icon} />
                <span>Fonctionne hors ligne</span>
              </div>
              <div className={styles.benefit_item}>
                <FaMobile className={styles.benefit_icon} />
                <span>Expérience native</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.modal__actions}>
            <button
              className={`${styles.btn} ${styles.btn__primary}`}
              onClick={() => setShowIOSGuide(true)}
            >
              Comment installer
            </button>
            <button
              className={`${styles.btn} ${styles.btn__secondary}`}
              onClick={() => handleDismiss(true)}
            >
              Plus tard
            </button>
          </div>
        </div>
      </>
    );
  }

  // Android / Browser - show install modal with beforeinstallprompt
  if (!canInstall || !deferredPrompt) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);

    try {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice();

      if (result.outcome === "accepted") {
        console.log("✅ PWA installation accepted");
        handleInstall();
      } else {
        console.log("❌ Installation dismissed");
        handleDismiss(false);
      }
    } catch (error) {
      console.error("Installation prompt error:", error);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={() => handleDismiss(true)} />
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
      >
        {/* Header */}
        <div className={styles.modal__header}>
          <button
            className={styles.modal__close}
            onClick={() => handleDismiss(false)}
            aria-label="Fermer"
            title="Fermer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modal__content}>
          <div className={styles.icon_badge}>
            <FaDownload className={styles.icon_large} />
          </div>

          <h2 id="install-title" className={styles.modal__title}>
            Installer EFFETMER
          </h2>

          <p className={styles.modal__subtitle}>
            Accédez rapidement à votre suivi BJJ depuis votre écran d'accueil
          </p>

          {/* Features Grid */}
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.feature__icon}>
                <FaMobile />
              </div>
              <h3 className={styles.feature__title}>Accès instant</h3>
              <p className={styles.feature__desc}>
                Lancez EFFETMER en un seul tap
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.feature__icon}>
                <FaWifi />
              </div>
              <h3 className={styles.feature__title}>Hors ligne</h3>
              <p className={styles.feature__desc}>
                Utilisez l'app même sans connexion
              </p>
            </div>

            <div className={styles.feature}>
              <div className={styles.feature__icon}>
                <FaRocket />
              </div>
              <h3 className={styles.feature__title}>Performance</h3>
              <p className={styles.feature__desc}>Chargement ultra-rapide</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.modal__actions}>
          <button
            className={`${styles.btn} ${styles.btn__primary}`}
            onClick={handleInstallClick}
            disabled={installing}
            aria-busy={installing}
          >
            <FaDownload style={{ marginRight: "0.5rem" }} />
            {installing ? "Installation..." : "Installer"}
          </button>
          <button
            className={`${styles.btn} ${styles.btn__secondary}`}
            onClick={() => handleDismiss(true)}
            disabled={installing}
          >
            Plus tard
          </button>
        </div>
      </div>
    </>
  );
});

InstallPrompt.displayName = "InstallPrompt";

export default InstallPrompt;
