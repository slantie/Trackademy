/**
 * @file src/services/division.service.ts
 * @description API functions for the Division module.
 */

import axiosInstance from "../lib/axiosInstance";
import { DIVISION_ENDPOINTS } from "../constants/apiEndpoints";
import {
    Division,
    CreateDivisionRequest,
    UpdateDivisionRequest,
    GetAllDivisionsResponse,
    DivisionResponse,
} from "../interfaces/division.types";

export const getAllDivisions = async (
    semesterId: string
): Promise<Division[]> => {
    const response = await axiosInstance.get<GetAllDivisionsResponse>(
        DIVISION_ENDPOINTS.BASE,
        {
            params: { semesterId },
        }
    );
    return response.data.data.divisions;
};

export const createDivision = async (
    data: CreateDivisionRequest
): Promise<Division> => {
    const response = await axiosInstance.post<DivisionResponse>(
        DIVISION_ENDPOINTS.BASE,
        data
    );
    return response.data.data.division;
};

export const updateDivision = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateDivisionRequest;
}): Promise<Division> => {
    const response = await axiosInstance.patch<DivisionResponse>(
        DIVISION_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.division;
};

export const deleteDivision = async (id: string): Promise<void> => {
    await axiosInstance.delete(DIVISION_ENDPOINTS.BY_ID(id));
};
