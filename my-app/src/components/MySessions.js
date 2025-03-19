import React, { useState } from "react";
import btnPLus from "../assets/images/square-plus.png";
import btnPLusActive from "../assets/images/square-plusactive.png";

import SessionsCard from "../components/SessionsCard";
import "../styles/MySessions.css";

function MySessions() {
  const [icons, setIcons] = useState({
    plus: btnPLus,
  });

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

  const handleMouseEnter = (key, activeIcon) => {
    setIcons((prevIcons) => ({
      ...prevIcons,
      [key]: activeIcon,
    }));
  };

  const handleMouseLeave = (key, defaultIcon) => {
    setIcons((prevIcons) => ({
      ...prevIcons,
      [key]: defaultIcon,
    }));
  };

  return (
    <section className="mysessions">
      <h3>My Sessions</h3>
      <button
        onClick={() => handleImageClick("plus", btnPLus, btnPLusActive)}
        onMouseEnter={() => handleMouseEnter("plus", btnPLusActive)}
        onMouseLeave={() => handleMouseLeave("plus", btnPLus)}
      >
        <img src={icons.plus} alt="plus" /> Add Sessions
      </button>
      <div className="mysessions-container">
        <SessionsCard />
      </div>
    </section>
  );
}

export default MySessions;
