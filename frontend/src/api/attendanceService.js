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
