import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api";

/**
 * Create axios instance with JWT interceptor
 * Automatically adds Authorization header and refreshes token if needed
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - Add JWT token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor - Handle token refresh on 401
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Call refresh endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        );

        // Store new tokens
        localStorage.setItem("accessToken", response.data.data.accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and let app handle logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("currentUser");
        window.location.href = "/#/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Request magic link for authentication
 * @param {string} email - User email
 * @returns {Promise} - API response
 */
export const requestMagicLink = (email) => {
  return apiClient.post("/auth/request-magic-link", { email });
};

/**
 * Verify magic link token and authenticate user
 * @param {string} email - User email
 * @param {string} token - Magic link token
 * @returns {Promise} - API response with user and tokens
 */
export const verifyMagicLink = (email, token) => {
  return apiClient.post("/auth/verify-magic-link", { email, token });
};

/**
 * Get current user profile
 * @returns {Promise} - User profile data
 */
export const getCurrentUser = () => {
  return apiClient.get("/users/me");
};

/**
 * Update user profile
 * @param {object} userData - User data to update
 * @returns {Promise} - Updated user data
 */
export const updateUserProfile = (userData) => {
  return apiClient.put("/users/profile", userData);
};

/**
 * Logout user
 * @returns {Promise}
 */
export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");
  return Promise.resolve();
};

export default apiClient;
