/**
 * @file src/services/examResult.service.ts
 * @description API functions for the ExamResult module.
 */

import axiosInstance from "../lib/axiosInstance";
import { EXAM_RESULT_ENDPOINTS } from "../constants/apiEndpoints";
import {
    ExamResult,
    GetAllExamResultsResponse,
    ExamResultResponse,
} from "../interfaces/examResult.types";

/**
 * Fetches all exam results for a specific exam (for Admins/Faculty).
 * @param examId - The ID of the exam.
 * @returns A promise that resolves to an array of ExamResult objects.
 */
export const getResultsByExam = async (
    examId: string
): Promise<ExamResult[]> => {
    const response = await axiosInstance.get<GetAllExamResultsResponse>(
        EXAM_RESULT_ENDPOINTS.BASE,
        {
            params: { examId },
        }
    );
    return response.data.data.results;
};

/**
 * Fetches all exam results for the currently logged-in student.
 * @returns A promise that resolves to an array of the student's ExamResult objects.
 */
export const getMyResults = async (): Promise<ExamResult[]> => {
    const response = await axiosInstance.get<GetAllExamResultsResponse>(
        EXAM_RESULT_ENDPOINTS.BASE
    );
    return response.data.data.results;
};

/**
 * Fetches a single, detailed exam result by its ID.
 * @param id - The ID of the ExamResult.
 * @returns A promise that resolves to a single ExamResult object.
 */
export const getResultById = async (id: string): Promise<ExamResult> => {
    const response = await axiosInstance.get<ExamResultResponse>(
        EXAM_RESULT_ENDPOINTS.BY_ID(id)
    );
    return response.data.data.result;
};
