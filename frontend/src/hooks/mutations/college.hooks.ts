/**
 * @file src/hooks/mutations/college.hooks.ts
 * @description TanStack Query hooks for College data fetching and mutations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllColleges,
    createCollege,
    updateCollege,
    deleteCollege,
} from "@/services/college.service";
import {
    CreateCollegeRequest,
    UpdateCollegeRequest,
} from "@/interfaces/college.types";
import { showToast } from "@/lib/toast";

// A unique key to identify this query in the cache
export const collegeQueryKeys = {
    all: ["colleges"] as const,
};

/**
 * Hook to fetch all colleges.
 * Caches the data and provides loading/error states.
 */
export const useColleges = () => {
    return useQuery({
        queryKey: collegeQueryKeys.all,
        queryFn: getAllColleges,
    });
};

/**
 * Hook to create a new college.
 * Handles the mutation and invalidates the cache on success.
 */
export const useCreateCollege = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCollegeRequest) => createCollege(data),
        onSuccess: () => {
            showToast.success("College created successfully!");
            // When this mutation succeeds, invalidate the 'colleges' query to refetch the list
            queryClient.invalidateQueries({ queryKey: collegeQueryKeys.all });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to create college."
            );
        },
    });
};

/**
 * Hook to update an existing college.
 */
export const useUpdateCollege = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateCollegeRequest;
        }) => updateCollege({ id, data }),
        onSuccess: () => {
            showToast.success("College updated successfully!");
            queryClient.invalidateQueries({ queryKey: collegeQueryKeys.all });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to update college."
            );
        },
    });
};

/**
 * Hook to delete a college.
 */
export const useDeleteCollege = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCollege(id),
        onSuccess: () => {
            showToast.success("College deleted successfully!");
            queryClient.invalidateQueries({ queryKey: collegeQueryKeys.all });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to delete college."
            );
        },
    });
};
