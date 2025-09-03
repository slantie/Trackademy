// src/api/divisionService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of divisions based on provided query parameters.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {Promise<object>} The API response data.
 */
export const getDivisions = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.DIVISIONS.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Creates a new division.
 * @param {object} divisionData - The data for the new division.
 * @returns {Promise<object>} The API response data.
 */
export const createDivision = async (divisionData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.DIVISIONS.LIST_CREATE,
    divisionData
  );
  return response.data;
};

/**
 * Updates an existing division.
 * @param {string} divisionId - The ID of the division to update.
 * @param {object} divisionData - The data to update the division with.
 * @returns {Promise<object>} The API response data.
 */
export const updateDivision = async ({ divisionId, divisionData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.DIVISIONS.UPDATE(divisionId),
    divisionData
  );
  return response.data;
};

/**
 * Deletes an existing division (soft delete).
 * @param {string} divisionId - The ID of the division to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteDivision = async (divisionId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.DIVISIONS.DELETE(divisionId)
  );
  return response.data;
};
