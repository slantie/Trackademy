/**
 * @file src/validations/faculty.validation.ts
 * @description Enhanced Zod validation schemas for faculty-related API requests.
 */

import { z } from "zod";
import { Designation } from "@prisma/client";

// Schema for creating a new faculty member and their user account
export const createFacultySchema = z.object({
    body: z.object({
        email: z
            .string()
            .email("A valid email is required.")
            .min(5, "Email must be at least 5 characters long.")
            .max(100, "Email must be at most 100 characters long."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long.")
            .max(128, "Password must be at most 128 characters long.")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                "Password must contain at least one lowercase letter, one uppercase letter, and one number."
            ),
        fullName: z
            .string()
            .min(2, "Full name must be at least 2 characters long.")
            .max(100, "Full name must be at most 100 characters long.")
            .regex(
                /^[a-zA-Z\s.'-]+$/,
                "Full name can only contain letters, spaces, dots, apostrophes, and hyphens."
            ),
        designation: z.nativeEnum(Designation),
        abbreviation: z
            .string()
            .min(1, "Abbreviation must be at least 1 character long.")
            .max(10, "Abbreviation must be at most 10 characters long.")
            .regex(
                /^[A-Z0-9.]+$/,
                "Abbreviation can only contain uppercase letters, numbers, and dots."
            )
            .optional(),
        joiningDate: z
            .string()
            .datetime({
                message: "Joining date must be a valid ISO date string.",
            })
            .optional()
            .nullable(),
        departmentId: z.string().cuid("A valid department ID is required."),
    }),
});

// Schema for updating an existing faculty's profile
export const updateFacultySchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid faculty profile ID is required."),
    }),
    body: z
        .object({
            fullName: z
                .string()
                .min(2, "Full name must be at least 2 characters long.")
                .max(100, "Full name must be at most 100 characters long.")
                .regex(
                    /^[a-zA-Z\s.'-]+$/,
                    "Full name can only contain letters, spaces, dots, apostrophes, and hyphens."
                )
                .optional(),
            designation: z.nativeEnum(Designation).optional(),
            abbreviation: z
                .string()
                .min(1, "Abbreviation must be at least 1 character long.")
                .max(10, "Abbreviation must be at most 10 characters long.")
                .regex(
                    /^[A-Z0-9.]+$/,
                    "Abbreviation can only contain uppercase letters, numbers, and dots."
                )
                .optional(),
            joiningDate: z
                .string()
                .datetime({
                    message: "Joining date must be a valid ISO date string.",
                })
                .optional()
                .nullable(),
            isDeleted: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const facultyIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid faculty profile ID is required."),
    }),
});

// Schema for validating query parameters for filtering faculty
export const facultyQuerySchema = z.object({
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
        designation: z.nativeEnum(Designation).optional(),
        search: z
            .string()
            .min(1, "Search query must be at least 1 character long.")
            .max(100, "Search query must be at most 100 characters long.")
            .optional(),
        includeDeleted: z
            .string()
            .refine(
                (val) => val === "true" || val === "false",
                "includeDeleted must be 'true' or 'false'."
            )
            .optional(),
    }),
});

// Schema for count endpoint
export const facultyCountQuerySchema = z.object({
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
        designation: z.nativeEnum(Designation).optional(),
        search: z
            .string()
            .min(1, "Search query must be at least 1 character long.")
            .max(100, "Search query must be at most 100 characters long.")
            .optional(),
        includeDeleted: z
            .string()
            .refine(
                (val) => val === "true" || val === "false",
                "includeDeleted must be 'true' or 'false'."
            )
            .optional(),
    }),
});

// Schema for search endpoint
export const facultySearchQuerySchema = z.object({
    query: z.object({
        q: z
            .string()
            .min(1, "Search query is required.")
            .max(100, "Search query must be at most 100 characters long."),
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
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

// Schema for designation parameter validation
export const facultyDesignationParamSchema = z.object({
    params: z.object({
        designation: z.nativeEnum(Designation),
    }),
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
    }),
});

// Schema for deletion with hard delete option
export const facultyDeleteSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid faculty profile ID is required."),
    }),
    query: z.object({
        hard: z
            .string()
            .refine(
                (val) => val === "true" || val === "false",
                "hard must be 'true' or 'false'."
            )
            .optional(),
    }),
});

// Schema for grouped by designation query
export const facultyGroupedQuerySchema = z.object({
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
    }),
});

// Type exports for TypeScript
export type CreateFacultyRequest = z.infer<typeof createFacultySchema>["body"];
export type UpdateFacultyRequest = z.infer<typeof updateFacultySchema>["body"];
export type FacultyQueryParams = z.infer<typeof facultyQuerySchema>["query"];
