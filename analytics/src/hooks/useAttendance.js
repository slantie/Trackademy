// src/hooks/useAttendance.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAttendance,
  getFacultyCourses,
  getCourseStudents,
  createBulkAttendance,
  updateAttendance,
  uploadAttendanceFile,
  getStudentAttendanceSummary,
  downloadAttendanceTemplate,
} from "../api/attendanceService";

const ATTENDANCE_QUERY_KEY = "attendance";

/**
 * Custom hook to fetch courses assigned to the authenticated faculty.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetFacultyCourses = () => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEY, "faculty-courses"],
    queryFn: getFacultyCourses,
  });
};

/**
 * Custom hook to fetch students enrolled in a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetCourseStudents = (courseId) => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEY, "course-students", courseId],
    queryFn: () => getCourseStudents(courseId),
    enabled: !!courseId,
  });
};

/**
 * Custom hook to fetch attendance records for a course and date.
 * @param {object} params - Query parameters.
 * @param {string} params.courseId - The ID of the course.
 * @param {string} params.date - The date of the attendance record (YYYY-MM-DD format).
 * @param {boolean} enabled - Whether the query should be enabled.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetAttendance = (params, enabled = true) => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEY, params],
    queryFn: () => getAttendance(params),
    enabled: enabled && !!params?.courseId && !!params?.date,
  });
};

/**
 * Custom hook to fetch attendance summary for the authenticated student.
 * @param {string} semesterId - The ID of the semester.
 * @returns {object} The query result object from TanStack Query.
 *
 * Expected Response Structure:
 * {
 *   status: "success",
 *   data: {
 *     summary: [
 *       {
 *         course: {
 *           id: string,
 *           subject: { id, name, code },
 *           faculty: { id, fullName },
 *           division: { id, name }
 *         },
 *         totalClasses: number,
 *         attendedClasses: number,
 *         attendancePercentage: number,
 *         ...
 *       }
 *     ]
 *   }
 * }
 *
 * Access pattern: response.data.summary
 */
export const useGetStudentAttendanceSummary = (semesterId) => {
  return useQuery({
    queryKey: [ATTENDANCE_QUERY_KEY, "summary", semesterId || "all"],
    queryFn: () => {
      const params = {};
      if (semesterId) {
        params.semesterId = semesterId;
      }
      return getStudentAttendanceSummary(params);
    },
    enabled: true, // Always enabled, no longer dependent on semesterId
  });
};

/**
 * Custom hook to create bulk attendance records.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateBulkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBulkAttendance,
    onSuccess: () => {
      // Invalidate attendance queries to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an attendance record.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttendance,
    onSuccess: () => {
      // Invalidate attendance queries to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to upload an attendance file.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUploadAttendanceFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAttendanceFile,
    onSuccess: () => {
      // Invalidate attendance queries to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [ATTENDANCE_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to download an attendance template.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDownloadAttendanceTemplate = () => {
  return useMutation({
    mutationFn: downloadAttendanceTemplate,
    retry: false,
  });
};
