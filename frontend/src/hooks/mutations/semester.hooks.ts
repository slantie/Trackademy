/**
 * @file src/hooks/mutations/semester.hooks.ts
 * @description TanStack Query hooks for Semester data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllSemesters,
    createSemester,
    deleteSemester,
} from "@/services/semester.service";
import { CreateSemesterRequest } from "@/interfaces/semester.types";
import { showToast } from "@/lib/toast";

export const semesterQueryKeys = {
    all: (departmentId: string, academicYearId: string) =>
        ["semesters", departmentId, academicYearId] as const,
};

export const useSemesters = (
    departmentId: string,
    academicYearId: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: semesterQueryKeys.all(departmentId, academicYearId),
        queryFn: () => getAllSemesters({ departmentId, academicYearId }),
        enabled: !!departmentId && !!academicYearId && options.enabled,
    });
};

export const useCreateSemester = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSemesterRequest) => createSemester(data),
        onSuccess: (data) => {
            showToast.success("Semester created successfully!");
            queryClient.invalidateQueries({
                queryKey: semesterQueryKeys.all(
                    data.departmentId,
                    data.academicYearId
                ),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to create semester."
            );
        },
    });
};

export const useDeleteSemester = (
    departmentId: string,
    academicYearId: string
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteSemester(id),
        onSuccess: () => {
            showToast.success("Semester deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: semesterQueryKeys.all(departmentId, academicYearId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to delete semester."
            );
        },
    });
};
