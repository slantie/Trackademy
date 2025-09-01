/**
 * @file src/validations/assignment.validation.ts
 * @description Zod validation schemas for assignment-related API requests.
 */

import { z } from "zod";

// Schema for creating a new assignment
export const createAssignmentSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Assignment title is required.")
      .max(200, "Assignment title must not exceed 200 characters."),
    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters.")
      .optional(),
    dueDate: z
      .string()
      .datetime("Due date must be a valid ISO datetime string.")
      .refine((date) => new Date(date) > new Date(), {
        message: "Due date must be in the future.",
      }),
    totalMarks: z
      .number()
      .int("Total marks must be an integer.")
      .positive("Total marks must be greater than 0.")
      .max(1000, "Total marks must not exceed 1000."),
    courseId: z.string().cuid("A valid course ID is required."),
  }),
});

// Schema for updating an assignment
export const updateAssignmentSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Assignment title is required.")
      .max(200, "Assignment title must not exceed 200 characters.")
      .optional(),
    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters.")
      .optional()
      .nullable(),
    dueDate: z
      .string()
      .datetime("Due date must be a valid ISO datetime string.")
      .refine((date) => new Date(date) > new Date(), {
        message: "Due date must be in the future.",
      })
      .optional(),
    totalMarks: z
      .number()
      .int("Total marks must be an integer.")
      .positive("Total marks must be greater than 0.")
      .max(1000, "Total marks must not exceed 1000.")
      .optional(),
  }),
});

// Schema for validating assignment ID in URL parameters
export const assignmentIdParamSchema = z.object({
  params: z.object({
    id: z.string().cuid("A valid assignment ID is required."),
  }),
});

// Schema for validating query parameters for filtering assignments
export const assignmentQuerySchema = z.object({
  query: z.object({
    courseId: z.string().cuid("A valid course ID is required.").optional(),
    includeDeleted: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    includePastDue: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    sortBy: z.enum(["dueDate", "title", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  }),
});

// Schema for assignment statistics query
export const assignmentStatisticsQuerySchema = z.object({
  query: z.object({
    courseId: z.string().cuid("A valid course ID is required."),
  }),
});
