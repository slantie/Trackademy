// src/api/collegeService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of all colleges.
 * @returns {Promise<object>} The API response data containing a list of colleges.
 */
export const getColleges = async () => {
  const response = await apiClient.get(API_ENDPOINTS.COLLEGES.LIST_CREATE);
  return response.data;
};

/**
 * Creates a new college.
 * @param {object} collegeData - The data for the new college.
 * @returns {Promise<object>} The API response data.
 */
export const createCollege = async (collegeData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.COLLEGES.LIST_CREATE,
    collegeData
  );
  return response.data;
};

/**
 * Updates an existing college.
 * @param {string} collegeId - The ID of the college to update.
 * @param {object} collegeData - The data to update the college with.
 * @returns {Promise<object>} The API response data.
 */
export const updateCollege = async ({ collegeId, collegeData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.COLLEGES.UPDATE(collegeId),
    collegeData
  );
  return response.data;
};

/**
 * Deletes an existing college (soft delete).
 * @param {string} collegeId - The ID of the college to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteCollege = async (collegeId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.COLLEGES.DELETE(collegeId)
  );
  return response.data;
};
