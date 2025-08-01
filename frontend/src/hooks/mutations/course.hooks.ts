/**
 * @file src/hooks/mutations/course.hooks.ts
 * @description TanStack Query hooks for Course (Offering) data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllCourses,
    createCourse,
    deleteCourse,
} from "@/services/course.service";
import { CreateCourseRequest } from "@/interfaces/course.types";
import { showToast } from "@/lib/toast";

export const courseQueryKeys = {
    all: (divisionId: string) => ["courses", divisionId] as const,
};

export const useCourses = (divisionId: string, options = { enabled: true }) => {
    return useQuery({
        queryKey: courseQueryKeys.all(divisionId),
        queryFn: () => getAllCourses(divisionId),
        enabled: !!divisionId && options.enabled,
    });
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCourseRequest) => createCourse(data),
        onSuccess: (data) => {
            showToast.success("Course offering created successfully!");
            queryClient.invalidateQueries({
                queryKey: courseQueryKeys.all(data.divisionId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message ||
                    "Failed to create course offering."
            );
        },
    });
};

export const useDeleteCourse = (divisionId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCourse(id),
        onSuccess: () => {
            showToast.success("Course offering deleted successfully!");
            queryClient.invalidateQueries({
                queryKey: courseQueryKeys.all(divisionId),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message ||
                    "Failed to delete course offering."
            );
        },
    });
};
