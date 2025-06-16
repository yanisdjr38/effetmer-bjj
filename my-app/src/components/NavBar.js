import React from "react";
import { FaBook, FaClock, FaHome, FaListAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  const tabs = [
    { to: "/home", icon: <FaHome />, label: "Accueil" },
    { to: "/training", icon: <FaListAlt />, label: "Entraînement" },
    { to: "/techniques", icon: <FaBook />, label: "Techniques" },
    { to: "/timer", icon: <FaClock />, label: "Timer" },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={location.pathname === tab.to ? "active" : ""}
        >
          {tab.icon}
          <span className="nav-label">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default NavBar;
