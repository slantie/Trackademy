// src/hooks/useExamResults.jsx
import { useQuery } from "@tanstack/react-query";
import { getResultsByExam, getStudentResults } from "../api/examResultService";

const EXAM_RESULTS_QUERY_KEY = "examResults";

export const useGetExamResults = (examId) => {
  return useQuery({
    queryKey: [EXAM_RESULTS_QUERY_KEY, "exam", examId],
    queryFn: () => getResultsByExam(examId),
    enabled: !!examId,
  });
};

export const useGetStudentResults = () => {
  return useQuery({
    queryKey: [EXAM_RESULTS_QUERY_KEY, "student"],
    queryFn: () => getStudentResults(),
  });
};
