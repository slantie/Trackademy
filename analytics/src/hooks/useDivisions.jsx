// src/hooks/useDivisions.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDivisions,
  createDivision,
  updateDivision,
  deleteDivision,
} from "../api/divisionService";

const DIVISIONS_QUERY_KEY = "divisions";

/**
 * Custom hook to fetch a list of all divisions.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetDivisions = (params) => {
  return useQuery({
    queryKey: [DIVISIONS_QUERY_KEY, params],
    queryFn: () => getDivisions(params),
  });
};

/**
 * Custom hook to create a new division.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateDivision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDivision,
    onSuccess: () => {
      // Invalidate the main divisions list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [DIVISIONS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing division.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateDivision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDivision,
    onSuccess: (_, variables) => {
      // Invalidate both the list query and the specific item's query
      queryClient.invalidateQueries({ queryKey: [DIVISIONS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [DIVISIONS_QUERY_KEY, variables.divisionId],
      });
    },
  });
};

/**
 * Custom hook to delete an existing division.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteDivision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDivision,
    onSuccess: () => {
      // Invalidate the main divisions list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [DIVISIONS_QUERY_KEY] });
    },
  });
};
