/**
 * @file src/interfaces/auth.types.ts
 * @description Type definitions for the authentication system and user models.
 */

// Enums should match the Prisma schema exactly
export enum Role {
    STUDENT = "STUDENT",
    FACULTY = "FACULTY",
    ADMIN = "ADMIN",
}

export enum Designation {
    HOD = "HOD",
    PROFESSOR = "PROFESSOR",
    ASST_PROFESSOR = "ASST_PROFESSOR",
    LAB_ASSISTANT = "LAB_ASSISTANT",
}

// Represents the detailed profile for a Faculty member
export interface FacultyProfile {
    id: string;
    fullName: string;
    designation: Designation;
    abbreviation?: string | null;
    joiningDate?: string | null;
    departmentId: string;
}

// Represents the detailed profile for a Student
export interface StudentProfile {
    id: string;
    enrollmentNumber: string;
    fullName: string;
    batch: string;
    departmentId: string;
    semesterId: string;
    divisionId: string;
}

// The main User object, which includes the detailed profile
export interface User {
    id: string;
    email: string;
    role: Role;
    fullName: string;
    details?: StudentProfile | FacultyProfile | null;
}

// --- API Request & Response Types ---

export interface LoginRequest {
    identifier: string; // email for Faculty/Admin, enrollmentNumber for Student
    password: string;
}

// The shape of the successful response from the /auth/login endpoint
export interface LoginResponse {
    token: string;
    data: {
        user: User;
    };
}

// The shape of the successful response from the /auth/me endpoint
export interface GetMeResponse {
    data: {
        user: User;
    };
}
