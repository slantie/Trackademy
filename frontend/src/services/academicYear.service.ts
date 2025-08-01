/**
 * @file src/services/academicYear.service.ts
 * @description API functions for the Academic Year module.
 */

import axiosInstance from "../lib/axiosInstance";
import { ACADEMIC_YEAR_ENDPOINTS } from "../constants/apiEndpoints";
import {
    AcademicYear,
    CreateAcademicYearRequest,
    UpdateAcademicYearRequest,
    GetAllAcademicYearsResponse,
    AcademicYearResponse,
} from "../interfaces/academicYear.types";

export const getAllAcademicYears = async (
    collegeId: string
): Promise<AcademicYear[]> => {
    const response = await axiosInstance.get<GetAllAcademicYearsResponse>(
        ACADEMIC_YEAR_ENDPOINTS.BASE,
        {
            params: { collegeId },
        }
    );
    return response.data.data.academicYears;
};

export const getActiveAcademicYear = async (
    collegeId: string
): Promise<AcademicYear> => {
    const response = await axiosInstance.get<AcademicYearResponse>(
        ACADEMIC_YEAR_ENDPOINTS.ACTIVE,
        {
            params: { collegeId },
        }
    );
    return response.data.data.academicYear;
};

export const createAcademicYear = async (
    data: CreateAcademicYearRequest
): Promise<AcademicYear> => {
    const response = await axiosInstance.post<AcademicYearResponse>(
        ACADEMIC_YEAR_ENDPOINTS.BASE,
        data
    );
    return response.data.data.academicYear;
};

export const updateAcademicYear = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateAcademicYearRequest;
}): Promise<AcademicYear> => {
    const response = await axiosInstance.patch<AcademicYearResponse>(
        ACADEMIC_YEAR_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.academicYear;
};

export const deleteAcademicYear = async (id: string): Promise<void> => {
    await axiosInstance.delete(ACADEMIC_YEAR_ENDPOINTS.BY_ID(id));
};
