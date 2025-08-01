/**
 * @file src/services/semester.service.ts
 * @description API functions for the Semester module.
 */

import axiosInstance from "../lib/axiosInstance";
import { SEMESTER_ENDPOINTS } from "../constants/apiEndpoints";
import {
    Semester,
    CreateSemesterRequest,
    GetAllSemestersResponse,
    SemesterResponse,
} from "../interfaces/semester.types";

export const getAllSemesters = async ({
    departmentId,
    academicYearId,
}: {
    departmentId: string;
    academicYearId: string;
}): Promise<Semester[]> => {
    const response = await axiosInstance.get<GetAllSemestersResponse>(
        SEMESTER_ENDPOINTS.BASE,
        {
            params: { departmentId, academicYearId },
        }
    );
    return response.data.data.semesters;
};

export const createSemester = async (
    data: CreateSemesterRequest
): Promise<Semester> => {
    const response = await axiosInstance.post<SemesterResponse>(
        SEMESTER_ENDPOINTS.BASE,
        data
    );
    return response.data.data.semester;
};

export const deleteSemester = async (id: string): Promise<void> => {
    await axiosInstance.delete(SEMESTER_ENDPOINTS.BY_ID(id));
};
