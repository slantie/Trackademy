/**
 * @file src/hooks/mutations/department.hooks.ts
 * @description TanStack Query hooks for Department data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "@/services/department.service";
import {
    CreateDepartmentRequest,
    UpdateDepartmentRequest,
} from "@/interfaces/department.types";
import { showToast } from "@/lib/toast";

export const departmentQueryKeys = {
    all: (collegeId: string) => ["departments", collegeId] as const,
};

export const useDepartments = (
    collegeId: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: departmentQueryKeys.all(collegeId),
        queryFn: () => getAllDepartments(collegeId),
        enabled: !!collegeId && options.enabled, // Only run if collegeId is provided
    });
};

export const useCreateDepartment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDepartmentRequest) => createDepartment(data),
        onSuccess: (data) => {
            showToast.success("Department created successfully!");
            queryClient.invalidateQueries({
                queryKey: departmentQueryKeys.all(data.collegeId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to create department."
            );
        },
    });
};

export const useUpdateDepartment = (collegeId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateDepartmentRequest;
        }) => updateDepartment({ id, data }),
        onSuccess: () => {
            showToast.success("Department updated successfully!");
            queryClient.invalidateQueries({
                queryKey: departmentQueryKeys.all(collegeId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to update department."
            );
        },
    });
};

export const useDeleteDepartment = (collegeId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteDepartment(id),
        onSuccess: () => {
            showToast.success("Department deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: departmentQueryKeys.all(collegeId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to delete department."
            );
        },
    });
};
