// src/hooks/useCourses.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../api/courseService";

const COURSES_QUERY_KEY = "courses";

/**
 * Custom hook to fetch a list of all courses.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetCourses = (params) => {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, params],
    queryFn: () => getCourses(params),
  });
};

/**
 * Custom hook to fetch courses assigned to a specific faculty member.
 * @param {string} facultyUserId - The user ID of the faculty member.
 * @returns {object} The query result object from TanStack Query.
 *
 * Expected Response Structure:
 * {
 *   status: "success",
 *   results: number,
 *   data: {
 *     courses: {
 *       data: [
 *         {
 *           id: string,
 *           subject: { id, name, code, abbreviation, type },
 *           faculty: { id, fullName, designation, department },
 *           semester: { id, semesterNumber, semesterType, department, academicYear },
 *           division: { id, name },
 *           lectureType: string,
 *           batch: string,
 *           ...
 *         }
 *       ]
 *     }
 *   }
 * }
 *
 * Access pattern: response.data.courses.data
 */
export const useGetFacultyCourses = (facultyUserId) => {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, "faculty", facultyUserId],
    queryFn: () => getCourses({ facultyUserId }),
    enabled: !!facultyUserId,
  });
};

/**
 * Custom hook to fetch courses for the authenticated student.
 * The backend automatically filters courses based on the student's enrollments.
 * @returns {object} The query result object from TanStack Query.
 *
 * Expected Response Structure:
 * {
 *   status: "success",
 *   results: number,
 *   data: {
 *     courses: {
 *       data: [
 *         {
 *           id: string,
 *           subject: { id, name, code, abbreviation, type },
 *           faculty: { id, fullName, designation, department },
 *           semester: { id, semesterNumber, semesterType, department, academicYear },
 *           division: { id, name },
 *           lectureType: string,
 *           batch: string,
 *           ...
 *         }
 *       ]
 *     }
 *   }
 * }
 *
 * Access pattern: response.data.courses.data
 */
export const useGetStudentCourses = () => {
  return useQuery({
    queryKey: [COURSES_QUERY_KEY, "student"],
    queryFn: () => getCourses(),
  });
};

/**
 * Custom hook to create a new course.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing course.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCourse,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [COURSES_QUERY_KEY, variables.courseId],
      });
    },
  });
};

/**
 * Custom hook to delete an existing course.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_QUERY_KEY] });
    },
  });
};
