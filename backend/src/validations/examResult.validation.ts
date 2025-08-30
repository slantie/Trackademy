/**
 * @file src/validations/examResult.validation.ts
 * @description Enhanced Zod validation schemas for exam result-related API requests with comprehensive validation.
 */

import { z } from "zod";
import { ResultStatus } from "@prisma/client";

// Schema for creating a new exam result
export const createExamResultSchema = z.object({
    body: z.object({
        studentEnrollmentNumber: z
            .string()
            .min(1, "Student enrollment number is required")
            .max(50, "Enrollment number must be less than 50 characters"),
        spi: z
            .number()
            .min(0, "SPI cannot be negative")
            .max(10, "SPI cannot exceed 10"),
        cpi: z
            .number()
            .min(0, "CPI cannot be negative")
            .max(10, "CPI cannot exceed 10"),
        status: z.nativeEnum(ResultStatus, {
            message:
                "Valid result status is required (PASS, FAIL, TRIAL, ABSENT, UNKNOWN, WITHHELD)",
        }),
        studentId: z.string().cuid("Valid student ID is required").optional(),
        examId: z.string().cuid("Valid exam ID is required"),
    }),
});

// Schema for updating an existing exam result
export const updateExamResultSchema = z.object({
    params: z.object({
        id: z.string().cuid("Valid exam result ID is required"),
    }),
    body: z
        .object({
            spi: z
                .number()
                .min(0, "SPI cannot be negative")
                .max(10, "SPI cannot exceed 10")
                .optional(),
            cpi: z
                .number()
                .min(0, "CPI cannot be negative")
                .max(10, "CPI cannot exceed 10")
                .optional(),
            status: z
                .nativeEnum(ResultStatus, {
                    message:
                        "Valid result status is required (PASS, FAIL, TRIAL, ABSENT, UNKNOWN, WITHHELD)",
                })
                .optional(),
            studentId: z
                .string()
                .cuid("Valid student ID is required")
                .optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        }),
});

// Schema for validating exam result ID parameter
export const examResultIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("Valid exam result ID is required"),
    }),
});

// Schema for validating exam ID parameter
export const examIdParamSchema = z.object({
    params: z.object({
        examId: z.string().cuid("Valid exam ID is required"),
    }),
});

// Schema for validating student ID parameter
export const studentIdParamSchema = z.object({
    params: z.object({
        studentId: z.string().cuid("Valid student ID is required"),
    }),
});

// Schema for validating student enrollment number parameter
export const studentEnrollmentParamSchema = z.object({
    params: z.object({
        enrollmentNumber: z
            .string()
            .min(1, "Student enrollment number is required")
            .max(50, "Enrollment number must be less than 50 characters"),
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

// Schema for validating result status parameter
export const resultStatusParamSchema = z.object({
    params: z.object({
        status: z.nativeEnum(ResultStatus, {
            message:
                "Valid result status is required (PASS, FAIL, TRIAL, ABSENT, UNKNOWN, WITHHELD)",
        }),
    }),
});

// Schema for validating query parameters for listing exam results
export const examResultListQuerySchema = z.object({
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
        examId: z.string().cuid("Valid exam ID is required").optional(),
        studentId: z.string().cuid("Valid student ID is required").optional(),
        studentEnrollmentNumber: z
            .string()
            .max(50, "Enrollment number must be less than 50 characters")
            .optional(),
        status: z.nativeEnum(ResultStatus).optional(),
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("Valid academic year ID is required")
            .optional(),
        search: z.string().max(255, "Search query too long").optional(),
        minSpi: z
            .string()
            .optional()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .refine(
                (val) => val === undefined || (val >= 0 && val <= 10),
                "SPI must be between 0 and 10"
            ),
        maxSpi: z
            .string()
            .optional()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .refine(
                (val) => val === undefined || (val >= 0 && val <= 10),
                "SPI must be between 0 and 10"
            ),
        minCpi: z
            .string()
            .optional()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .refine(
                (val) => val === undefined || (val >= 0 && val <= 10),
                "CPI must be between 0 and 10"
            ),
        maxCpi: z
            .string()
            .optional()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .refine(
                (val) => val === undefined || (val >= 0 && val <= 10),
                "CPI must be between 0 and 10"
            ),
    }),
});

// Schema for validating query parameters for count
export const examResultCountQuerySchema = z.object({
    query: z.object({
        examId: z.string().cuid("Valid exam ID is required").optional(),
        studentId: z.string().cuid("Valid student ID is required").optional(),
        studentEnrollmentNumber: z
            .string()
            .max(50, "Enrollment number must be less than 50 characters")
            .optional(),
        status: z.nativeEnum(ResultStatus).optional(),
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("Valid academic year ID is required")
            .optional(),
        search: z.string().max(255, "Search query too long").optional(),
        minSpi: z
            .string()
            .optional()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .refine(
                (val) => val === undefined || (val >= 0 && val <= 10),
                "SPI must be between 0 and 10"
            ),
        maxSpi: z
            .string()
            .optional()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .refine(
                (val) => val === undefined || (val >= 0 && val <= 10),
                "SPI must be between 0 and 10"
            ),
        minCpi: z
            .string()
            .optional()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .refine(
                (val) => val === undefined || (val >= 0 && val <= 10),
                "CPI must be between 0 and 10"
            ),
        maxCpi: z
            .string()
            .optional()
            .transform((val) => (val ? parseFloat(val) : undefined))
            .refine(
                (val) => val === undefined || (val >= 0 && val <= 10),
                "CPI must be between 0 and 10"
            ),
    }),
});

// Schema for validating search query parameters
export const examResultSearchQuerySchema = z.object({
    query: z.object({
        q: z
            .string()
            .min(1, "Search query is required")
            .max(255, "Search query too long"),
        examId: z.string().cuid("Valid exam ID is required").optional(),
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        status: z.nativeEnum(ResultStatus).optional(),
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
export const examResultFilterQuerySchema = z.object({
    query: z.object({
        examId: z.string().cuid("Valid exam ID is required").optional(),
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("Valid academic year ID is required")
            .optional(),
        status: z.nativeEnum(ResultStatus).optional(),
        limit: z
            .string()
            .optional()
            .transform((val) => (val ? parseInt(val) : 50))
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            ),
        byField: z.enum(["spi", "cpi"]).optional(),
    }),
});

// Schema for validating statistics query parameters
export const examResultStatisticsQuerySchema = z.object({
    query: z.object({
        examId: z.string().cuid("Valid exam ID is required").optional(),
        semesterId: z.string().cuid("Valid semester ID is required").optional(),
        departmentId: z
            .string()
            .cuid("Valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("Valid academic year ID is required")
            .optional(),
    }),
});

// Schema for bulk operations
export const examResultBulkIdsSchema = z.object({
    body: z.object({
        examResultIds: z
            .array(z.string().cuid("Valid exam result ID is required"))
            .min(1, "At least one exam result ID is required")
            .max(50, "Cannot process more than 50 exam results at once"),
    }),
});

// Legacy schemas for backward compatibility
export const listResultsByExamSchema = z.object({
    query: z.object({
        examId: z.string().cuid("Valid exam ID is required"),
    }),
});

export const listResultsByStudentSchema = z.object({
    query: z.object({
        studentId: z.string().cuid("Valid student ID is required"),
    }),
});
