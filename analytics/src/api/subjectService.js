// src/api/subjectService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of all subjects based on provided query parameters.
 * @param {object} params - Optional query parameters for filtering subjects.
 * @returns {Promise<object>} The API response data.
 */
export const getSubjects = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.SUBJECTS.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Creates a new subject.
 * @param {object} subjectData - The data for the new subject.
 * @returns {Promise<object>} The API response data.
 */
export const createSubject = async (subjectData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.SUBJECTS.LIST_CREATE,
    subjectData
  );
  return response.data;
};

/**
 * Updates an existing subject.
 * @param {string} subjectId - The ID of the subject to update.
 * @param {object} subjectData - The data to update the subject with.
 * @returns {Promise<object>} The API response data.
 */
export const updateSubject = async ({ subjectId, subjectData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.SUBJECTS.UPDATE(subjectId),
    subjectData
  );
  return response.data;
};

/**
 * Deletes an existing subject (soft delete).
 * @param {string} subjectId - The ID of the subject to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteSubject = async (subjectId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.SUBJECTS.DELETE(subjectId)
  );
  return response.data;
};
