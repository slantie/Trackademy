/**
 * @file src/validations/examResult.validation.ts
 * @description Zod validation schemas for exam result-related API requests.
 */

import { z } from "zod";

// Schema for validating a CUID in the URL parameters
export const examResultIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid exam result ID is required."),
    }),
});

// Schema for validating query parameters for listing all results for an exam (Admin/Faculty)
export const listResultsByExamSchema = z.object({
    query: z.object({
        examId: z.string().cuid("A valid exam ID is required."),
    }),
});

// Schema for validating query parameters for a student fetching their own results
export const listResultsByStudentSchema = z.object({
    query: z.object({
        studentId: z.string().cuid("A valid student ID is required."),
    }),
});
