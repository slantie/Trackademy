// src/services/submissionService.js
import apiClient from "../api/apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const submissionService = {
  // Get all submissions for faculty
  getSubmissions: async () => {
    try {
      console.log("Fetching all submissions for faculty");
      const response = await apiClient.get(
        API_ENDPOINTS.SUBMISSIONS.LIST_CREATE
      );
      console.log("Get submissions response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions:", error);
      throw error;
    }
  },

  // Get submissions by assignment ID
  getSubmissionsByAssignment: async (assignmentId) => {
    try {
      console.log("Fetching submissions for assignment:", assignmentId);
      const response = await apiClient.get(
        API_ENDPOINTS.SUBMISSIONS.FOR_ASSIGNMENT(assignmentId)
      );
      console.log("Get submissions by assignment response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions by assignment:", error);
      throw error;
    }
  },

  // Create a new submission (student)
  createSubmission: async (submissionData) => {
    try {
      console.log("Creating submission:", submissionData);
      const response = await apiClient.post(
        API_ENDPOINTS.SUBMISSIONS.LIST_CREATE,
        submissionData
      );
      console.log("Create submission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating submission:", error);
      throw error;
    }
  },

  // Grade a submission (faculty)
  gradeSubmission: async (submissionId, gradeData) => {
    try {
      console.log("Grading submission:", submissionId, "with data:", gradeData);
      const response = await apiClient.post(
        API_ENDPOINTS.SUBMISSIONS.GRADE(submissionId),
        gradeData
      );
      console.log("Grade submission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error grading submission:", error);
      throw error;
    }
  },

  // Update a submission
  updateSubmission: async (submissionId, updateData) => {
    try {
      console.log(
        "Updating submission:",
        submissionId,
        "with data:",
        updateData
      );
      const response = await apiClient.put(
        `/submissions/${submissionId}`,
        updateData
      );
      console.log("Update submission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating submission:", error);
      throw error;
    }
  },

  // Delete a submission
  deleteSubmission: async (submissionId) => {
    try {
      console.log("Deleting submission:", submissionId);
      const response = await apiClient.delete(`/submissions/${submissionId}`);
      console.log("Delete submission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error deleting submission:", error);
      throw error;
    }
  },

  // Get submission by ID
  getSubmissionById: async (submissionId) => {
    try {
      console.log("Fetching submission by ID:", submissionId);
      const response = await apiClient.get(`/submissions/${submissionId}`);
      console.log("Get submission by ID response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching submission by ID:", error);
      throw error;
    }
  },
};

export default submissionService;
