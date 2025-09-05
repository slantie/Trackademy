// src/api/academicYearService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of academic years.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {Promise<object>} The API response data.
 */
export const getAcademicYears = async (params) => {
  const response = await apiClient.get(
    API_ENDPOINTS.ACADEMIC_YEARS.LIST_CREATE,
    { params }
  );
  return response.data;
};

/**
 * Creates a new academic year.
 * @param {object} yearData - The data for the new academic year.
 * @returns {Promise<object>} The API response data.
 */
export const createAcademicYear = async (yearData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.ACADEMIC_YEARS.LIST_CREATE,
    yearData
  );
  return response.data;
};

/**
 * Updates an existing academic year.
 * @param {string} yearId - The ID of the academic year to update.
 * @param {object} yearData - The data to update.
 * @returns {Promise<object>} The API response data.
 */
export const updateAcademicYear = async ({ yearId, yearData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.ACADEMIC_YEARS.UPDATE(yearId),
    yearData
  );
  return response.data;
};

/**
 * Deletes an academic year.
 * @param {string} yearId - The ID of the academic year to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteAcademicYear = async (yearId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.ACADEMIC_YEARS.DELETE(yearId)
  );
  return response.data;
};

/**
 * Activates an academic year.
 * @param {string} yearId - The ID of the academic year to activate.
 * @returns {Promise<object>} The API response data.
 */
export const activateAcademicYear = async (yearId) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.ACADEMIC_YEARS.ACTIVATE(yearId)
  );
  return response.data;
};
