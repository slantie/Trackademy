// src/hooks/useAssignments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../api/assignmentService";

const ASSIGNMENT_QUERY_KEY = "assignments";

/**
 * Custom hook to fetch a list of assignments.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetAssignments = (params) => {
  return useQuery({
    queryKey: [ASSIGNMENT_QUERY_KEY, params],
    queryFn: () => getAssignments(params),
  });
};

/**
 * Custom hook to fetch assignments created by a specific faculty member.
 * @param {string} facultyUserId - The user ID of the faculty member.
 * @returns {object} The query result object from TanStack Query.
 *
 * Expected Response Structure:
 * {
 *   status: "success",
 *   results: number,
 *   data: {
 *     assignments: {
 *       data: [
 *         {
 *           id: string,
 *           title: string,
 *           description: string,
 *           dueDate: string,
 *           totalMarks: number,
 *           course: {
 *             id, subject, faculty, division, semester
 *           },
 *           _count: {
 *             submissions: number
 *           },
 *           ...
 *         }
 *       ]
 *     }
 *   }
 * }
 *
 * Access pattern: response.data.assignments.data
 */
export const useGetFacultyAssignments = (facultyUserId) => {
  return useQuery({
    queryKey: [ASSIGNMENT_QUERY_KEY, "faculty", facultyUserId],
    queryFn: () => getAssignments({ facultyUserId }),
    enabled: !!facultyUserId,
  });
};

/**
 * Custom hook to fetch assignments for the authenticated student.
 * The backend automatically filters assignments based on the student's enrolled courses.
 * @returns {object} The query result object from TanStack Query.
 *
 * Expected Response Structure:
 * {
 *   status: "success",
 *   results: number,
 *   data: {
 *     assignments: {
 *       data: [
 *         {
 *           id: string,
 *           title: string,
 *           description: string,
 *           dueDate: string,
 *           totalMarks: number,
 *           course: {
 *             id, subject, faculty, division, semester
 *           },
 *           submission: {
 *             id, status, submittedAt, grade, feedback
 *           },
 *           ...
 *         }
 *       ]
 *     }
 *   }
 * }
 *
 * Access pattern: response.data.assignments.data
 */
export const useGetStudentAssignments = () => {
  return useQuery({
    queryKey: [ASSIGNMENT_QUERY_KEY, "student"],
    queryFn: () => getAssignments(),
  });
};

/**
 * Custom hook to fetch a single assignment by ID.
 * @param {string} assignmentId - The ID of the assignment.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetAssignment = (assignmentId) => {
  return useQuery({
    queryKey: [ASSIGNMENT_QUERY_KEY, assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
    enabled: !!assignmentId,
  });
};

/**
 * Custom hook to create a new assignment.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      // Invalidate the main assignments list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [ASSIGNMENT_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing assignment.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAssignment,
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific assignment's detail query
      queryClient.invalidateQueries({ queryKey: [ASSIGNMENT_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ASSIGNMENT_QUERY_KEY, variables.id],
      });
    },
  });
};

/**
 * Custom hook to delete an assignment.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      // Invalidate the main assignments list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [ASSIGNMENT_QUERY_KEY] });
    },
  });
};
