/**
 * @file src/interfaces/college.types.ts
 * @description Type definitions for the College module.
 */

// Represents the structure of a College object as returned by the API
export interface College {
    id: string;
    name: string;
    abbreviation: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new college
export interface CreateCollegeRequest {
    name: string;
    abbreviation: string;
}

// Data that can be used to update an existing college
export type UpdateCollegeRequest = Partial<CreateCollegeRequest>;

// The shape of the API response when fetching a list of colleges
export interface GetAllCollegesResponse {
    status: string;
    results: number;
    data: {
        colleges: College[];
    };
}

// The shape of the API response when fetching or creating a single college
export interface CollegeResponse {
    status: string;
    data: {
        college: College;
    };
}
