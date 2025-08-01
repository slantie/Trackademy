/**
 * @file src/services/department.service.ts
 * @description API functions for the Department module.
 */

import axiosInstance from "../lib/axiosInstance";
import { DEPARTMENT_ENDPOINTS } from "../constants/apiEndpoints";
import {
    Department,
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
    GetAllDepartmentsResponse,
    DepartmentResponse,
} from "../interfaces/department.types";

export const getAllDepartments = async (
    collegeId: string
): Promise<Department[]> => {
    const response = await axiosInstance.get<GetAllDepartmentsResponse>(
        DEPARTMENT_ENDPOINTS.BASE,
        {
            params: { collegeId },
        }
    );
    return response.data.data.departments;
};

export const createDepartment = async (
    data: CreateDepartmentRequest
): Promise<Department> => {
    const response = await axiosInstance.post<DepartmentResponse>(
        DEPARTMENT_ENDPOINTS.BASE,
        data
    );
    return response.data.data.department;
};

export const updateDepartment = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateDepartmentRequest;
}): Promise<Department> => {
    const response = await axiosInstance.patch<DepartmentResponse>(
        DEPARTMENT_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.department;
};

export const deleteDepartment = async (id: string): Promise<void> => {
    await axiosInstance.delete(DEPARTMENT_ENDPOINTS.BY_ID(id));
};
