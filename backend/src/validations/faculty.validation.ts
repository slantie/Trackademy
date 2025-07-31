/**
 * @file src/validations/faculty.validation.ts
 * @description Zod validation schemas for faculty-related API requests.
 */

import { z } from "zod";
import { Designation } from "@prisma/client";

// Schema for creating a new faculty member and their user account
export const createFacultySchema = z.object({
    body: z.object({
        email: z.string().email("A valid email is required."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long."),
        fullName: z.string().min(1, "Full name is required."),
        designation: z.nativeEnum(Designation),
        abbreviation: z.string().min(1).optional(),
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
            fullName: z.string().min(1).optional(),
            designation: z.nativeEnum(Designation).optional(),
            abbreviation: z.string().min(1).optional(),
            joiningDate: z.string().datetime().optional().nullable(),
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
        departmentId: z.string().cuid("A valid department ID is required."),
    }),
});
