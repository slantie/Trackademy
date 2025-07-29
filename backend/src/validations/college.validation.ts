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
        websiteUrl: z
            .string()
            .url("A valid website URL is required.")
            .optional()
            .or(z.literal("")),
        address: z.string().optional(),
        contactNumber: z.string().optional(),
    }),
});

// Schema for updating an existing college
export const updateCollegeSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid college ID is required."),
    }),
    body: z
        .object({
            name: z
                .string()
                .min(3, "College name must be at least 3 characters long.")
                .optional(),
            websiteUrl: z
                .string()
                .url("A valid website URL is required.")
                .optional()
                .or(z.literal("")),
            address: z.string().optional(),
            contactNumber: z.string().optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine(
            (data) => Object.keys(data).length > 0,
            { message: "At least one field must be provided for update." }
        ), // Ensure body is not empty
});

// Schema for validating a CUID in the URL parameters
export const collegeIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid college ID is required."),
    }),
});
