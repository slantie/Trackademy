/**
 * @file src/validations/student.validation.ts
 * @description Enhanced Zod validation schemas for student-related API requests with comprehensive validation.
 */

import { z } from "zod";

// Schema for creating a new student (which also creates a user)
export const createStudentSchema = z.object({
    body: z.object({
        email: z
            .string()
            .email("A valid email is required.")
            .min(1, "Email is required.")
            .max(255, "Email must not exceed 255 characters."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long.")
            .max(100, "Password must not exceed 100 characters.")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one lowercase letter, one uppercase letter, and one number."
            ),
        fullName: z
            .string()
            .min(1, "Full name is required.")
            .max(100, "Full name must not exceed 100 characters.")
            .trim(),
        enrollmentNumber: z
            .string()
            .min(1, "Enrollment number is required.")
            .max(50, "Enrollment number must not exceed 50 characters.")
            .trim()
            .regex(
                /^[A-Za-z0-9\-]+$/,
                "Enrollment number can only contain letters, numbers, and hyphens."
            ),
        batch: z
            .string()
            .min(1, "Batch is required.")
            .max(20, "Batch must not exceed 20 characters.")
            .trim(),
        departmentId: z.string().cuid("A valid department ID is required."),
        semesterId: z
            .string()
            .cuid("A valid semester instance ID is required."),
        divisionId: z
            .string()
            .cuid("A valid division instance ID is required."),
    }),
});

// Schema for updating an existing student's profile
export const updateStudentSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid student profile ID is required."),
    }),
    body: z
        .object({
            fullName: z
                .string()
                .min(1, "Full name cannot be empty.")
                .max(100, "Full name must not exceed 100 characters.")
                .trim()
                .optional(),
            batch: z
                .string()
                .min(1, "Batch cannot be empty.")
                .max(20, "Batch must not exceed 20 characters.")
                .trim()
                .optional(),
            semesterId: z
                .string()
                .cuid("A valid semester ID is required.")
                .optional(),
            divisionId: z
                .string()
                .cuid("A valid division ID is required.")
                .optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const studentIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid student profile ID is required."),
    }),
});

// Schema for validating enrollment number parameter
export const enrollmentNumberParamSchema = z.object({
    params: z.object({
        enrollmentNumber: z
            .string()
            .min(1, "Enrollment number is required.")
            .max(50, "Enrollment number must not exceed 50 characters."),
    }),
});

// Schema for validating department ID parameter
export const departmentIdParamSchema = z.object({
    params: z.object({
        departmentId: z.string().cuid("A valid department ID is required."),
    }),
});

// Schema for validating semester ID parameter
export const semesterIdParamSchema = z.object({
    params: z.object({
        semesterId: z.string().cuid("A valid semester ID is required."),
    }),
});

// Schema for validating division ID parameter
export const divisionIdParamSchema = z.object({
    params: z.object({
        divisionId: z.string().cuid("A valid division ID is required."),
    }),
});

// Schema for validating batch parameter
export const batchParamSchema = z.object({
    params: z.object({
        batch: z
            .string()
            .min(1, "Batch is required.")
            .max(20, "Batch must not exceed 20 characters."),
    }),
});

// Schema for validating query parameters for getting all students
export const getAllStudentsQuerySchema = z.object({
    query: z
        .object({
            page: z
                .string()
                .regex(/^\d+$/, "Page must be a positive integer.")
                .transform(Number)
                .refine((val) => val > 0, "Page must be greater than 0.")
                .optional(),
            limit: z
                .string()
                .regex(/^\d+$/, "Limit must be a positive integer.")
                .transform(Number)
                .refine(
                    (val) => val > 0 && val <= 100,
                    "Limit must be between 1 and 100."
                )
                .optional(),
            departmentId: z
                .string()
                .cuid("A valid department ID is required.")
                .optional(),
            semesterId: z
                .string()
                .cuid("A valid semester ID is required.")
                .optional(),
            divisionId: z
                .string()
                .cuid("A valid division ID is required.")
                .optional(),
            batch: z
                .string()
                .min(1, "Batch cannot be empty.")
                .max(20, "Batch must not exceed 20 characters.")
                .optional(),
            search: z
                .string()
                .min(1, "Search query cannot be empty.")
                .max(100, "Search query must not exceed 100 characters.")
                .optional(),
            includeDeleted: z
                .string()
                .regex(
                    /^(true|false)$/,
                    "Include deleted must be 'true' or 'false'."
                )
                .optional(),
            sortBy: z
                .enum(["fullName", "enrollmentNumber", "batch", "createdAt"])
                .optional(),
            sortOrder: z.enum(["asc", "desc"]).optional(),
        })
        .optional()
        .default({}),
});

