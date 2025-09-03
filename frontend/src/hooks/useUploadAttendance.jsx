// src/hooks/useAttendance.js

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAttendance,
  updateAttendance,
  uploadAttendanceFile,
} from "../api/attendanceService";

const attendanceKeys = {
  all: ["attendance"],
  list: (params) => [...attendanceKeys.all, "list", params],
  detail: (id) => [...attendanceKeys.all, "detail", id],
};

/**
 * Hook to get attendance records.
 * @param {Object} params - Query parameters for filtering.
 */
export const useGetAttendance = (params) => {
  const query = useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => getAttendance(params),
    enabled: !!params && !!params.courseId && !!params.date, // Only fetch when we have valid params
  });
  console.log("Attendance hooks response:", query);
  return query;
};

/**
 * Hook to update a single attendance record.
 */
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttendance,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.list({
          courseId: variables.attendanceData.courseId,
          date: variables.attendanceData.date,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: attendanceKeys.detail(variables.attendanceId),
      });
    },
  });
};

/**
 * Hook to upload an attendance file.
 */
export const useUploadAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAttendanceFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
};
