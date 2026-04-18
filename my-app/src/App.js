import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import InstallPrompt from "./components/InstallPrompt.jsx";
import Navbar from "./components/NavBar.jsx";
import HomePage from "./pages/HomePage.jsx";
import TechniquesPage from "./pages/TechniquesPage.jsx";
import TimerPage from "./pages/TimerPage.jsx";
import TrainingPage from "./pages/TrainingPage.jsx";
import "./styles/index.scss";

/** Skeleton loader for page transitions */
const PageLoader = () => (
  <div style={{ textAlign: "center", padding: "3rem" }}>
    <p>Chargement...</p>
  </div>
);

export default function App() {
  return (
    <div className="app-layout">
      <main className="app-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/techniques" element={<TechniquesPage />} />
            <Route path="/timer" element={<TimerPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* Modern bottom navigation bar */}
      <Navbar />

      {/* PWA install prompt */}
      <InstallPrompt />
    </div>
  );
}
