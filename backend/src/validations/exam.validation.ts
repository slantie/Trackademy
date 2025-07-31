/**
 * @file src/validations/exam.validation.ts
 * @description Zod validation schemas for exam-related API requests.
 */

import { z } from "zod";
import { ExamType } from "@prisma/client";

// Schema for creating a new exam
export const createExamSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Exam name is required."),
        examType: z.nativeEnum(ExamType),
        semesterId: z
            .string()
            .cuid("A valid semester instance ID is required."),
    }),
});

// Schema for updating an existing exam
export const updateExamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid exam ID is required."),
    }),
    body: z
        .object({
            name: z.string().min(1).optional(),
            isPublished: z.boolean().optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const examIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid exam ID is required."),
    }),
});

// Schema for validating query parameters for filtering exams
export const examQuerySchema = z.object({
    query: z.object({
        semesterId: z.string().cuid("A valid semester ID is required."),
    }),
});