// Schema for validating search query parameters
export const searchStudentsQuerySchema = z.object({
    query: z.object({
        q: z
            .string()
            .min(1, "Search query is required.")
            .max(100, "Search query must not exceed 100 characters.")
            .trim(),
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
        semesterId: z
            .string()
            .cuid("A valid semester ID is required.")
            .optional(),
        divisionId: z
            .string()
            .cuid("A valid division ID is required.")
            .optional(),
        batch: z
            .string()
            .min(1, "Batch cannot be empty.")
            .max(20, "Batch must not exceed 20 characters.")
            .optional(),
        limit: z
            .string()
            .regex(/^\d+$/, "Limit must be a positive integer.")
            .transform(Number)
            .refine(
                (val) => val > 0 && val <= 50,
                "Limit must be between 1 and 50."
            )
            .optional(),
    }),
});

// Schema for validating count query parameters
export const getStudentsCountQuerySchema = z.object({
    query: z
        .object({
            departmentId: z
                .string()
                .cuid("A valid department ID is required.")
                .optional(),
            semesterId: z
                .string()
                .cuid("A valid semester ID is required.")
                .optional(),
            divisionId: z
                .string()
                .cuid("A valid division ID is required.")
                .optional(),
            batch: z
                .string()
                .min(1, "Batch cannot be empty.")
                .max(20, "Batch must not exceed 20 characters.")
                .optional(),
            search: z
                .string()
                .min(1, "Search query cannot be empty.")
                .max(100, "Search query must not exceed 100 characters.")
                .optional(),
            includeDeleted: z
                .string()
                .regex(
                    /^(true|false)$/,
                    "Include deleted must be 'true' or 'false'."
                )
                .optional(),
        })
        .optional()
        .default({}),
});

// Schema for validating filter options in specific endpoints
export const getStudentsByDepartmentQuerySchema = z.object({
    query: z
        .object({
            semesterId: z
                .string()
                .cuid("A valid semester ID is required.")
                .optional(),
            divisionId: z
                .string()
                .cuid("A valid division ID is required.")
                .optional(),
            batch: z
                .string()
                .min(1, "Batch cannot be empty.")
                .max(20, "Batch must not exceed 20 characters.")
                .optional(),
            limit: z
                .string()
                .regex(/^\d+$/, "Limit must be a positive integer.")
                .transform(Number)
                .refine(
                    (val) => val > 0 && val <= 100,
                    "Limit must be between 1 and 100."
                )
                .optional(),
        })
        .optional()
        .default({}),
});

export const getStudentsBySemesterQuerySchema = z.object({
    query: z
        .object({
            departmentId: z
                .string()
                .cuid("A valid department ID is required.")
                .optional(),
            divisionId: z
                .string()
                .cuid("A valid division ID is required.")
                .optional(),
            batch: z
                .string()
                .min(1, "Batch cannot be empty.")
                .max(20, "Batch must not exceed 20 characters.")
                .optional(),
            limit: z
                .string()
                .regex(/^\d+$/, "Limit must be a positive integer.")
                .transform(Number)
                .refine(
                    (val) => val > 0 && val <= 100,
                    "Limit must be between 1 and 100."
                )
                .optional(),
        })
        .optional()
        .default({}),
});

export const getStudentsByBatchQuerySchema = z.object({
    query: z
        .object({
            departmentId: z
                .string()
                .cuid("A valid department ID is required.")
                .optional(),
            semesterId: z
                .string()
                .cuid("A valid semester ID is required.")
                .optional(),
            divisionId: z
                .string()
                .cuid("A valid division ID is required.")
                .optional(),
            limit: z
                .string()
                .regex(/^\d+$/, "Limit must be a positive integer.")
                .transform(Number)
                .refine(
                    (val) => val > 0 && val <= 100,
                    "Limit must be between 1 and 100."
                )
                .optional(),
        })
        .optional()
        .default({}),
});

// Schema for validating statistics query parameters
export const getStudentStatisticsQuerySchema = z.object({
    query: z
        .object({
            departmentId: z
                .string()
                .cuid("A valid department ID is required.")
                .optional(),
            semesterId: z
                .string()
                .cuid("A valid semester ID is required.")
                .optional(),
            divisionId: z
                .string()
                .cuid("A valid division ID is required.")
                .optional(),
            batch: z
                .string()
                .min(1, "Batch cannot be empty.")
                .max(20, "Batch must not exceed 20 characters.")
                .optional(),
        })
        .optional()
        .default({}),
});
