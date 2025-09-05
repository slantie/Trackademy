// src/api/studentService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of students based on provided query parameters.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {Promise<object>} The API response data.
 */
export const getStudents = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.STUDENTS.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Fetches a single student's details by their ID.
 * @param {string} studentId - The ID of the student to fetch.
 * @returns {Promise<object>} The API response data.
 */
export const getStudentById = async (studentId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.STUDENTS.DETAILS(studentId)
  );
  return response.data;
};

/**
 * Creates a new student.
 * @param {object} studentData - The data for the new student.
 * @returns {Promise<object>} The API response data.
 */
export const createStudent = async (studentData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.STUDENTS.LIST_CREATE,
    studentData
  );
  return response.data;
};

/**
 * Updates an existing student.
 * @param {string} studentId - The ID of the student to update.
 * @param {object} studentData - The data to update the student with.
 * @returns {Promise<object>} The API response data.
 */
export const updateStudent = async ({ studentId, studentData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.STUDENTS.UPDATE(studentId),
    studentData
  );
  return response.data;
};

/**
 * Deletes an existing student (soft delete).
 * @param {string} studentId - The ID of the student to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteStudent = async (studentId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.STUDENTS.DELETE(studentId)
  );
  return response.data;
};
