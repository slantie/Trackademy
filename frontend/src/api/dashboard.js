import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches the dashboard summary data.
 * @returns {Promise<Object>} Summary data including counts.
 */
export const getDashboardSummary = async () => {
  const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SUMMARY);
  return response.data;
};

/**
 * Fetches the results analytics data.
 * @returns {Promise<Object>} Analytics data including pass/fail counts.
 */
export const getResultsAnalytics = async () => {
  const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.RESULTS);
  return response.data;
};
