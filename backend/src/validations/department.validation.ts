/**
 * @file src/validations/department.validation.ts
 * @description Zod validation schemas for department-related API requests.
 */

import { z } from "zod";

// Schema for creating a new department
export const createDepartmentSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Department name is required.")
            .min(3, "Department name must be at least 3 characters long.")
            .max(100, "Department name must not exceed 100 characters."),
        abbreviation: z
            .string()
            .min(1, "Abbreviation is required.")
            .min(2, "Abbreviation must be at least 2 characters long.")
            .max(10, "Abbreviation must not exceed 10 characters.")
            .regex(
                /^[A-Z0-9]+$/,
                "Abbreviation must contain only uppercase letters and numbers."
            ),
        collegeId: z.string().cuid("A valid college ID is required."),
    }),
});

// Schema for updating an existing department
export const updateDepartmentSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid department ID is required."),
    }),
    body: z
        .object({
            name: z
                .string()
                .min(3, "Department name must be at least 3 characters long.")
                .max(100, "Department name must not exceed 100 characters.")
                .optional(),
            abbreviation: z
                .string()
                .min(2, "Abbreviation must be at least 2 characters long.")
                .max(10, "Abbreviation must not exceed 10 characters.")
                .regex(
                    /^[A-Z0-9]+$/,
                    "Abbreviation must contain only uppercase letters and numbers."
                )
                .optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const departmentIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid department ID is required."),
    }),
});

// Schema for validating the collegeId in the query string
export const departmentQuerySchema = z.object({
    query: z.object({
        collegeId: z
            .string()
            .cuid("A valid college ID is required.")
            .optional(),
        search: z.string().min(1).optional(),
        include: z.enum(["relations"]).optional(),
        force: z.enum(["true", "false"]).optional(),
    }),
});

// Schema for count endpoint queries
export const departmentCountQuerySchema = z.object({
    query: z.object({
        collegeId: z
            .string()
            .cuid("A valid college ID is required.")
            .optional(),
    }),
});

// Schema for search endpoint
export const departmentSearchQuerySchema = z.object({
    query: z.object({
        q: z
            .string()
            .min(1, "Search term is required.")
            .min(2, "Search term must be at least 2 characters long."),
        collegeId: z
            .string()
            .cuid("A valid college ID is required.")
            .optional(),
    }),
});

// Schema for delete with force option
export const departmentDeleteSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid department ID is required."),
    }),
    query: z.object({
        force: z.enum(["true", "false"]).optional(),
    }),
});
