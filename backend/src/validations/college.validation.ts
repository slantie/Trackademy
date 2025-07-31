/**
 * @file src/validations/college.validation.ts
 * @description Zod validation schemas for college-related API requests.
 */

import { z } from "zod";

// Schema for creating a new college
export const createCollegeSchema = z.object({
    body: z.object({
        name: z
            .string()
            .nonempty("College name is required.")
            .min(3, "College name must be at least 3 characters long."),
        abbreviation: z
            .string()
            .nonempty("Abbreviation is required.")
            .min(2, "Abbreviation must be at least 2 characters long."),
    }),
});

// Schema for updating an existing college
export const updateCollegeSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid college ID is required."),
    }),
    body: z
        .object({
            name: z.string().min(3).optional(),
            abbreviation: z.string().min(2).optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine(
            (data) =>
                data.name !== undefined ||
                data.abbreviation !== undefined ||
                data.isDeleted !== undefined,
            { message: "At least one field must be provided for update." }
        ),
});

// Schema for validating a CUID in the URL parameters
export const collegeIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid college ID is required."),
    }),
});
