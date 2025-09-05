// src/api/examService.js
import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const getExams = async (params) => {
  const response = await apiClient.get(API_ENDPOINTS.EXAMS.LIST_CREATE, {
    params,
  });
  return response.data;
};
