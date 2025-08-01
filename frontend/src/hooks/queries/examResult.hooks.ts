/**
 * @file src/hooks/queries/examResult.hooks.ts
 * @description TanStack Query hooks for ExamResult data.
 */

import { useQuery } from "@tanstack/react-query";
import {
    getResultsByExam,
    getMyResults,
    getResultById,
} from "@/services/examResult.service";

export const examResultQueryKeys = {
    all: ["examResults"] as const,
    byExam: (examId: string) =>
        [...examResultQueryKeys.all, "exam", examId] as const,
    myResults: () => [...examResultQueryKeys.all, "my"] as const,
    detail: (id: string) => [...examResultQueryKeys.all, "detail", id] as const,
};

/**
 * Hook to fetch all results for a specific exam (for Admins/Faculty).
 */
export const useExamResultsByExam = (
    examId: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: examResultQueryKeys.byExam(examId),
        queryFn: () => getResultsByExam(examId),
        enabled: !!examId && options.enabled,
    });
};

/**
 * Hook to fetch all results for the currently logged-in student.
 */
export const useMyExamResults = () => {
    return useQuery({
        queryKey: examResultQueryKeys.myResults(),
        queryFn: getMyResults,
    });
};

/**
 * Hook to fetch a single, detailed exam result by its ID.
 */
export const useExamResultById = (id: string, options = { enabled: true }) => {
    return useQuery({
        queryKey: examResultQueryKeys.detail(id),
        queryFn: () => getResultById(id),
        enabled: !!id && options.enabled,
    });
};
