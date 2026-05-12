import {
  faBook,
  faChartLine,
  faCog,
  faDumbbell,
  faHome,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/components/navbar.scss";

/**
 * Modern bottom navigation bar (Strava/Samsung Health style)
 * Responsive with icon labels on smaller screens
 * Supports keyboard navigation
 */
function NavBar() {
  const [showMore, setShowMore] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    // Close more menu on Escape key
    const handleEscape = (e) => {
      if (e.key === "Escape" && showMore) {
        setShowMore(false);
      }
    };

    if (showMore) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showMore]);

  const MAIN_NAVIGATION_ITEMS = [
    { to: "/home", icon: faHome, label: "Accueil" },
    { to: "/analytics", icon: faChartLine, label: "Analytics" },
    { to: "/training", icon: faDumbbell, label: "Entraînement" },
    { to: "/profile", icon: faUser, label: "Profil" },
  ];

  const MORE_ITEMS = [
    { to: "/techniques", icon: faBook, label: "Techniques" },
    { to: "/timer", icon: faDumbbell, label: "Timer" },
    { to: "/challenges", icon: "🎯", label: "Challenges" },
    { to: "/settings", icon: faCog, label: "Paramètres" },
  ];

  return (
    <>
      <nav
        className="navbar"
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="navbar__container">
          {MAIN_NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `navbar__link ${isActive ? "navbar__link--active" : ""}`
              }
              aria-current={(isActive) => (isActive ? "page" : undefined)}
              title={item.label}
            >
              <FontAwesomeIcon icon={item.icon} className="navbar__icon" />
              <span className="navbar__label">{item.label}</span>
            </NavLink>
          ))}

          {/* More Button */}
          <button
            className={`navbar__link navbar__more-btn ${showMore ? "navbar__link--active" : ""}`}
            onClick={() => setShowMore(!showMore)}
            aria-label={showMore ? "Fermer les options" : "Plus d'options"}
            aria-expanded={showMore}
            aria-controls="navbar-more-menu"
            title="Plus"
            type="button"
          >
            <FontAwesomeIcon icon={faCog} className="navbar__icon" />
            <span className="navbar__label">Plus</span>
          </button>
        </div>
      </nav>

      {/* More Menu Overlay */}
      {showMore && (
        <div className="navbar__overlay" onClick={() => setShowMore(false)} />
      )}

      {/* More Menu */}
      {showMore && (
        <div
          className="navbar__more-menu"
          ref={moreMenuRef}
          id="navbar-more-menu"
          role="menu"
          aria-label="Options supplémentaires"
        >
          <div className="navbar__more-content">
            {MORE_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `navbar__more-item ${isActive ? "navbar__more-item--active" : ""}`
                }
                onClick={() => setShowMore(false)}
                role="menuitem"
              >
                {typeof item.icon === "string" ? (
                  <span className="navbar__more-emoji">{item.icon}</span>
                ) : (
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="navbar__more-icon"
                  />
                )}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
