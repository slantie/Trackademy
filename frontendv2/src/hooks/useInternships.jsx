// src/hooks/useInternships.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  getInternshipStats,
  getStudentInternships,
} from "../api/internshipService";

const INTERNSHIP_QUERY_KEY = "internships";

/**
 * Hook to get all internships for the current student
 */
export const useGetMyInternships = () => {
  return useQuery({
    queryKey: [INTERNSHIP_QUERY_KEY, "my"],
    queryFn: getMyInternships,
  });
};

/**
 * Hook to get a specific internship by ID
 */
export const useGetInternship = (internshipId) => {
  return useQuery({
    queryKey: [INTERNSHIP_QUERY_KEY, internshipId],
    queryFn: () => getInternshipById(internshipId),
    enabled: !!internshipId,
  });
};

/**
 * Hook to create a new internship
 */
export const useCreateInternship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInternship,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INTERNSHIP_QUERY_KEY],
      });
    },
  });
};

/**
 * Hook to update an internship
 */
export const useUpdateInternship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ internshipId, internshipData }) =>
      updateInternship(internshipId, internshipData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [INTERNSHIP_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [INTERNSHIP_QUERY_KEY, variables.internshipId],
      });
    },
  });
};

/**
 * Hook to delete an internship
 */
export const useDeleteInternship = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInternship,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INTERNSHIP_QUERY_KEY],
      });
    },
  });
};

/**
 * Hook to get internship statistics (faculty/admin only)
 */
export const useGetInternshipStats = () => {
  return useQuery({
    queryKey: [INTERNSHIP_QUERY_KEY, "stats"],
    queryFn: getInternshipStats,
  });
};

/**
 * Hook to get internships for a specific student (faculty/admin only)
 */
export const useGetStudentInternships = (studentId) => {
  return useQuery({
    queryKey: [INTERNSHIP_QUERY_KEY, "student", studentId],
    queryFn: () => getStudentInternships(studentId),
    enabled: !!studentId,
  });
};
