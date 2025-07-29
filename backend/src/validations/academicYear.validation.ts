/**
 * @file src/validations/academicYear.validation.ts
 * @description Zod validation schemas for academic year-related API requests.
 */

import { z } from "zod";

// Schema for creating a new academic year
export const createAcademicYearSchema = z.object({
    body: z.object({
        year: z
            .string()
            .nonempty("Academic year is required.")
            .regex(/^\d{4}-\d{4}$/, "Year must be in YYYY-YYYY format."),
        collegeId: z.cuid().nonempty("College ID is required."),
        isActive: z.boolean().optional(),
    }),
});

// Schema for updating an existing academic year
export const updateAcademicYearSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid academic year ID is required."),
    }),
    body: z
        .object({
            year: z
                .string()
                .regex(/^\d{4}-\d{4}$/, "Year must be in YYYY-YYYY format.")
                .optional(),
            isActive: z.boolean().optional(),
        })
        .refine(
            (data) => data.year !== undefined || data.isActive !== undefined,
            { message: "At least one field (year or isActive) must be provided for update." }
        ),
});

// Schema for validating a CUID in the URL parameters
export const academicYearIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid academic year ID is required."),
    }),
});

// Schema for validating an optional collegeId in the query string
export const academicYearQuerySchema = z.object({
    query: z.object({
        collegeId: z.string().cuid("A valid college ID is required."),
    }),
});
