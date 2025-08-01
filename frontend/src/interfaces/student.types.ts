/**
 * @file src/interfaces/student.types.ts
 * @description Type definitions for the Student module.
 */

// Represents the structure of a Student object as returned by the API
export interface Student {
    id: string;
    enrollmentNumber: string;
    fullName: string;
    batch: string;
    userId: string;
    departmentId: string;
    semesterId: string;
    divisionId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new student and their user account
export interface CreateStudentRequest {
    email: string;
    password: string;
    fullName: string;
    enrollmentNumber: string;
    batch: string;
    departmentId: string;
    semesterId: string;
    divisionId: string;
}

// Data that can be used to update an existing student's profile
export type UpdateStudentRequest = {
    fullName?: string;
    batch?: string;
    semesterId?: string;
    divisionId?: string;
};

// The shape of the API response when fetching a list of students
export interface GetAllStudentsResponse {
    status: string;
    results: number;
    data: {
        students: Student[];
    };
}

// The shape of the API response when fetching or creating a single student
export interface StudentResponse {
    status: string;
    data: {
        student: Student;
    };
}
