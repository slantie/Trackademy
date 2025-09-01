/**
 * @file src/validations/submission.validation.ts
 * @description Zod validation schemas for submission-related API requests.
 */

import { z } from "zod";
import { SubmissionStatus } from "@prisma/client";

// Schema for creating a new submission
export const createSubmissionSchema = z.object({
  body: z
    .object({
      content: z
        .string()
        .max(5000, "Content must not exceed 5000 characters.")
        .optional(),
      filePath: z
        .string()
        .max(500, "File path must not exceed 500 characters.")
        .optional(),
      assignmentId: z.string().cuid("A valid assignment ID is required."),
    })
    .refine((data) => data.content || data.filePath, {
      message: "Either content or filePath must be provided.",
      path: ["content"], // This will highlight the content field in error
    }),
});

// Schema for updating a submission
export const updateSubmissionSchema = z.object({
  body: z
    .object({
      content: z
        .string()
        .max(5000, "Content must not exceed 5000 characters.")
        .optional(),
      filePath: z
        .string()
        .max(500, "File path must not exceed 500 characters.")
        .optional(),
    })
    .refine((data) => data.content || data.filePath, {
      message: "Either content or filePath must be provided.",
      path: ["content"], // This will highlight the content field in error
    }),
});

// Schema for grading a submission
export const gradeSubmissionSchema = z.object({
  body: z.object({
    marksAwarded: z
      .number()
      .int("Marks must be an integer.")
      .min(0, "Marks cannot be negative."),
    feedback: z
      .string()
      .max(1000, "Feedback must not exceed 1000 characters.")
      .optional(),
  }),
});

// Schema for validating submission ID in URL parameters
export const submissionIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid("A valid submission ID is required."),
  }),
});

// Schema for validating query parameters for filtering submissions
export const submissionQuerySchema = z.object({
  query: z.object({
    assignmentId: z
      .string()
      .cuid("A valid assignment ID is required.")
      .optional(),
    studentId: z.string().cuid("A valid student ID is required.").optional(),
    status: z.nativeEnum(SubmissionStatus).optional(),
    includeDeleted: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    sortBy: z.enum(["submittedAt", "marksAwarded", "gradedAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// Schema for getting submissions for an assignment (faculty view)
export const assignmentSubmissionsQuerySchema = z.object({
  params: z.object({
    assignmentId: z.string().cuid("A valid assignment ID is required."),
  }),
  query: z.object({
    status: z.nativeEnum(SubmissionStatus).optional(),
    includeDeleted: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    sortBy: z.enum(["submittedAt", "marksAwarded", "gradedAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// Schema for submission statistics query
export const submissionStatisticsQuerySchema = z.object({
  params: z.object({
    assignmentId: z.string().cuid("A valid assignment ID is required."),
  }),
});
