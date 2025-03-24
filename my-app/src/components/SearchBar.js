import React, { useState } from "react";
import searchIconActive from "../assets/images/search (1).png";
import searchIcon from "../assets/images/search.png";
import "../styles/SearchBar.css";

function SearchBar() {
  const [icon, setIcon] = useState(searchIcon);

  const handleMouseEnter = () => {
    setIcon(searchIconActive);
  };

  const handleMouseLeave = () => {
    setIcon(searchIcon);
  };

  return (
    <div className="searchbar">
      <input type="text" placeholder="Search..." />
      <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img src={icon} alt="Search Icon" />
      </button>
    </div>
  );
}

export default SearchBar;
