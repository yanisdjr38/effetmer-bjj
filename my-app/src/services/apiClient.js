import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

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

// ============================================================================
// TRAINING SCHEDULE ENDPOINTS
// ============================================================================

/**
 * Get all training schedules
 * @returns {Promise} - Array of training schedules
 */
export const getTrainingSchedules = () => {
  return apiClient.get("/training-schedule");
};

/**
 * Get training schedules for specific day
 * @param {string} day - Day name (Lundi, Mardi, etc.)
 * @returns {Promise} - Array of schedules for that day
 */
export const getTrainingScheduleByDay = (day) => {
  return apiClient.get(`/training-schedule/${day}`);
};

/**
 * Create new training schedule
 * @param {object} scheduleData - Schedule data
 * @returns {Promise} - Created schedule
 */
export const createTrainingSchedule = (scheduleData) => {
  return apiClient.post("/training-schedule", scheduleData);
};

/**
 * Update training schedule
 * @param {string} id - Schedule ID
 * @param {object} scheduleData - Updated schedule data
 * @returns {Promise} - Updated schedule
 */
export const updateTrainingSchedule = (id, scheduleData) => {
  return apiClient.put(`/training-schedule/${id}`, scheduleData);
};

/**
 * Delete training schedule
 * @param {string} id - Schedule ID
 * @returns {Promise}
 */
export const deleteTrainingSchedule = (id) => {
  return apiClient.delete(`/training-schedule/${id}`);
};

// ============================================================================
// TRAINING SESSION ENDPOINTS
// ============================================================================

/**
 * Get all training sessions
 * @param {object} filters - Query filters (startDate, endDate)
 * @returns {Promise} - Array of training sessions
 */
export const getTrainingSessions = (filters = {}) => {
  return apiClient.get("/sessions", { params: filters });
};

/**
 * Get single training session
 * @param {string} id - Session ID
 * @returns {Promise} - Session data
 */
export const getTrainingSession = (id) => {
  return apiClient.get(`/sessions/${id}`);
};

/**
 * Create new training session
 * @param {object} sessionData - Session data
 * @returns {Promise} - Created session
 */
export const createTrainingSession = (sessionData) => {
  return apiClient.post("/sessions", sessionData);
};

/**
 * Update training session
 * @param {string} id - Session ID
 * @param {object} sessionData - Updated session data
 * @returns {Promise} - Updated session
 */
export const updateTrainingSession = (id, sessionData) => {
  return apiClient.put(`/sessions/${id}`, sessionData);
};

/**
 * Delete training session
 * @param {string} id - Session ID
 * @returns {Promise}
 */
export const deleteTrainingSession = (id) => {
  return apiClient.delete(`/sessions/${id}`);
};

/**
 * Get session statistics
 * @returns {Promise} - Statistics data
 */
export const getSessionStats = () => {
  return apiClient.get("/sessions/stats");
};

// ============================================================================
// GOALS ENDPOINTS
// ============================================================================

/**
 * Get all goals
 * @param {object} filters - Query filters (status)
 * @returns {Promise} - Array of goals
 */
export const getGoals = (filters = {}) => {
  return apiClient.get("/goals", { params: filters });
};

/**
 * Get single goal
 * @param {string} id - Goal ID
 * @returns {Promise} - Goal data
 */
export const getGoal = (id) => {
  return apiClient.get(`/goals/${id}`);
};

/**
 * Create new goal
 * @param {object} goalData - Goal data
 * @returns {Promise} - Created goal
 */
export const createGoal = (goalData) => {
  return apiClient.post("/goals", goalData);
};

/**
 * Update goal
 * @param {string} id - Goal ID
 * @param {object} goalData - Updated goal data
 * @returns {Promise} - Updated goal
 */
export const updateGoal = (id, goalData) => {
  return apiClient.put(`/goals/${id}`, goalData);
};

/**
 * Complete goal
 * @param {string} id - Goal ID
 * @returns {Promise} - Completed goal
 */
export const completeGoal = (id) => {
  return apiClient.post(`/goals/${id}/complete`);
};

/**
 * Delete goal
 * @param {string} id - Goal ID
 * @returns {Promise}
 */
export const deleteGoal = (id) => {
  return apiClient.delete(`/goals/${id}`);
};

// ============================================================================
// ACHIEVEMENTS ENDPOINTS
// ============================================================================

/**
 * Get achievements
 * @returns {Promise} - User achievements
 */
export const getAchievements = () => {
  return apiClient.get("/achievements");
};

/**
 * Update achievements
 * @param {object} achievementData - Achievement data to update
 * @returns {Promise} - Updated achievements
 */
export const updateAchievements = (achievementData) => {
  return apiClient.put("/achievements", achievementData);
};

/**
 * Unlock badge
 * @param {string} badge - Badge name
 * @returns {Promise} - Updated achievements
 */
export const unlockBadge = (badge) => {
  return apiClient.post("/achievements/unlock-badge", { badge });
};

export default apiClient;
