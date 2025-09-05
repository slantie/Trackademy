// src/api/internshipService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Get all internships for the current student
 * @returns {Promise} The API response containing internships data
 */
export const getMyInternships = async () => {
  const response = await apiClient.get(
    API_ENDPOINTS.INTERNSHIPS.MY_INTERNSHIPS
  );
  return response.data;
};

/**
 * Get a specific internship by ID
 * @param {string} internshipId - The ID of the internship
 * @returns {Promise} The API response containing internship data
 */
export const getInternshipById = async (internshipId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.INTERNSHIPS.DETAILS(internshipId)
  );
  return response.data;
};

/**
 * Create a new internship
 * @param {object} internshipData - The internship data to be sent to the API
 * @returns {Promise} The API response for the created internship
 */
export const createInternship = async (internshipData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.INTERNSHIPS.LIST_CREATE,
    internshipData
  );
  return response.data;
};

/**
 * Update an existing internship
 * @param {string} internshipId - The ID of the internship to update
 * @param {object} internshipData - The updated internship data
 * @returns {Promise} The API response for the updated internship
 */
export const updateInternship = async (internshipId, internshipData) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.INTERNSHIPS.UPDATE(internshipId),
    internshipData
  );
  return response.data;
};

/**
 * Delete an internship
 * @param {string} internshipId - The ID of the internship to delete
 * @returns {Promise} The API response for the deletion
 */
export const deleteInternship = async (internshipId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.INTERNSHIPS.DELETE(internshipId)
  );
  return response.data;
};

/**
 * Get internship statistics (faculty/admin only)
 * @returns {Promise} The API response containing internship statistics
 */
export const getInternshipStats = async () => {
  const response = await apiClient.get(API_ENDPOINTS.INTERNSHIPS.STATS);
  return response.data;
};

/**
 * Get internships for a specific student (faculty/admin only)
 * @param {string} studentId - The ID of the student
 * @returns {Promise} The API response containing student internships
 */
export const getStudentInternships = async (studentId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.INTERNSHIPS.STUDENT_INTERNSHIPS(studentId)
  );
  return response.data;
};

/**
 * Create internship with file upload
 * @param {FormData} formData - The form data containing internship data and file
 * @returns {Promise} The API response for the created internship
 */
export const createInternshipWithFile = async (formData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.INTERNSHIPS.UPLOAD,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
