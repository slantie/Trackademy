// src/api/uploadService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const uploadData = async ({ uploadType, file, ...formData }) => {
  const formDataObj = new FormData();
  formDataObj.append("file", file);

  // Add form fields to FormData
  Object.keys(formData).forEach((key) => {
    if (formData[key] !== undefined && formData[key] !== null) {
      formDataObj.append(key, formData[key]);
    }
  });

  let endpoint;
  switch (uploadType) {
    case "students":
      endpoint = API_ENDPOINTS.UPLOAD.STUDENT_DATA;
      break;
    case "faculty":
      endpoint = API_ENDPOINTS.UPLOAD.FACULTY_DATA;
      break;
    case "subjects":
      endpoint = API_ENDPOINTS.UPLOAD.SUBJECT_DATA;
      break;
    case "faculty-matrix":
      endpoint = API_ENDPOINTS.UPLOAD.FACULTY_MATRIX;
      break;
    case "results":
      endpoint = API_ENDPOINTS.UPLOAD.RESULTS_DATA;
      break;
    case "attendance":
      endpoint = API_ENDPOINTS.UPLOAD.ATTENDANCE_DATA;
      break;
    default:
      throw new Error(`Unknown upload type: ${uploadType}`);
  }

  const response = await apiClient.post(endpoint, formDataObj, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 300000, // 5 minutes timeout for file uploads
  });

  return response.data;
};
