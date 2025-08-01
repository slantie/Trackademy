/**
 * @file src/interfaces/examResult.types.ts
 * @description Type definitions for the ExamResult module.
 */

import { ResultStatus } from "@/constants/enums";
import { Student } from "./student.types";
import { Subject } from "./subject.types";
import { Exam } from "./exam.types";

// Represents a single subject grade within an exam result
export interface SubjectResult {
    id: string;
    grade: string;
    credits: number;
    subject: Subject;
}

// Represents the overall result for a student in a specific exam
export interface ExamResult {
    id: string;
    studentEnrollmentNumber: string;
    spi: number;
    cpi: number;
    status: ResultStatus;
    student?: Student | null; // Student profile might be null if not registered
    exam: Exam;
    results: SubjectResult[];
}

// --- API Request & Response Types ---

// The shape of the API response when fetching a list of exam results
export interface GetAllExamResultsResponse {
    status: string;
    results: number;
    data: {
        results: ExamResult[];
    };
}

// The shape of the API response when fetching a single exam result
export interface ExamResultResponse {
    status: string;
    data: {
        result: ExamResult;
    };
}
