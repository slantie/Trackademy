/**
 * @file src/validations/department.validation.ts
 * @description Zod validation schemas for department-related API requests.
 */

import { z } from "zod";

// Schema for creating a new department
export const createDepartmentSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Department name is required."),
        abbreviation: z.string().min(1, "Abbreviation is required."),
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
            name: z.string().min(1).optional(),
            abbreviation: z.string().min(1).optional(),
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
        collegeId: z.string().cuid("A valid college ID is required."),
    }),
});
