/**
 * @file src/validations/faculty.validation.ts
 * @description Zod validation schemas for faculty-related API requests.
 */

import { z } from "zod";
import { Designation } from "@prisma/client";

// NOTE: The schema for creating a faculty is handled in `auth.types.ts`
// as it's part of the user registration process.

// Schema for updating an existing faculty's profile
export const updateFacultySchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid faculty ID is required."),
    }),
    body: z
        .object({
            fullName: z
                .string()
                .min(3, "Full name must be at least 3 characters long.")
                .optional(),
            designation: z.nativeEnum(Designation).optional(),
            abbreviation: z.string().min(1).max(10).optional(),
            joiningDate: z.string().datetime().optional(),
            seatingLocation: z.string().optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine(data => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const facultyIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid faculty ID is required."),
    }),
});

// Schema for validating query parameters for filtering faculty
export const facultyQuerySchema = z.object({
    query: z.object({
        departmentId: z.string().cuid("A valid department ID is required."),
    }),
});
