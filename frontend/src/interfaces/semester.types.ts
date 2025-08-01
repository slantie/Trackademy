/**
 * @file src/interfaces/semester.types.ts
 * @description Type definitions for the Semester module.
 */

import { SemesterType } from "@/constants/enums";

// Represents the structure of a Semester object as returned by the API
export interface Semester {
    id: string;
    semesterNumber: number;
    semesterType: SemesterType;
    departmentId: string;
    academicYearId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new semester instance
export interface CreateSemesterRequest {
    semesterNumber: number;
    semesterType: SemesterType;
    departmentId: string;
    academicYearId: string;
}

// The shape of the API response when fetching a list of semesters
export interface GetAllSemestersResponse {
    status: string;
    results: number;
    data: {
        semesters: Semester[];
    };
}

// The shape of the API response when fetching or creating a single semester
export interface SemesterResponse {
    status: string;
    data: {
        semester: Semester;
    };
}
