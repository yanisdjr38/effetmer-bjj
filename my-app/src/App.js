import { Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import InstallPrompt from "./components/InstallPrompt.jsx";
import Navbar from "./components/NavBar.jsx";
import { OfflineIndicator } from "./components/OfflineIndicator.jsx";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth.js";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import ChallengesPage from "./pages/ChallengesPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ProfileCompletionPage from "./pages/ProfileCompletionPage.jsx";
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
 * ProtectedAppContent - Main app content with routing
 * Requires AuthContext to be available
 * Handles authentication and onboarding gates
 * Flow: Not Authenticated -> LoginPage
 *       Authenticated but incomplete profile -> ProfileCompletionPage
 *       Authenticated and complete profile -> Check onboarding -> Dashboard
 */
function ProtectedAppContent() {
  const {
    isAuthenticated,
    isProfileComplete,
    isLoading: authLoading,
  } = useAuth();
  const { onboarding } = useApp();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait a moment for auth context to hydrate
    if (!authLoading) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // Show loader while initializing auth
  if (!isReady || authLoading) {
    return <PageLoader />;
  }

  // Flow 1: Not authenticated -> Show login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  // Flow 2: Authenticated but profile incomplete -> Show profile completion
  if (!isProfileComplete) {
    return (
      <Routes>
        <Route path="*" element={<ProfileCompletionPage />} />
      </Routes>
    );
  }

  // Flow 3: Profile complete but onboarding incomplete -> Show onboarding
  if (!onboarding.isComplete) {
    return (
      <Routes>
        <Route path="*" element={<OnboardingPage />} />
      </Routes>
    );
  }

  // Flow 4: Everything complete -> Show dashboard with all routes
  return (
    <div className="app-layout">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <main className="app-content" id="main-content" role="main">
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

      {/* Offline status indicator */}
      <OfflineIndicator />

      {/* PWA install prompt */}
      <InstallPrompt />
    </div>
  );
}

/**
 * AppWithAuth - Adds AppContext for dashboard features
 * Positioned inside AuthProvider so ProtectedAppContent can use useAuth hook
 */
function AppWithAuth() {
  return (
    <AppProvider>
      <ProtectedAppContent />
    </AppProvider>
  );
}

/**
 * App - Root component
 * Wraps everything with AuthProvider first so auth is available globally
 */
export default function App() {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
}
