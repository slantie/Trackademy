// src/api/submissionService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of submissions.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {Promise} The API response containing submissions data.
 */
export const getSubmissions = async (params = {}) => {
  const response = await apiClient.get(API_ENDPOINTS.SUBMISSIONS.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Fetches submissions for a specific assignment.
 * @param {string} assignmentId - The ID of the assignment.
 * @returns {Promise} The API response containing submissions data.
 */
export const getSubmissionsByAssignment = async (assignmentId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.SUBMISSIONS.FOR_ASSIGNMENT(assignmentId)
  );
  return response.data;
};

/**
 * Creates a new submission.
 * @param {object} submissionData - The submission data to be sent to the API.
 * @returns {Promise} The API response for the created submission.
 */
export const createSubmission = async (submissionData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.SUBMISSIONS.LIST_CREATE,
    submissionData
  );
  return response.data;
};

/**
 * Creates a new submission with file upload.
 * @param {object} submissionData - The submission data including file.
 * @param {File} submissionData.file - The file to upload (optional).
 * @param {string} submissionData.content - Text content (optional).
 * @param {string} submissionData.assignmentId - The assignment ID.
 * @returns {Promise} The API response for the created submission.
 */
export const createSubmissionWithFile = async (submissionData) => {
  const formData = new FormData();

  if (submissionData.file) {
    formData.append("file", submissionData.file);
  }

  if (submissionData.content) {
    formData.append("content", submissionData.content);
  }

  formData.append("assignmentId", submissionData.assignmentId);

  const response = await apiClient.post(
    API_ENDPOINTS.SUBMISSIONS.UPLOAD,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

/**
 * Grades a submission (updates marks and feedback).
 * @param {object} param - Object containing submissionId and submissionData.
 * @param {string} param.submissionId - The ID of the submission to grade.
 * @param {object} param.submissionData - The grading data (marks, feedback, status).
 * @returns {Promise} The API response for the updated submission.
 */
export const gradeSubmission = async ({ submissionId, submissionData }) => {
  const response = await apiClient.post(
    API_ENDPOINTS.SUBMISSIONS.GRADE(submissionId),
    submissionData
  );
  return response.data;
};
