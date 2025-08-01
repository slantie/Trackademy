/**
 * @file src/hooks/mutations/subject.hooks.ts
 * @description TanStack Query hooks for master Subject data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
} from "@/services/subject.service";
import {
    CreateSubjectRequest,
    UpdateSubjectRequest,
} from "@/interfaces/subject.types";
import { showToast } from "@/lib/toast";

export const subjectQueryKeys = {
    all: (departmentId: string, semesterNumber: number) =>
        ["subjects", departmentId, semesterNumber] as const,
};

export const useSubjects = (
    departmentId: string,
    semesterNumber: number,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: subjectQueryKeys.all(departmentId, semesterNumber),
        queryFn: () => getAllSubjects({ departmentId, semesterNumber }),
        enabled: !!departmentId && !!semesterNumber && options.enabled,
    });
};

export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSubjectRequest) => createSubject(data),
        onSuccess: (data) => {
            showToast.success("Subject created successfully!");
            queryClient.invalidateQueries({
                queryKey: subjectQueryKeys.all(
                    data.departmentId,
                    data.semesterNumber
                ),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to create subject."
            );
        },
    });
};

export const useUpdateSubject = (
    departmentId: string,
    semesterNumber: number
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateSubjectRequest;
        }) => updateSubject({ id, data }),
        onSuccess: () => {
            showToast.success("Subject updated successfully!");
            queryClient.invalidateQueries({
                queryKey: subjectQueryKeys.all(departmentId, semesterNumber),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to update subject."
            );
        },
    });
};

export const useDeleteSubject = (
    departmentId: string,
    semesterNumber: number
) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteSubject(id),
        onSuccess: () => {
            showToast.success("Subject deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: subjectQueryKeys.all(departmentId, semesterNumber),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to delete subject."
            );
        },
    });
};
