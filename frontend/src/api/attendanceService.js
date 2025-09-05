// src/api/attendanceService.js

import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * Fetches attendance records for a given course and date.
 * @param {Object} params - Query parameters.
 * @param {string} params.courseId - The ID of the course.
 * @param {string} params.date - The date of the attendance record (YYYY-MM-DD format).
 * @returns {Promise<Object>} The API response data.
 */
export const getAttendance = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.LIST, {
    params,
  });
  return response.data;
};

/**
 * Fetches courses assigned to the authenticated faculty.
 * @returns {Promise<Object>} The API response data.
 */
export const getFacultyCourses = async () => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.ATTENDANCE.LIST}/faculty/courses`
  );
  return response.data;
};

/**
 * Fetches students enrolled in a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Object>} The API response data.
 */
export const getCourseStudents = async (courseId) => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.ATTENDANCE.LIST}/course/${courseId}/students`
  );
  return response.data;
};

/**
 * Creates bulk attendance records for a course.
 * @param {Object} attendanceData - The attendance data.
 * @param {string} attendanceData.date - The date of the attendance record.
 * @param {string} attendanceData.courseId - The ID of the course.
 * @param {Array} attendanceData.attendanceRecords - Array of student attendance records.
 * @returns {Promise<Object>} The API response data.
 */
export const createBulkAttendance = async (attendanceData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.ATTENDANCE.LIST,
    attendanceData
  );
  return response.data;
};

/**
 * Updates a specific attendance record.
 * @param {string} attendanceId - The ID of the attendance record to update.
 * @param {Object} attendanceData - The data to update.
 * @param {string} attendanceData.status - The new attendance status.
 * @returns {Promise<Object>} The API response data.
 */
export const updateAttendance = async ({ attendanceId, attendanceData }) => {
  const response = await apiClient.patch(
    API_ENDPOINTS.ATTENDANCE.UPDATE(attendanceId),
    attendanceData
  );
  return response.data;
};

/**
 * Uploads an attendance file.
 * @param {FormData} formData - The FormData object containing the file and other fields.
 * @returns {Promise<Object>} The API response data.
 */
export const uploadAttendanceFile = async (formData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.ATTENDANCE.UPLOAD,
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
 * Fetches attendance summary for the authenticated student.
 * @param {Object} params - Query parameters.
 * @param {string} params.semesterId - The ID of the semester.
 * @returns {Promise<Object>} The API response data.
 */
export const getStudentAttendanceSummary = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.ATTENDANCE.LIST, {
    params,
  });
  return response.data;
};

/**
 * Downloads attendance template for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Blob>} The Excel file blob.
 */
export const downloadAttendanceTemplate = async (courseId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.ATTENDANCE.TEMPLATE(courseId),
    {
      responseType: "blob",
    }
  );
  return response.data;
};
