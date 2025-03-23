import React from "react";
import Banner from "../components/Banner.js";
import MySessions from "../components/MySessions.js";
import MyTechniques from "../components/MyTechniques.js";
import NavBar from "../components/NavBar.js";

function HomePage() {
  return (
    <div>
      <Banner />
      <MySessions />
      <MyTechniques />
      <NavBar />
    </div>
  );
}

export default HomePage;
