/**
 * @file src/hooks/mutations/academicYear.hooks.ts
 * @description TanStack Query hooks for Academic Year data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllAcademicYears,
    getActiveAcademicYear,
    createAcademicYear,
    updateAcademicYear,
    deleteAcademicYear,
} from "@/services/academicYear.service";
import {
    CreateAcademicYearRequest,
    UpdateAcademicYearRequest,
} from "@/interfaces/academicYear.types";
import { showToast } from "@/lib/toast";

export const academicYearQueryKeys = {
    all: (collegeId: string) => ["academicYears", collegeId] as const,
    active: (collegeId: string) =>
        ["academicYears", "active", collegeId] as const,
};

export const useAcademicYears = (
    collegeId: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: academicYearQueryKeys.all(collegeId),
        queryFn: () => getAllAcademicYears(collegeId),
        enabled: !!collegeId && options.enabled, // Only run the query if a collegeId is provided
    });
};

export const useActiveAcademicYear = (collegeId: string) => {
    return useQuery({
        queryKey: academicYearQueryKeys.active(collegeId),
        queryFn: () => getActiveAcademicYear(collegeId),
        enabled: !!collegeId,
    });
};

export const useCreateAcademicYear = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateAcademicYearRequest) =>
            createAcademicYear(data),
        onSuccess: (data) => {
            showToast.success("Academic Year created successfully!");
            // Invalidate the list of academic years for the specific college
            queryClient.invalidateQueries({
                queryKey: academicYearQueryKeys.all(data.collegeId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message ||
                    "Failed to create academic year."
            );
        },
    });
};

export const useUpdateAcademicYear = (collegeId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateAcademicYearRequest;
        }) => updateAcademicYear({ id, data }),
        onSuccess: () => {
            showToast.success("Academic Year updated successfully!");
            queryClient.invalidateQueries({
                queryKey: academicYearQueryKeys.all(collegeId),
            });
            queryClient.invalidateQueries({
                queryKey: academicYearQueryKeys.active(collegeId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message ||
                    "Failed to update academic year."
            );
        },
    });
};

export const useDeleteAcademicYear = (collegeId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteAcademicYear(id),
        onSuccess: () => {
            showToast.success("Academic Year deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: academicYearQueryKeys.all(collegeId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message ||
                    "Failed to delete academic year."
            );
        },
    });
};
