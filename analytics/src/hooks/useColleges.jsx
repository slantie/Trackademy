// src/hooks/useColleges.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getColleges,
  createCollege,
  updateCollege,
  deleteCollege,
} from "../api/collegeService";

const COLLEGES_QUERY_KEY = "colleges";

/**
 * Custom hook to fetch a list of all colleges.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetColleges = () => {
  return useQuery({
    queryKey: [COLLEGES_QUERY_KEY],
    queryFn: getColleges,
  });
};

/**
 * Custom hook to create a new college.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateCollege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollege,
    onSuccess: () => {
      // Invalidate the main colleges list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [COLLEGES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing college.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateCollege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCollege,
    onSuccess: () => {
      // Invalidate the main colleges list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [COLLEGES_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to delete an existing college.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteCollege = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollege,
    onSuccess: () => {
      // Invalidate the main colleges list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [COLLEGES_QUERY_KEY] });
    },
  });
};
