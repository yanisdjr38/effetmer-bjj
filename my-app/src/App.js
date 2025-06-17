import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import TechniquesPage from "./pages/TechniquesPage";
import TimerPage from "./pages/TimerPage";
import TrainingPage from "./pages/TrainingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/techniques" element={<TechniquesPage />} />
        <Route path="/timer" element={<TimerPage />} />
      </Routes>
      <NavBar />
    </Router>
  );
}

export default App;
