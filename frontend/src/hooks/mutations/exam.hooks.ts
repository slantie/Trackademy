/**
 * @file src/hooks/mutations/exam.hooks.ts
 * @description TanStack Query hooks for Exam data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllExams,
    createExam,
    updateExam,
    deleteExam,
} from "@/services/exam.service";
import { CreateExamRequest, UpdateExamRequest } from "@/interfaces/exam.types";
import { showToast } from "@/lib/toast";

export const examQueryKeys = {
    all: (semesterId: string) => ["exams", semesterId] as const,
};

export const useExams = (semesterId: string, options = { enabled: true }) => {
    return useQuery({
        queryKey: examQueryKeys.all(semesterId),
        queryFn: () => getAllExams(semesterId),
        enabled: !!semesterId && options.enabled,
    });
};

export const useCreateExam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateExamRequest) => createExam(data),
        onSuccess: (data) => {
            showToast.success("Exam created successfully!");
            queryClient.invalidateQueries({
                queryKey: examQueryKeys.all(data.semesterId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to create exam."
            );
        },
    });
};

export const useUpdateExam = (semesterId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateExamRequest }) =>
            updateExam({ id, data }),
        onSuccess: () => {
            showToast.success("Exam updated successfully!");
            queryClient.invalidateQueries({
                queryKey: examQueryKeys.all(semesterId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to update exam."
            );
        },
    });
};

export const useDeleteExam = (semesterId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteExam(id),
        onSuccess: () => {
            showToast.success("Exam deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: examQueryKeys.all(semesterId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to delete exam."
            );
        },
    });
};
