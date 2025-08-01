/**
 * @file src/services/college.service.ts
 * @description API functions for the College module.
 */

import axiosInstance from "../lib/axiosInstance";
import { COLLEGE_ENDPOINTS } from "../constants/apiEndpoints";
import {
    College,
    CreateCollegeRequest,
    UpdateCollegeRequest,
    GetAllCollegesResponse,
    CollegeResponse,
} from "../interfaces/college.types";

/**
 * Fetches all colleges from the backend.
 * @returns A promise that resolves to an array of College objects.
 */
export const getAllColleges = async (): Promise<College[]> => {
    const response = await axiosInstance.get<GetAllCollegesResponse>(
        COLLEGE_ENDPOINTS.BASE
    );
    return response.data.data.colleges;
};

/**
 * Creates a new college.
 * @param data - The data for the new college.
 * @returns A promise that resolves to the newly created College object.
 */
export const createCollege = async (
    data: CreateCollegeRequest
): Promise<College> => {
    const response = await axiosInstance.post<CollegeResponse>(
        COLLEGE_ENDPOINTS.BASE,
        data
    );
    return response.data.data.college;
};

/**
 * Updates an existing college.
 * @param id - The ID of the college to update.
 * @param data - The data to update the college with.
 * @returns A promise that resolves to the updated College object.
 */
export const updateCollege = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateCollegeRequest;
}): Promise<College> => {
    const response = await axiosInstance.patch<CollegeResponse>(
        COLLEGE_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.college;
};

/**
 * Deletes a college.
 * @param id - The ID of the college to delete.
 */
export const deleteCollege = async (id: string): Promise<void> => {
    await axiosInstance.delete(COLLEGE_ENDPOINTS.BY_ID(id));
};
