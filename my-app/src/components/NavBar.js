import { useState } from "react";
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
  // Stocker les icônes actuelles
  const [icons, setIcons] = useState({
    home: homeIcon,
    note: noteIcon,
    skill: skillIcon,
    chrono: chronoIcon,
    user: userIcon,
  });

  // Fonction pour changer l'icône temporairement au clic
  const handleImageClick = (key, defaultIcon, activeIcon) => {
    setIcons((prevIcons) => ({
      ...prevIcons,
      [key]: activeIcon,
    }));

    setTimeout(() => {
      setIcons((prevIcons) => ({
        ...prevIcons,
        [key]: defaultIcon,
      }));
    }, 500);
  };

  // Fonction pour gérer le survol
  const handleMouseEnter = (key, activeIcon) => {
    setIcons((prevIcons) => ({
      ...prevIcons,
      [key]: activeIcon,
    }));
  };

  // Fonction pour restaurer l'icône quand la souris part
  const handleMouseLeave = (key, defaultIcon) => {
    setIcons((prevIcons) => ({
      ...prevIcons,
      [key]: defaultIcon,
    }));
  };

  return (
    <nav className="navbar">
      <a>
        <button
          onClick={() => handleImageClick("home", homeIcon, activeHomeIcon)}
          onMouseEnter={() => handleMouseEnter("home", activeHomeIcon)}
          onMouseLeave={() => handleMouseLeave("home", homeIcon)}
        >
          <img src={icons.home} alt="Home" />
        </button>
      </a>
      <a>
        <button
          onClick={() => handleImageClick("note", noteIcon, activeNoteIcon)}
          onMouseEnter={() => handleMouseEnter("note", activeNoteIcon)}
          onMouseLeave={() => handleMouseLeave("note", noteIcon)}
        >
          <img src={icons.note} alt="Note" />
        </button>
      </a>
      <a>
        <button
          onClick={() => handleImageClick("skill", skillIcon, activeSkillIcon)}
          onMouseEnter={() => handleMouseEnter("skill", activeSkillIcon)}
          onMouseLeave={() => handleMouseLeave("skill", skillIcon)}
        >
          <img src={icons.skill} alt="Skill" />
        </button>
      </a>
      <a>
        <button
          onClick={() =>
            handleImageClick("chrono", chronoIcon, activeChronoIcon)
          }
          onMouseEnter={() => handleMouseEnter("chrono", activeChronoIcon)}
          onMouseLeave={() => handleMouseLeave("chrono", chronoIcon)}
        >
          <img src={icons.chrono} alt="Chrono" />
        </button>
      </a>
      <a>
        <button
          onClick={() => handleImageClick("user", userIcon, activeUserIcon)}
          onMouseEnter={() => handleMouseEnter("user", activeUserIcon)}
          onMouseLeave={() => handleMouseLeave("user", userIcon)}
        >
          <img src={icons.user} alt="User" />
        </button>
      </a>
    </nav>
  );
}

export default NavBar;
