/**
 * @file src/validations/exam.validation.ts
 * @description Enhanced Zod validation schemas for exam-related API requests with comprehensive validation.
 */

import { z } from "zod";
import { ExamType } from "@prisma/client";

// Schema for creating a new exam
export const createExamSchema = z.object({
    body: z
        .object({
            name: z
                .string()
                .min(1, "Exam name is required")
                .max(255, "Exam name must be less than 255 characters"),
            examType: z.nativeEnum(ExamType, {
                message:
                    "Valid exam type is required (MIDTERM, REMEDIAL, FINAL, REPEAT)",
            }),
            semesterId: z.string().cuid("Valid semester ID is required"),
            description: z
                .string()
                .max(1000, "Description must be less than 1000 characters")
                .optional(),
            maxMarks: z
                .number()
                .min(1, "Maximum marks must be at least 1")
                .max(1000, "Maximum marks cannot exceed 1000")
                .optional(),
            passMarks: z
                .number()
                .min(0, "Pass marks cannot be negative")
                .optional(),
            examDate: z
                .string()
                .datetime("Valid exam date is required")
                .or(z.date())
                .optional(),
            duration: z
                .number()
                .min(1, "Duration must be at least 1 minute")
                .max(600, "Duration cannot exceed 600 minutes")
                .optional(),
            isPublished: z.boolean().optional(),
        })
        .refine(
            (data) => {
                if (data.passMarks && data.maxMarks) {
                    return data.passMarks <= data.maxMarks;
                }
                return true;
            },
            {
                message: "Pass marks cannot be greater than maximum marks",
                path: ["passMarks"],
            }
        ),
});

// Schema for updating an existing exam
export const updateExamSchema = z.object({
    params: z.object({
        id: z.string().cuid("Valid exam ID is required"),
    }),
    body: z
        .object({
            name: z
                .string()
                .min(1, "Exam name cannot be empty")
                .max(255, "Exam name must be less than 255 characters")
                .optional(),
            description: z
                .string()
                .max(1000, "Description must be less than 1000 characters")
                .optional(),
            maxMarks: z
                .number()
                .min(1, "Maximum marks must be at least 1")
                .max(1000, "Maximum marks cannot exceed 1000")
                .optional(),
            passMarks: z
                .number()
                .min(0, "Pass marks cannot be negative")
                .optional(),
            examDate: z
                .string()
                .datetime("Valid exam date is required")
                .or(z.date())
                .optional(),
            duration: z
                .number()
                .min(1, "Duration must be at least 1 minute")
                .max(600, "Duration cannot exceed 600 minutes")
                .optional(),
            isPublished: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        })
        .refine(
            (data) => {
                if (data.passMarks && data.maxMarks) {
                    return data.passMarks <= data.maxMarks;
                }
                return true;
            },
            {
                message: "Pass marks cannot be greater than maximum marks",
                path: ["passMarks"],
            }
        ),
});

// Schema for validating exam ID parameter
export const examIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("Valid exam ID is required"),
    }),
});

// Schema for validating exam type parameter
export const examTypeParamSchema = z.object({
    params: z.object({
        examType: z.nativeEnum(ExamType, {
            message:
                "Valid exam type is required (MIDTERM, REMEDIAL, FINAL, REPEAT)",
        }),
    }),
});

// Schema for validating semester ID parameter
export const semesterIdParamSchema = z.object({
    params: z.object({
        semesterId: z.string().cuid("Valid semester ID is required"),
    }),
});

// Schema for validating department ID parameter
export const departmentIdParamSchema = z.object({
    params: z.object({
        departmentId: z.string().cuid("Valid department ID is required"),
    }),
});

// Schema for validating query parameters for listing exams
export const examListQuerySchema = z.object({
    query: z.object({
        page: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 1))
            .refine((val) => val > 0, "Page must be a positive number"),
        limit: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 10))
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            ),
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("Valid academic year ID is required")
            .optional(),
        examType: z.nativeEnum(ExamType).optional(),
        isPublished: z
            .string()
            .optional()
            .transform((val) => {
                if (val === "true") return true;
                if (val === "false") return false;
                return undefined;
            }),
        search: z.string().max(255, "Search query too long").optional(),
        includeDeleted: z
            .string()
            .optional()
            .transform((val) => val === "true"),
    }),
});

// Schema for validating query parameters for count
export const examCountQuerySchema = z.object({
    query: z.object({
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("Valid academic year ID is required")
            .optional(),
        examType: z.nativeEnum(ExamType).optional(),
        isPublished: z
            .string()
            .optional()
            .transform((val) => {
                if (val === "true") return true;
                if (val === "false") return false;
                return undefined;
            }),
        search: z.string().max(255, "Search query too long").optional(),
        includeDeleted: z
            .string()
            .optional()
            .transform((val) => val === "true"),
    }),
});

// Schema for validating search query parameters
export const examSearchQuerySchema = z.object({
    query: z.object({
        q: z
            .string()
            .min(1, "Search query is required")
            .max(255, "Search query too long"),
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        examType: z.nativeEnum(ExamType).optional(),
        limit: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 20))
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            ),
    }),
});

// Schema for validating filtered query parameters
export const examFilterQuerySchema = z.object({
    query: z.object({
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("Valid academic year ID is required")
            .optional(),
        limit: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 50))
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            ),
    }),
});

// Schema for bulk operations
export const examBulkIdsSchema = z.object({
    body: z.object({
        examIds: z
            .array(z.string().cuid("Valid exam ID is required"))
            .min(1, "At least one exam ID is required")
            .max(50, "Cannot process more than 50 exams at once"),
    }),
});

// Schema for validating simple query with semester ID
export const examQuerySchema = z.object({
    query: z.object({
        semesterId: z.string().cuid("Valid semester ID is required"),
    }),
});
