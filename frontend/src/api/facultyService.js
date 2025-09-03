// src/api/facultyService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of all faculties based on provided query parameters.
 * @param {object} params - Optional query parameters for filtering faculties.
 * @returns {Promise<object>} The API response data.
 */
export const getFaculties = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.FACULTIES.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Creates a new faculty member.
 * @param {object} facultyData - The data for the new faculty member.
 * @returns {Promise<object>} The API response data.
 */
export const createFaculty = async (facultyData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.FACULTIES.LIST_CREATE,
    facultyData
  );
  return response.data;
};

/**
 * Updates an existing faculty member.
 * @param {string} facultyId - The ID of the faculty member to update.
 * @param {object} facultyData - The data to update the faculty member with.
 * @returns {Promise<object>} The API response data.
 */
export const updateFaculty = async ({ facultyId, facultyData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.FACULTIES.UPDATE(facultyId),
    facultyData
  );
  return response.data;
};

/**
 * Deletes an existing faculty member (soft delete).
 * @param {string} facultyId - The ID of the faculty member to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteFaculty = async (facultyId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.FACULTIES.DELETE(facultyId)
  );
  return response.data;
};
