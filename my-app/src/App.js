import React from "react";
import { Route, Routes } from "react-router-dom";
import InstallPrompt from "./components/InstallPrompt";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import TechniquesPage from "./pages/TechniquesPage";
import TimerPage from "./pages/TimerPage";
import TrainingPage from "./pages/TrainingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/techniques" element={<TechniquesPage />} />
        <Route path="/timer" element={<TimerPage />} />
      </Routes>
      <Navbar />
      <InstallPrompt />
    </>
  );
}

export default App;
