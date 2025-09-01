/**
 * @file src/services/analytics.service.ts
 * @description Service layer for providing analytical insights on academic results.
 */

import { examResultService } from "./examResult.service";

/**
 * Defines the structure for optional filter parameters when querying results analytics.
 */
export interface ResultsAnalyticsQueryOptions {
  examId?: string;
  semesterId?: string;
  departmentId?: string;
  academicYearId?: string;
}

/**
 * Provides business logic for generating analytics and statistics related to exam results.
 */
class AnalyticsService {
  /**
   * Retrieves analytics and statistics for exam results based on various filter options.
   * Delegates the actual statistics retrieval to the `examResultService`.
   *
   * @param options - Optional filter parameters (examId, semesterId, departmentId, academicYearId).
   * @returns A promise that resolves to the statistics object from `examResultService`.
   */
  public async getResultsAnalytics(
    options: ResultsAnalyticsQueryOptions
  ): Promise<any> {
    return examResultService.getStatistics(options);
  }
}

export const analyticsService = new AnalyticsService();
