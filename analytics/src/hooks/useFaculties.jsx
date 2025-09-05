// src/hooks/useFaculties.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFaculties,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  resetFacultyPassword,
} from "../api/facultyService";

const FACULTIES_QUERY_KEY = "faculties";

/**
 * Custom hook to fetch a list of all faculties.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetFaculties = (params) => {
  return useQuery({
    queryKey: [FACULTIES_QUERY_KEY, params],
    queryFn: () => getFaculties(params),
  });
};

/**
 * Custom hook to create a new faculty member.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      // Invalidate the main faculties list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [FACULTIES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing faculty member.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFaculty,
    onSuccess: (_, variables) => {
      // Invalidate both the list query and the specific item's query
      queryClient.invalidateQueries({ queryKey: [FACULTIES_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [FACULTIES_QUERY_KEY, variables.facultyId],
      });
    },
  });
};

/**
 * Custom hook to delete an existing faculty member.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      // Invalidate the main faculties list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [FACULTIES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to reset a faculty member's password (admin only).
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useResetFacultyPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetFacultyPassword,
    onSuccess: () => {
      // Optionally invalidate faculty queries if needed
      queryClient.invalidateQueries({ queryKey: [FACULTIES_QUERY_KEY] });
    },
  });
};
