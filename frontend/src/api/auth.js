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
  const fullURL = `${apiClient.defaults.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`;
  console.log("📡 Making login API call to full URL:", fullURL);
  console.log("📡 Endpoint:", API_ENDPOINTS.AUTH.LOGIN);
  console.log("📡 Base URL:", apiClient.defaults.baseURL);
  console.log("📤 Sending credentials:", {
    identifier: credentials.identifier,
    password: "***",
  });

  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
    identifier: credentials.identifier,
    password: credentials.password,
  });

  console.log("📥 Login API response status:", response.status);
  console.log("📥 Login API response data:", response.data);

  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  console.log("📡 Making profile API call to:", API_ENDPOINTS.AUTH.PROFILE);

  const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

  console.log("📥 Profile API response status:", response.status);
  console.log("📥 Profile API response data:", response.data);

  return response.data;
};

/**
 * Update user password
 * @param {Object} passwordData - Password update data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise<Object>} Response data
 */
export const updatePassword = async (passwordData) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.AUTH.UPDATE_PASSWORD,
    passwordData
  );
  return response.data;
};
