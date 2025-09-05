// src/api/semesterService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of semesters based on provided query parameters.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {Promise<object>} The API response data.
 */
export const getSemesters = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.SEMESTERS.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Creates a new semester.
 * @param {object} semesterData - The data for the new semester.
 * @returns {Promise<object>} The API response data.
 */
export const createSemester = async (semesterData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.SEMESTERS.LIST_CREATE,
    semesterData
  );
  return response.data;
};

/**
 * Updates an existing semester.
 * @param {string} semesterId - The ID of the semester to update.
 * @param {object} semesterData - The data to update the semester with.
 * @returns {Promise<object>} The API response data.
 */
export const updateSemester = async ({ semesterId, semesterData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.SEMESTERS.UPDATE(semesterId),
    semesterData
  );
  return response.data;
};

/**
 * Deletes an existing semester (soft delete).
 * @param {string} semesterId - The ID of the semester to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteSemester = async (semesterId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.SEMESTERS.DELETE(semesterId)
  );
  return response.data;
};
