/**
 * @file src/hooks/mutations/division.hooks.ts
 * @description TanStack Query hooks for Division data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllDivisions,
    createDivision,
    updateDivision,
    deleteDivision,
} from "@/services/division.service";
import {
    CreateDivisionRequest,
    UpdateDivisionRequest,
} from "@/interfaces/division.types";
import { showToast } from "@/lib/toast";

export const divisionQueryKeys = {
    all: (semesterId: string) => ["divisions", semesterId] as const,
};

export const useDivisions = (
    semesterId: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: divisionQueryKeys.all(semesterId),
        queryFn: () => getAllDivisions(semesterId),
        enabled: !!semesterId && options.enabled,
    });
};

export const useCreateDivision = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDivisionRequest) => createDivision(data),
        onSuccess: (data) => {
            showToast.success("Division created successfully!");
            queryClient.invalidateQueries({
                queryKey: divisionQueryKeys.all(data.semesterId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to create division."
            );
        },
    });
};

export const useUpdateDivision = (semesterId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateDivisionRequest;
        }) => updateDivision({ id, data }),
        onSuccess: () => {
            showToast.success("Division updated successfully!");
            queryClient.invalidateQueries({
                queryKey: divisionQueryKeys.all(semesterId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to update division."
            );
        },
    });
};

export const useDeleteDivision = (semesterId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteDivision(id),
        onSuccess: () => {
            showToast.success("Division deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: divisionQueryKeys.all(semesterId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to delete division."
            );
        },
    });
};
