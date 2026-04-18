import {
  faBook,
  faClock,
  faDumbbell,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import "../styles/components/navbar.scss";

/**
 * Modern bottom navigation bar (Strava/Samsung Health style)
 * Responsive with icon labels on smaller screens
 */
function NavBar() {
  const NAVIGATION_ITEMS = [
    { to: "/home", icon: faHome, label: "Accueil" },
    { to: "/training", icon: faDumbbell, label: "Entraînement" },
    { to: "/techniques", icon: faBook, label: "Techniques" },
    { to: "/timer", icon: faClock, label: "Timer" },
  ];

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="Navigation principale"
    >
      <div className="navbar__container">
        {NAVIGATION_ITEMS.map((item) => (
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
      </div>
    </nav>
  );
}

export default NavBar;
