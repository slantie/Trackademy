// src/hooks/useDepartments.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../api/departmentService";

const DEPARTMENTS_QUERY_KEY = "departments";

/**
 * Custom hook to fetch a list of departments.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetDepartments = (params) => {
  return useQuery({
    queryKey: [DEPARTMENTS_QUERY_KEY, params],
    queryFn: () => getDepartments(params),
  });
};

/**
 * Custom hook to create a new department.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      // Invalidate the main departments list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to update an existing department.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: (_, variables) => {
      // Invalidate both the list query and the specific item's query
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [DEPARTMENTS_QUERY_KEY, variables.departmentId],
      });
    },
  });
};

/**
 * Custom hook to delete an existing department.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      // Invalidate the main departments list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [DEPARTMENTS_QUERY_KEY] });
    },
  });
};
