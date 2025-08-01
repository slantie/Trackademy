/**
 * @file src/services/exam.service.ts
 * @description API functions for the Exam module.
 */

import axiosInstance from "../lib/axiosInstance";
import { EXAM_ENDPOINTS } from "../constants/apiEndpoints";
import {
    Exam,
    CreateExamRequest,
    UpdateExamRequest,
    GetAllExamsResponse,
    ExamResponse,
} from "../interfaces/exam.types";

export const getAllExams = async (semesterId: string): Promise<Exam[]> => {
    const response = await axiosInstance.get<GetAllExamsResponse>(
        EXAM_ENDPOINTS.BASE,
        {
            params: { semesterId },
        }
    );
    return response.data.data.exams;
};

export const createExam = async (data: CreateExamRequest): Promise<Exam> => {
    const response = await axiosInstance.post<ExamResponse>(
        EXAM_ENDPOINTS.BASE,
        data
    );
    return response.data.data.exam;
};

export const updateExam = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateExamRequest;
}): Promise<Exam> => {
    const response = await axiosInstance.patch<ExamResponse>(
        EXAM_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.exam;
};

export const deleteExam = async (id: string): Promise<void> => {
    await axiosInstance.delete(EXAM_ENDPOINTS.BY_ID(id));
};
