/**
 * @file src/interfaces/upload.types.ts
 * @description Type definitions for the Upload module.
 */

import {
    ExamType,
    SemesterType,
    AttendanceStatus,
    LectureType,
} from "@/constants/enums";

// Represents the structure of the success response from any upload endpoint
export interface UploadResponse {
    message: string;
    createdCount: number;
    skippedCount: number;
}

// The shape of the full API response for an upload
export interface UploadApiResponse {
    status: string;
    data: UploadResponse;
}

// Data required to be sent with the Faculty Matrix file
export interface FacultyMatrixUploadRequest {
    academicYear: string;
    semesterType: SemesterType;
    departmentId: string;
}

// Data required to be sent with the Results file
export interface ResultsUploadRequest {
    examName: string;
    examType: ExamType;
    academicYearId: string;
    departmentId: string;
    semesterNumber: number;
}

// Data required to be sent with the Attendance file
export interface AttendanceUploadRequest {
    academicYearId: string;
    departmentId: string;
    semesterNumber: number;
    divisionId: string;
    subjectId: string;
    lectureType: LectureType;
    batch?: string | null;
    date: string;
}
