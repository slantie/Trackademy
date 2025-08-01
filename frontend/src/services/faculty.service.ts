/**
 * @file src/services/faculty.service.ts
 * @description API functions for the Faculty module.
 */

import axiosInstance from "../lib/axiosInstance";
import { FACULTY_ENDPOINTS } from "../constants/apiEndpoints";
import {
    Faculty,
    CreateFacultyRequest,
    UpdateFacultyRequest,
    GetAllFacultiesResponse,
    FacultyResponse,
} from "../interfaces/faculty.types";

export const getAllFaculties = async (
    departmentId: string
): Promise<Faculty[]> => {
    const response = await axiosInstance.get<GetAllFacultiesResponse>(
        FACULTY_ENDPOINTS.BASE,
        {
            params: { departmentId },
        }
    );
    return response.data.data.faculties;
};

export const createFaculty = async (
    data: CreateFacultyRequest
): Promise<Faculty> => {
    const response = await axiosInstance.post<FacultyResponse>(
        FACULTY_ENDPOINTS.BASE,
        data
    );
    return response.data.data.faculty;
};

export const updateFaculty = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateFacultyRequest;
}): Promise<Faculty> => {
    const response = await axiosInstance.patch<FacultyResponse>(
        FACULTY_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.faculty;
};

export const deleteFaculty = async (id: string): Promise<void> => {
    await axiosInstance.delete(FACULTY_ENDPOINTS.BY_ID(id));
};
