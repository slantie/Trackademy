const TOKEN_KEY = "authToken";
const USER_KEY = "user";
const AUTH_STATUS_KEY = "isAuthenticated";

export const authService = {
  /**
   * Initialize auth service by cleaning up any old token keys
   */
  init: () => {
    try {
      // Remove old token key if it exists
      const oldToken = localStorage.getItem("trackademy_token");
      if (oldToken) {
        localStorage.removeItem("trackademy_token");
        console.log("Cleaned up old token key");
      }
    } catch (error) {
      console.error("Error during auth service initialization:", error);
    }
  },

  /**
   * Save JWT token to localStorage
   * @param {string} token - JWT token to save
   */
  saveToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token to localStorage:", error);
    }
  },

  /**
   * Retrieve JWT token from localStorage
   * @returns {string|null} - JWT token or null if not found
   */
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error retrieving token from localStorage:", error);
      return null;
    }
  },

  /**
   * Save user data to localStorage
   * @param {Object} user - User object to save
   */
  saveUser: (user) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(AUTH_STATUS_KEY, "true");
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  },

  /**
   * Retrieve user data from localStorage
   * @returns {Object|null} - User object or null if not found
   */
  getUser: () => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error retrieving user from localStorage:", error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const authStatus = localStorage.getItem(AUTH_STATUS_KEY);
      return !!(token && authStatus === "true");
    } catch (error) {
      console.error("Error checking authentication status:", error);
      return false;
    }
  },

  /**
   * Remove all authentication data from localStorage
   */
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(AUTH_STATUS_KEY);
      // Also clean up old token key just in case
      localStorage.removeItem("trackademy_token");
    } catch (error) {
      console.error("Error removing auth data from localStorage:", error);
    }
  },
};
