// src/api/examResultService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getResultsByExam = async (examId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.EXAM_RESULTS.ADMIN_BY_EXAM(examId)
  );
  return response.data;
};

export const getResultsByStudent = async (studentId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.EXAM_RESULTS.BY_STUDENT(studentId)
  );
  return response.data;
};

export const getStudentResults = async () => {
  const response = await apiClient.get(
    API_ENDPOINTS.EXAM_RESULTS.STUDENT_RESULTS
  );
  return response.data;
};
