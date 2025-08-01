/**
 * @file src/interfaces/academicYear.types.ts
 * @description Type definitions for the Academic Year module.
 */

// Represents the structure of an AcademicYear object as returned by the API
export interface AcademicYear {
    id: string;
    year: string; // e.g., "2025-2026"
    isActive: boolean;
    collegeId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new academic year
export interface CreateAcademicYearRequest {
    year: string;
    collegeId: string;
    isActive?: boolean;
}

// Data that can be used to update an existing academic year
export type UpdateAcademicYearRequest = Partial<
    Omit<CreateAcademicYearRequest, "collegeId">
>;

// The shape of the API response when fetching a list of academic years
export interface GetAllAcademicYearsResponse {
    status: string;
    results: number;
    data: {
        academicYears: AcademicYear[];
    };
}

// The shape of the API response when fetching or creating a single academic year
export interface AcademicYearResponse {
    status: string;
    data: {
        academicYear: AcademicYear;
    };
}
