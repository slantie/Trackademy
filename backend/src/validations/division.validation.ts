/**
 * @file src/validations/division.validation.ts
 * @description Zod validation schemas for division-related API requests.
 */

import { z } from "zod";

// Schema for creating a new division
export const createDivisionSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Division name is required."),
        semesterId: z.string().cuid("A valid semester ID is required."),
    }),
});

// Schema for updating an existing division
export const updateDivisionSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid division ID is required."),
    }),
    body: z
        .object({
            name: z.string().min(1).optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const divisionIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid division ID is required."),
    }),
});

// Schema for validating query parameters for filtering divisions
export const divisionQuerySchema = z.object({
    query: z.object({
        semesterId: z.string().cuid("A valid semester ID is required."),
    }),
});
