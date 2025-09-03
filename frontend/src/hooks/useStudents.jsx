// src/hooks/useStudents.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/studentService";

const STUDENTS_QUERY_KEY = "students";

/**
 * Custom hook to fetch a list of all students.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetStudents = (params) => {
  return useQuery({
    queryKey: [STUDENTS_QUERY_KEY, params],
    queryFn: () => getStudents(params),
  });
};

/**
 * Custom hook to fetch a single student by their ID.
 * @param {string} studentId - The ID of the student to fetch.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetStudent = (studentId) => {
  return useQuery({
    queryKey: [STUDENTS_QUERY_KEY, studentId],
    queryFn: () => getStudentById(studentId),
    enabled: !!studentId,
  });
};

/**
 * Custom hook to create a new student.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing student.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudent,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [STUDENTS_QUERY_KEY, variables.studentId],
      });
    },
  });
};

/**
 * Custom hook to delete an existing student.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STUDENTS_QUERY_KEY] });
    },
  });
};
