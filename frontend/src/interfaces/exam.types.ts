/**
 * @file src/interfaces/exam.types.ts
 * @description Type definitions for the Exam module.
 */

import { ExamType } from "@/constants/enums";

// Represents the structure of an Exam object as returned by the API
export interface Exam {
    id: string;
    name: string;
    examType: ExamType;
    semesterId: string;
    isPublished: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new exam
export interface CreateExamRequest {
    name: string;
    examType: ExamType;
    semesterId: string;
}

// Data that can be used to update an existing exam
export type UpdateExamRequest = Partial<
    Omit<CreateExamRequest, "semesterId" | "examType">
> & { isPublished?: boolean };

// The shape of the API response when fetching a list of exams
export interface GetAllExamsResponse {
    status: string;
    results: number;
    data: {
        exams: Exam[];
    };
}

// The shape of the API response when fetching or creating a single exam
export interface ExamResponse {
    status: string;
    data: {
        exam: Exam;
    };
}
