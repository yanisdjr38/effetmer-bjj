import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./stat-card.scss";

/**
 * StatCard - Modern stat display with icon, label, and value
 * Used in HomePage for displaying training statistics
 * @param {object} icon - Font Awesome icon object
 * @param {string} label - Stat label/title
 * @param {string|number} value - Stat value to display
 * @param {string} [variant] - Card variant: 'primary', 'accent', 'success'
 */
function StatCard({ icon, label, value, variant = "primary" }) {
  return (
    <article
      className={`stat-card stat-card--${variant}`}
      role="region"
      aria-label={`Statistique: ${label}`}
    >
      <div className="stat-card__icon-wrapper">
        <FontAwesomeIcon icon={icon} className="stat-card__icon" />
      </div>
      <h3 className="stat-card__label">{label}</h3>
      <div className="stat-card__value" role="text">
        {value}
      </div>
    </article>
  );
}

export default StatCard;
