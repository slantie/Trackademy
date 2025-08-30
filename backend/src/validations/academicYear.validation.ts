/**
 * @file src/validations/academicYear.validation.ts
 * @description Enhanced Zod validation schemas for academic year-related API requests with comprehensive validation.
 */

import { z } from "zod";

// Schema for creating a new academic year
export const createAcademicYearSchema = z.object({
    body: z.object({
        year: z
            .string()
            .min(1, "Year cannot be empty")
            .regex(
                /^\d{4}-\d{4}$/,
                "Year must be in YYYY-YYYY format (e.g., 2023-2024)"
            ),
        collegeId: z.string().cuid("A valid college ID is required"),
        isActive: z.boolean().optional(),
    }),
});

// Schema for updating an existing academic year
export const updateAcademicYearSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid academic year ID is required"),
    }),
    body: z
        .object({
            year: z
                .string()
                .min(1, "Year cannot be empty")
                .regex(
                    /^\d{4}-\d{4}$/,
                    "Year must be in YYYY-YYYY format (e.g., 2023-2024)"
                )
                .optional(),
            isActive: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message:
                "At least one field (year or isActive) must be provided for update",
        }),
});

// Schema for validating a CUID in the URL parameters
export const academicYearIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid academic year ID is required"),
    }),
});

// Schema for validating an optional collegeId in the query string
export const academicYearQuerySchema = z.object({
    query: z.object({
        collegeId: z.string().cuid("A valid college ID is required"),
    }),
});

// Schema for validating query parameters for getting all academic years
export const getAllAcademicYearsQuerySchema = z.object({
    query: z.object({
        page: z
            .string()
            .regex(/^\d+$/, "Page must be a positive integer")
            .transform(Number)
            .refine((val) => val > 0, "Page must be greater than 0")
            .optional(),
        limit: z
            .string()
            .regex(/^\d+$/, "Limit must be a positive integer")
            .transform(Number)
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            )
            .optional(),
        collegeId: z.string().cuid("A valid college ID is required").optional(),
        isActive: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
        search: z.string().min(1, "Search query cannot be empty").optional(),
        includeDeleted: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
    }),
});

// Schema for count endpoint
export const getAcademicYearCountQuerySchema = z.object({
    query: z.object({
        collegeId: z.string().cuid("A valid college ID is required").optional(),
        isActive: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
        search: z.string().min(1, "Search query cannot be empty").optional(),
        includeDeleted: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
    }),
});

// Schema for search endpoint
export const searchAcademicYearsQuerySchema = z.object({
    query: z.object({
        q: z.string().min(1, "Search query cannot be empty"),
        collegeId: z.string().cuid("A valid college ID is required").optional(),
        limit: z
            .string()
            .regex(/^\d+$/, "Limit must be a positive integer")
            .transform(Number)
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            )
            .optional(),
    }),
});

// Schema for optional college query
export const optionalCollegeQuerySchema = z.object({
    query: z.object({
        collegeId: z.string().cuid("A valid college ID is required").optional(),
    }),
});

// Schema for activation/deactivation endpoints (only ID param needed)
export const activateDeactivateAcademicYearSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid academic year ID is required"),
    }),
});
