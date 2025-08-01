/**
 * @file src/hooks/mutations/student.hooks.ts
 * @description TanStack Query hooks for Student data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from "@/services/student.service";
import {
    CreateStudentRequest,
    UpdateStudentRequest,
} from "@/interfaces/student.types";
import { showToast } from "@/lib/toast";

export const studentQueryKeys = {
    all: (divisionId: string) => ["students", divisionId] as const,
};

export const useStudents = (
    divisionId: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: studentQueryKeys.all(divisionId),
        queryFn: () => getAllStudents(divisionId),
        enabled: !!divisionId && options.enabled,
    });
};

export const useCreateStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateStudentRequest) => createStudent(data),
        onSuccess: (data) => {
            showToast.success("Student created successfully!");
            queryClient.invalidateQueries({
                queryKey: studentQueryKeys.all(data.divisionId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to create student."
            );
        },
    });
};

export const useUpdateStudent = (divisionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateStudentRequest;
        }) => updateStudent({ id, data }),
        onSuccess: () => {
            showToast.success("Student updated successfully!");
            queryClient.invalidateQueries({
                queryKey: studentQueryKeys.all(divisionId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to update student."
            );
        },
    });
};

export const useDeleteStudent = (divisionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteStudent(id),
        onSuccess: () => {
            showToast.success("Student deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: studentQueryKeys.all(divisionId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to delete student."
            );
        },
    });
};
