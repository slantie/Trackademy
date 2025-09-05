// src/hooks/useSubmissions.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubmissions,
  getSubmissionsByAssignment,
  createSubmission,
  createSubmissionWithFile,
  gradeSubmission,
} from "../api/submissionService";

const SUBMISSION_QUERY_KEY = "submissions";

/**
 * Custom hook to fetch a list of submissions.
 * @param {object} params - Optional query parameters for filtering.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetSubmissions = (params) => {
  return useQuery({
    queryKey: [SUBMISSION_QUERY_KEY, params],
    queryFn: () => getSubmissions(params),
  });
};

/**
 * Custom hook to fetch submissions for a specific assignment.
 * @param {string} assignmentId - The ID of the assignment.
 * @returns {object} The query result object from TanStack Query.
 */
export const useGetSubmissionsByAssignment = (assignmentId) => {
  return useQuery({
    queryKey: [SUBMISSION_QUERY_KEY, "assignment", assignmentId],
    queryFn: () => getSubmissionsByAssignment(assignmentId),
    enabled: !!assignmentId,
  });
};

/**
 * Custom hook to create a new submission.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      // Invalidate the main submissions list query to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [SUBMISSION_QUERY_KEY] });
    },
  });
};

/**
 * Custom hook to create a new submission with file upload.
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useCreateSubmissionWithFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubmissionWithFile,
    onSuccess: () => {
      // Invalidate relevant queries to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [SUBMISSION_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
};

/**
 * Custom hook to grade a submission (update marks and feedback).
 * @returns {object} The mutation result object from TanStack Query.
 */
export const useGradeSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gradeSubmission,
    onSuccess: () => {
      // Invalidate relevant queries to trigger a re-fetch
      queryClient.invalidateQueries({ queryKey: [SUBMISSION_QUERY_KEY] });
      // Also invalidate assignment-specific submissions
      queryClient.invalidateQueries({
        queryKey: [SUBMISSION_QUERY_KEY, "assignment"],
      });
    },
  });
};
