/**
 * @file src/interfaces/division.types.ts
 * @description Type definitions for the Division module.
 */

// Represents the structure of a Division object as returned by the API
export interface Division {
    id: string;
    name: string;
    semesterId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new division instance
export interface CreateDivisionRequest {
    name: string;
    semesterId: string;
}

// Data that can be used to update an existing division instance
export type UpdateDivisionRequest = Partial<
    Omit<CreateDivisionRequest, "semesterId">
>;

// The shape of the API response when fetching a list of divisions
export interface GetAllDivisionsResponse {
    status: string;
    results: number;
    data: {
        divisions: Division[];
    };
}

// The shape of the API response when fetching or creating a single division
export interface DivisionResponse {
    status: string;
    data: {
        division: Division;
    };
}
