// src/hooks/useAcademicYears.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAcademicYears,
  createAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
  activateAcademicYear,
} from "../api/academicYearService";

const ACADEMIC_YEARS_QUERY_KEY = "academicYears";

/**
 * Custom hook to fetch a list of academic years.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetAcademicYears = (params) => {
  return useQuery({
    queryKey: [ACADEMIC_YEARS_QUERY_KEY, params],
    queryFn: () => getAcademicYears(params),
  });
};

/**
 * Custom hook to create a new academic year.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAcademicYear,
    onSuccess: () => {
      // Invalidate the main academic years list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [ACADEMIC_YEARS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing academic year.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAcademicYear,
    onSuccess: (_, variables) => {
      // Invalidate the list query and the specific item's query
      queryClient.invalidateQueries({ queryKey: [ACADEMIC_YEARS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ACADEMIC_YEARS_QUERY_KEY, variables.yearId],
      });
    },
  });
};

/**
 * Custom hook to delete an existing academic year.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAcademicYear,
    onSuccess: () => {
      // Invalidate the main academic years list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [ACADEMIC_YEARS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to activate an academic year.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useActivateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateAcademicYear,
    onSuccess: () => {
      // Invalidate the main academic years list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [ACADEMIC_YEARS_QUERY_KEY] });
    },
  });
};
