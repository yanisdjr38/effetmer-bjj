import { memo } from "react";
import "./ios-install-guide.scss";

/**
 * IOSInstallGuide - Custom install instructions for iOS Safari users
 * Since iOS doesn't support beforeinstallprompt, guide users manually
 * Memoized for performance
 */
const IOSInstallGuide = memo(({ onDismiss }) => {
  return (
    <div
      className="ios-install-guide"
      role="dialog"
      aria-labelledby="ios-title"
    >
      <div className="ios-guide-overlay" onClick={onDismiss} />

      <div className="ios-guide-modal">
        {/* Header */}
        <div className="ios-guide-header">
          <h2 id="ios-title" className="ios-guide-title">
            Installer EFFETMER
          </h2>
          <button
            className="ios-guide-close"
            onClick={onDismiss}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="ios-guide-content">
          <p className="ios-guide-intro">
            Ajoute EFFETMER à ton écran d'accueil pour une expérience native
            complète.
          </p>

          {/* Steps */}
          <div className="ios-guide-steps">
            {/* Step 1 */}
            <div className="ios-step">
              <div className="ios-step-number">1</div>
              <div className="ios-step-content">
                <h3>Appuie sur le bouton Partager</h3>
                <p>
                  Clique sur l'icône <strong>Partager</strong> en bas de l'écran
                </p>
                <div className="ios-step-icon">↗️</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="ios-step">
              <div className="ios-step-number">2</div>
              <div className="ios-step-content">
                <h3>Sélectionne "Sur l'écran d'accueil"</h3>
                <p>
                  Fais défiler vers le bas et appuie sur{" "}
                  <strong>"Ajouter à l'écran d'accueil"</strong>
                </p>
                <div className="ios-step-icon">📲</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="ios-step">
              <div className="ios-step-number">3</div>
              <div className="ios-step-content">
                <h3>Confirme avec "Ajouter"</h3>
                <p>
                  Tu verras EFFETMER sur ton écran d'accueil et pourra l'ouvrir
                  en un tap
                </p>
                <div className="ios-step-icon">✅</div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="ios-guide-benefits">
            <p className="ios-guide-benefits-title">Avantages :</p>
            <ul className="ios-guide-benefits-list">
              <li>
                <span className="ios-benefit-icon">🚀</span>
                <span>Accès instant depuis l'écran d'accueil</span>
              </li>
              <li>
                <span className="ios-benefit-icon">🔌</span>
                <span>Fonctionne hors ligne</span>
              </li>
              <li>
                <span className="ios-benefit-icon">🎯</span>
                <span>Plus rapide et fluide</span>
              </li>
              <li>
                <span className="ios-benefit-icon">📱</span>
                <span>Expérience plein écran native</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="ios-guide-actions">
          <button
            className="ios-guide-btn ios-guide-btn--primary"
            onClick={onDismiss}
          >
            J'ai compris
          </button>
          <button
            className="ios-guide-btn ios-guide-btn--secondary"
            onClick={onDismiss}
          >
            Me rappeler plus tard
          </button>
        </div>
      </div>
    </div>
  );
});

IOSInstallGuide.displayName = "IOSInstallGuide";

export default IOSInstallGuide;
