// src/hooks/useExams.jsx
import { useQuery } from "@tanstack/react-query";
import { getExams } from "../api/examService";

const EXAMS_QUERY_KEY = "exams";

export const useGetExams = (params) => {
  return useQuery({
    queryKey: [EXAMS_QUERY_KEY, params],
    queryFn: () => getExams(params),
  });
};
