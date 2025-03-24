import React from "react";
import MyTechniques from "../components/MyTechniques.js";
import NavBar from "../components/NavBar.js";
import SearchBar from "../components/SearchBar.js";

function TrainingPage() {
  return (
    <div>
      <SearchBar />
      <MyTechniques />
      <NavBar />
    </div>
  );
}

export default TrainingPage;
