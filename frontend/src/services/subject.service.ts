/**
 * @file src/services/subject.service.ts
 * @description API functions for the master Subject module.
 */

import axiosInstance from "../lib/axiosInstance";
import { SUBJECT_ENDPOINTS } from "../constants/apiEndpoints";
import {
    Subject,
    CreateSubjectRequest,
    UpdateSubjectRequest,
    GetAllSubjectsResponse,
    SubjectResponse,
} from "../interfaces/subject.types";

export const getAllSubjects = async ({
    departmentId,
    semesterNumber,
}: {
    departmentId: string;
    semesterNumber: number;
}): Promise<Subject[]> => {
    const response = await axiosInstance.get<GetAllSubjectsResponse>(
        SUBJECT_ENDPOINTS.BASE,
        {
            params: { departmentId, semesterNumber },
        }
    );
    return response.data.data.subjects;
};

export const createSubject = async (
    data: CreateSubjectRequest
): Promise<Subject> => {
    const response = await axiosInstance.post<SubjectResponse>(
        SUBJECT_ENDPOINTS.BASE,
        data
    );
    return response.data.data.subject;
};

export const updateSubject = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateSubjectRequest;
}): Promise<Subject> => {
    const response = await axiosInstance.patch<SubjectResponse>(
        SUBJECT_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.subject;
};

export const deleteSubject = async (id: string): Promise<void> => {
    await axiosInstance.delete(SUBJECT_ENDPOINTS.BY_ID(id));
};
