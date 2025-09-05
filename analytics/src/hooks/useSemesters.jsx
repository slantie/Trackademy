// src/hooks/useSemesters.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
} from "../api/semesterService";

const SEMESTERS_QUERY_KEY = "semesters";

/**
 * Custom hook to fetch a list of all semesters.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetSemesters = (params) => {
  return useQuery({
    queryKey: [SEMESTERS_QUERY_KEY, params],
    queryFn: () => getSemesters(params),
  });
};

/**
 * Custom hook to create a new semester.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateSemester = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSemester,
    onSuccess: () => {
      // Invalidate the main semesters list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [SEMESTERS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing semester.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateSemester = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSemester,
    onSuccess: (_, variables) => {
      // Invalidate both the list query and the specific item's query
      queryClient.invalidateQueries({ queryKey: [SEMESTERS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SEMESTERS_QUERY_KEY, variables.semesterId],
      });
    },
  });
};

/**
 * Custom hook to delete an existing semester.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteSemester = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSemester,
    onSuccess: () => {
      // Invalidate the main semesters list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [SEMESTERS_QUERY_KEY] });
    },
  });
};
