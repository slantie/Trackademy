const TOKEN_KEY = "trackademy_token";

export const authService = {
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
   * Remove JWT token from localStorage
   */
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token from localStorage:", error);
    }
  },
};
