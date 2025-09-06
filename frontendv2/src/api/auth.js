import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Login user with credentials
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.identifier - Email or enrollment number
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Response data containing token and user
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
    identifier: credentials.identifier,
    password: credentials.password,
  });

  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  return response.data;
};
