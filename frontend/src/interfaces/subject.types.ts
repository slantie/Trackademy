/**
 * @file src/interfaces/subject.types.ts
 * @description Type definitions for the Subject module.
 */

import { SubjectType } from "@/constants/enums";

// Represents the structure of a master Subject object as returned by the API
export interface Subject {
    id: string;
    name: string;
    abbreviation: string;
    code: string;
    type: SubjectType;
    semesterNumber: number;
    departmentId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

// --- API Request & Response Types ---

// Data required to create a new master subject
export interface CreateSubjectRequest {
    name: string;
    abbreviation: string;
    code: string;
    type: SubjectType;
    semesterNumber: number;
    departmentId: string;
}

// Data that can be used to update an existing master subject
export type UpdateSubjectRequest = Partial<
    Omit<CreateSubjectRequest, "departmentId">
>;

// The shape of the API response when fetching a list of subjects
export interface GetAllSubjectsResponse {
    status: string;
    results: number;
    data: {
        subjects: Subject[];
    };
}

// The shape of the API response when fetching or creating a single subject
export interface SubjectResponse {
    status: string;
    data: {
        subject: Subject;
    };
}
