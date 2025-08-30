/**
 * @file src/validations/division.validation.ts
 * @description Enhanced Zod validation schemas for division-related API requests with comprehensive validation.
 */

import { z } from "zod";

// Schema for creating a new division
export const createDivisionSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(1, "Division name is required")
            .max(100, "Division name cannot exceed 100 characters"),
        semesterId: z.string().cuid("A valid semester ID is required"),
    }),
});

// Schema for updating an existing division
export const updateDivisionSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid division ID is required"),
    }),
    body: z
        .object({
            name: z
                .string()
                .min(1, "Division name cannot be empty")
                .max(100, "Division name cannot exceed 100 characters")
                .optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        }),
});

// Schema for validating a CUID in the URL parameters
export const divisionIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid division ID is required"),
    }),
});

// Schema for validating query parameters for getting all divisions
export const getAllDivisionsQuerySchema = z.object({
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
        semesterId: z
            .string()
            .cuid("A valid semester ID is required")
            .optional(),
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
            .optional(),
        search: z.string().min(1, "Search query cannot be empty").optional(),
        includeDeleted: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
    }),
});

// Schema for count endpoint
export const getDivisionCountQuerySchema = z.object({
    query: z.object({
        semesterId: z
            .string()
            .cuid("A valid semester ID is required")
            .optional(),
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
            .optional(),
        search: z.string().min(1, "Search query cannot be empty").optional(),
        includeDeleted: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
    }),
});

// Schema for search endpoint
export const searchDivisionsQuerySchema = z.object({
    query: z.object({
        q: z.string().min(1, "Search query cannot be empty"),
        semesterId: z
            .string()
            .cuid("A valid semester ID is required")
            .optional(),
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
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
    }),
});

// Schema for department param
export const departmentParamSchema = z.object({
    params: z.object({
        departmentId: z.string().cuid("A valid department ID is required"),
    }),
    query: z.object({
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
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
    }),
});

// Schema for academic year param
export const academicYearParamSchema = z.object({
    params: z.object({
        academicYearId: z.string().cuid("A valid academic year ID is required"),
    }),
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
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
    }),
});

// Schema for validating query parameters for filtering divisions by semester
export const divisionQuerySchema = z.object({
    query: z.object({
        semesterId: z.string().cuid("A valid semester ID is required"),
    }),
});
