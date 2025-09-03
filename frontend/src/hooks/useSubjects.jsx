// src/hooks/useSubjects.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../api/subjectService";

const SUBJECTS_QUERY_KEY = "subjects";

/**
 * Custom hook to fetch a list of all subjects.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetSubjects = (params) => {
  return useQuery({
    queryKey: [SUBJECTS_QUERY_KEY, params],
    queryFn: () => getSubjects(params),
  });
};

/**
 * Custom hook to create a new subject.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      // Invalidate the main subjects list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing subject.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSubject,
    onSuccess: (_, variables) => {
      // Invalidate both the list query and the specific item's query
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [SUBJECTS_QUERY_KEY, variables.subjectId],
      });
    },
  });
};

/**
 * Custom hook to delete an existing subject.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      // Invalidate the main subjects list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
    },
  });
};
