// src/api/departmentService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of departments based on provided query parameters.
 * @param {object} params - Optional query parameters for filtering departments.
 * @returns {Promise<object>} The API response data.
 */
export const getDepartments = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.DEPARTMENTS.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Creates a new department.
 * @param {object} departmentData - The data for the new department.
 * @returns {Promise<object>} The API response data.
 */
export const createDepartment = async (departmentData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.DEPARTMENTS.LIST_CREATE,
    departmentData
  );
  return response.data;
};

/**
 * Updates an existing department.
 * @param {string} departmentId - The ID of the department to update.
 * @param {object} departmentData - The data to update the department with.
 * @returns {Promise<object>} The API response data.
 */
export const updateDepartment = async ({ departmentId, departmentData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.DEPARTMENTS.UPDATE(departmentId),
    departmentData
  );
  return response.data;
};

/**
 * Deletes an existing department (soft delete).
 * @param {string} departmentId - The ID of the department to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteDepartment = async (departmentId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.DEPARTMENTS.DELETE(departmentId)
  );
  return response.data;
};
