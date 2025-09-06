// src/api/courseService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches a list of courses based on provided query parameters.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {Promise<object>} The API response data.
 */
export const getCourses = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.COURSES.LIST_CREATE, {
    params,
  });
  return response.data;
};

/**
 * Creates a new course.
 * @param {object} courseData - The data for the new course.
 * @returns {Promise<object>} The API response data.
 */
export const createCourse = async (courseData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.COURSES.LIST_CREATE,
    courseData
  );
  return response.data;
};

/**
 * Updates an existing course.
 * @param {string} courseId - The ID of the course to update.
 * @param {object} courseData - The data to update the course with.
 * @returns {Promise<object>} The API response data.
 */
export const updateCourse = async ({ courseId, courseData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.COURSES.UPDATE(courseId),
    courseData
  );
  return response.data;
};

/**
 * Deletes an existing course (soft delete).
 * @param {string} courseId - The ID of the course to delete.
 * @returns {Promise<object>} The API response data.
 */
export const deleteCourse = async (courseId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.COURSES.DELETE(courseId)
  );
  return response.data;
};
