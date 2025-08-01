/**
 * @file src/interfaces/faculty.types.ts
 * @description Type definitions for the Faculty module.
 */

import { Designation } from "@/constants/enums";

// Represents the structure of a Faculty object as returned by the API
export interface Faculty {
    id: string;
    fullName: string;
    designation: Designation;
    abbreviation?: string | null;
    joiningDate?: string | null;
    userId: string;
    departmentId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new faculty member and their user account
export interface CreateFacultyRequest {
    email: string;
    password: string;
    fullName: string;
    designation: Designation;
    abbreviation?: string;
    joiningDate?: string | null;
    departmentId: string;
}

// Data that can be used to update an existing faculty member's profile
export type UpdateFacultyRequest = Partial<
    Omit<CreateFacultyRequest, "email" | "password" | "departmentId">
>;

// The shape of the API response when fetching a list of faculty members
export interface GetAllFacultiesResponse {
    status: string;
    results: number;
    data: {
        faculties: Faculty[];
    };
}

// The shape of the API response when fetching or creating a single faculty member
export interface FacultyResponse {
    status: string;
    data: {
        faculty: Faculty;
    };
}
