/**
 * @file src/hooks/queries/attendance.hooks.ts
 * @description TanStack Query hooks for Attendance data.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAttendanceByCourseAndDate,
    getMyAttendanceSummary,
    updateAttendance,
} from "@/services/attendance.service";
import { UpdateAttendanceRequest } from "@/interfaces/attendance.types";
import { showToast } from "@/lib/toast";

export const attendanceQueryKeys = {
    all: ["attendance"] as const,
    byCourse: (courseId: string, date: string) =>
        [...attendanceQueryKeys.all, "course", courseId, date] as const,
    mySummary: (semesterId: string) =>
        [...attendanceQueryKeys.all, "my-summary", semesterId] as const,
};

export const useAttendanceByCourse = (
    courseId: string,
    date: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: attendanceQueryKeys.byCourse(courseId, date),
        queryFn: () => getAttendanceByCourseAndDate({ courseId, date }),
        enabled: !!courseId && !!date && options.enabled,
    });
};

export const useMyAttendanceSummary = (
    semesterId: string,
    options = { enabled: true }
) => {
    return useQuery({
        queryKey: attendanceQueryKeys.mySummary(semesterId),
        queryFn: () => getMyAttendanceSummary(semesterId),
        enabled: !!semesterId && options.enabled,
    });
};

export const useUpdateAttendance = (courseId: string, date: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateAttendanceRequest;
        }) => updateAttendance({ id, data }),
        onSuccess: () => {
            showToast.success("Attendance updated successfully!");
            queryClient.invalidateQueries({
                queryKey: attendanceQueryKeys.byCourse(courseId, date),
            });
        },
        onError: (error: any) => {
            showToast.error(
                error.response?.data?.message || "Failed to update attendance."
            );
        },
    });
};
