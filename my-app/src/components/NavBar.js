import { useState } from "react";
import { Link } from "react-router-dom"; // 🚀 Ajout de Link
import skillIcon from "../assets/images/book-alt.png";
import homeIcon from "../assets/images/home.png";
import noteIcon from "../assets/images/journal-alt.png";
import chronoIcon from "../assets/images/stopwatch.png";
import userIcon from "../assets/images/user.png";

import activeSkillIcon from "../assets/images/book-alt (1).png";
import activeHomeIcon from "../assets/images/home1.png";
import activeNoteIcon from "../assets/images/journal-alt (1).png";
import activeChronoIcon from "../assets/images/stopwatch (1).png";
import activeUserIcon from "../assets/images/user (1).png";

import "../styles/NavBar.css";

function NavBar() {
  const [icons, setIcons] = useState({
    home: homeIcon,
    note: noteIcon,
    skill: skillIcon,
    chrono: chronoIcon,
    user: userIcon,
  });

  const handleMouseEnter = (key, activeIcon) => {
    setIcons((prevIcons) => ({ ...prevIcons, [key]: activeIcon }));
  };

  const handleMouseLeave = (key, defaultIcon) => {
    setIcons((prevIcons) => ({ ...prevIcons, [key]: defaultIcon }));
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <button
          onMouseEnter={() => handleMouseEnter("home", activeHomeIcon)}
          onMouseLeave={() => handleMouseLeave("home", homeIcon)}
        >
          <img src={icons.home} alt="Home" />
        </button>
      </Link>
      <Link to="/notes">
        <button
          onMouseEnter={() => handleMouseEnter("note", activeNoteIcon)}
          onMouseLeave={() => handleMouseLeave("note", noteIcon)}
        >
          <img src={icons.note} alt="Notes" />
        </button>
      </Link>
      <Link to="/training">
        <button
          onMouseEnter={() => handleMouseEnter("skill", activeSkillIcon)}
          onMouseLeave={() => handleMouseLeave("skill", skillIcon)}
        >
          <img src={icons.skill} alt="Skills" />
        </button>
      </Link>
      <Link to="/chrono">
        <button
          onMouseEnter={() => handleMouseEnter("chrono", activeChronoIcon)}
          onMouseLeave={() => handleMouseLeave("chrono", chronoIcon)}
        >
          <img src={icons.chrono} alt="Chrono" />
        </button>
      </Link>
      <Link to="/profile">
        <button
          onMouseEnter={() => handleMouseEnter("user", activeUserIcon)}
          onMouseLeave={() => handleMouseLeave("user", userIcon)}
        >
          <img src={icons.user} alt="User" />
        </button>
      </Link>
    </nav>
  );
}

export default NavBar;
