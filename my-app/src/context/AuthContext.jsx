import { createContext, useCallback, useEffect, useState } from "react";
import {
  logout as apiLogout,
  getCurrentUser,
  requestMagicLink,
  updateUserProfile,
  verifyMagicLink,
} from "../services/apiClient";

/**
 * AuthContext - Manages user authentication state
 * Handles magic link flow, token storage, and user session
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  /**
   * Check if user is already authenticated on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const cachedUser = localStorage.getItem("currentUser");

        if (accessToken) {
          // Try to fetch fresh user data
          try {
            const response = await getCurrentUser();
            const userData = response.data.data;
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("currentUser", JSON.stringify(userData));
            // Check if profile is complete (has required fields)
            setIsProfileComplete(isUserProfileComplete(userData));
          } catch (err) {
            // Token might be expired, try to refresh or clear
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("currentUser");
            setIsAuthenticated(false);
            setUser(null);
            setIsProfileComplete(false);
          }
        } else if (cachedUser) {
          const userData = JSON.parse(cachedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setIsProfileComplete(isUserProfileComplete(userData));
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Check if user profile has required fields
   */
  const isUserProfileComplete = (userData) => {
    return !!(
      userData?.profile?.firstName &&
      userData?.profile?.lastName &&
      userData?.profile?.belt &&
      userData?.profile?.academy
    );
  };

  /**
   * Request magic link for email
   */
  const requestLogin = useCallback(async (email) => {
    setError(null);
    try {
      const response = await requestMagicLink(email);
      return response.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Erreur lors de l'envoi du lien de connexion";
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * Verify magic link and authenticate user
   */
  const verifyLogin = useCallback(async (email, token) => {
    setError(null);
    try {
      const response = await verifyMagicLink(email, token);
      const {
        user: userData,
        tokens: { accessToken, refreshToken },
      } = response.data.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      setIsProfileComplete(isUserProfileComplete(userData));

      return userData;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Erreur lors de la vérification du lien";
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(async (profileData) => {
    setError(null);
    try {
      const response = await updateUserProfile(profileData);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setIsProfileComplete(isUserProfileComplete(updatedUser));
      return updatedUser;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Erreur lors de la mise à jour";
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setError(null);
    try {
      await apiLogout();
      setUser(null);
      setIsAuthenticated(false);
      setIsProfileComplete(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isProfileComplete,
    error,
    requestLogin,
    verifyLogin,
    updateProfile,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
