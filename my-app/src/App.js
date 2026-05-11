import { Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import InstallPrompt from "./components/InstallPrompt.jsx";
import Navbar from "./components/NavBar.jsx";
import { AppProvider, useApp } from "./context/AppContext";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import ChallengesPage from "./pages/ChallengesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
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

/**
 * AppContent - Main app content with routing
 * Handles onboarding gate - redirects to OnboardingPage if setup not complete
 */
function AppContent() {
  const { onboarding } = useApp();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure context is ready
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  // If onboarding not complete, show onboarding page
  if (!onboarding.isComplete) {
    return (
      <Routes>
        <Route path="*" element={<OnboardingPage />} />
      </Routes>
    );
  }

  // Otherwise show normal dashboard
  return (
    <div className="app-layout">
      <main className="app-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/techniques" element={<TechniquesPage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
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

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
