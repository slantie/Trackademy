/**
 * @file src/hooks/mutations/faculty.hooks.ts
 * @description TanStack Query hooks for Faculty data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllFaculties,
    createFaculty,
    updateFaculty,
    deleteFaculty,
} from "@/services/faculty.service";
import {
    CreateFacultyRequest,
    UpdateFacultyRequest,
} from "@/interfaces/faculty.types";
import { showToast } from "@/lib/toast";

export const facultyQueryKeys = {
    all: (departmentId: string) => ["faculties", departmentId] as const,
};

export const useFaculties = (
    departmentId: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: facultyQueryKeys.all(departmentId),
        queryFn: () => getAllFaculties(departmentId),
        enabled: !!departmentId && options.enabled,
    });
};

export const useCreateFaculty = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateFacultyRequest) => createFaculty(data),
        onSuccess: (data) => {
            showToast.success("Faculty created successfully!");
            queryClient.invalidateQueries({
                queryKey: facultyQueryKeys.all(data.departmentId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to create faculty."
            );
        },
    });
};

export const useUpdateFaculty = (departmentId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateFacultyRequest;
        }) => updateFaculty({ id, data }),
        onSuccess: () => {
            showToast.success("Faculty updated successfully!");
            queryClient.invalidateQueries({
                queryKey: facultyQueryKeys.all(departmentId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to update faculty."
            );
        },
    });
};

export const useDeleteFaculty = (departmentId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteFaculty(id),
        onSuccess: () => {
            showToast.success("Faculty deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: facultyQueryKeys.all(departmentId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to delete faculty."
            );
        },
    });
};
