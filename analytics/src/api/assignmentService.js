// src/api/assignmentService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of assignments based on provided query parameters.
 * @param {object} params - Optional query parameters for filtering assignments.
 * @returns {Promise<object>} The API response data.
 */
export const getAssignments = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.ASSIGNMENTS.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Fetches a single assignment by its ID.
 * @param {string} id - The ID of the assignment.
 * @returns {Promise<object>} The API response data.
 */
export const getAssignmentById = async (id) => {
  const response = await apiClient.get(API_ENDPOINTS.ASSIGNMENTS.DETAILS(id));
  return response.data;
};

/**
 * Creates a new assignment.
 * @param {object} assignmentData - The data for the new assignment.
 * @returns {Promise<object>} The API response data.
 */
export const createAssignment = async (assignmentData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.ASSIGNMENTS.LIST_CREATE,
    assignmentData
  );
  return response.data;
};

/**
 * Updates an existing assignment.
 * @param {string} id - The ID of the assignment to update.
 * @param {object} assignmentData - The data to update.
 * @returns {Promise<object>} The API response data.
 */
export const updateAssignment = async ({ id, assignmentData }) => {
  const response = await apiClient.put(
    API_ENDPOINTS.ASSIGNMENTS.UPDATE(id),
    assignmentData
  );
  return response.data;
};

/**
 * Deletes an assignment (soft delete).
 * @param {string} id - The ID of the assignment to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteAssignment = async (id) => {
  const response = await apiClient.delete(API_ENDPOINTS.ASSIGNMENTS.DELETE(id));
  return response.data;
};
