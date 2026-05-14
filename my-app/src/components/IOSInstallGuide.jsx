import { memo } from "react";
import {
  FaCheckCircle,
  FaMobile,
  FaReply,
  FaRocket,
  FaShareAlt,
  FaTimes,
  FaWifi,
} from "react-icons/fa";
import "./ios-install-guide.scss";

/**
 * IOSInstallGuide - Premium iOS Safari install instructions
 *
 * Provides step-by-step visual guide for adding EFFETMER to home screen
 * Includes benefits and premium design
 * Supports dark mode
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
            Ajouter à l'écran d'accueil
          </h2>
          <button
            className="ios-guide-close"
            onClick={onDismiss}
            aria-label="Fermer"
            title="Fermer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="ios-guide-content">
          <p className="ios-guide-intro">
            Installez EFFETMER en 3 étapes simples pour un accès direct depuis
            votre écran d'accueil.
          </p>

          {/* Steps */}
          <div className="ios-guide-steps">
            {/* Step 1 */}
            <div className="ios-step">
              <div className="ios-step-number">1</div>
              <div className="ios-step-content">
                <h3>Appuyez sur le bouton Partager</h3>
                <p className="ios-step-description">
                  Appuyez sur l'icône <strong>Partager</strong> ou{" "}
                  <strong>Parcourir</strong> en bas de votre écran Safari
                </p>
                <div className="ios-step-icon">
                  <FaShareAlt />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="ios-step">
              <div className="ios-step-number">2</div>
              <div className="ios-step-content">
                <h3>Sélectionnez "Sur l'écran d'accueil"</h3>
                <p className="ios-step-description">
                  Faites défiler les options et choisissez{" "}
                  <strong>"Ajouter à l'écran d'accueil"</strong>
                </p>
                <div className="ios-step-icon">
                  <FaReply />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="ios-step">
              <div className="ios-step-number">3</div>
              <div className="ios-step-content">
                <h3>Confirmez avec "Ajouter"</h3>
                <p className="ios-step-description">
                  Vérifiez le nom et l'icône, puis appuyez sur{" "}
                  <strong>"Ajouter"</strong>
                </p>
                <div className="ios-step-icon">
                  <FaCheckCircle style={{ color: "#34d399" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="ios-guide-benefits">
            <p className="ios-guide-benefits-title">
              ✨ Avantages de l'installation :
            </p>
            <ul className="ios-guide-benefits-list">
              <li className="ios-benefit-item">
                <span className="ios-benefit-icon">
                  <FaMobile />
                </span>
                <span>
                  <strong>Accès instantané</strong> - Lancez EFFETMER en un tap
                </span>
              </li>
              <li className="ios-benefit-item">
                <span className="ios-benefit-icon">
                  <FaWifi />
                </span>
                <span>
                  <strong>Fonctionne hors ligne</strong> - Pas besoin de
                  connexion internet
                </span>
              </li>
              <li className="ios-benefit-item">
                <span className="ios-benefit-icon">
                  <FaRocket />
                </span>
                <span>
                  <strong>Ultra-rapide</strong> - Chargement très performant
                </span>
              </li>
              <li className="ios-benefit-item">
                <span className="ios-benefit-icon">
                  <FaMobile />
                </span>
                <span>
                  <strong>Expérience native</strong> - Comme une vraie
                  application
                </span>
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
            C'est compris !
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
