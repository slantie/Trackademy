/**
 * @file src/interfaces/department.types.ts
 * @description Type definitions for the Department module.
 */

// Represents the structure of a Department object as returned by the API
export interface Department {
    id: string;
    name: string;
    abbreviation: string;
    collegeId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new department
export interface CreateDepartmentRequest {
    name: string;
    abbreviation: string;
    collegeId: string;
}

// Data that can be used to update an existing department
export type UpdateDepartmentRequest = Partial<
    Omit<CreateDepartmentRequest, "collegeId">
>;

// The shape of the API response when fetching a list of departments
export interface GetAllDepartmentsResponse {
    status: string;
    results: number;
    data: {
        departments: Department[];
    };
}

// The shape of the API response when fetching or creating a single department
export interface DepartmentResponse {
    status: string;
    data: {
        department: Department;
    };
}
