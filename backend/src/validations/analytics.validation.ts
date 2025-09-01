/**
 * @file src/validations/analytics.validation.ts
 * @description Zod validation schemas for analytics-related API requests.
 */

import { z } from "zod";

// Schema for validating query parameters for the results analytics endpoint
export const getResultsAnalyticsSchema = z.object({
  query: z.object({
    examId: z.string().cuid("A valid exam ID is required").optional(),
    semesterId: z.string().cuid("A valid semester ID is required").optional(),
    departmentId: z
      .string()
      .cuid("A valid department ID is required")
      .optional(),
    academicYearId: z
      .string()
      .cuid("A valid academic year ID is required")
      .optional(),
  }),
});
