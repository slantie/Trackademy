import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary, getResultsAnalytics } from "../api/dashboard";

/**
 * Custom hook to fetch all necessary data for the dashboard page.
 * @returns {Object} An object containing data, loading, and error states for each query.
 */
export const useDashboardData = () => {
  const {
    data: summaryData,
    isLoading: summaryIsLoading,
    error: summaryError,
  } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: getDashboardSummary,
  });

  const {
    data: analyticsData,
    isLoading: analyticsIsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["resultsAnalytics"],
    queryFn: getResultsAnalytics,
  });

  return {
    summaryData,
    summaryIsLoading,
    summaryError,
    analyticsData,
    analyticsIsLoading,
    analyticsError,
  };
};
