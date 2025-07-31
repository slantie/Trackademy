/**
 * @file src/validations/semester.validation.ts
 * @description Zod validation schemas for semester-related API requests.
 */

import { z } from "zod";
import { SemesterType } from "@prisma/client";

// Schema for creating a new semester instance
export const createSemesterSchema = z.object({
    body: z.object({
        semesterNumber: z
            .number({ error: "Semester number must be a number." })
            .int()
            .min(1, "Semester number must be at least 1.")
            .max(12),
        semesterType: z.nativeEnum(SemesterType, {
            error: "Semester type is required (ODD or EVEN).",
        }),
        departmentId: z.string().cuid("A valid department ID is required."),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required."),
    }),
});

// Schema for updating an existing semester instance
export const updateSemesterSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid semester ID is required."),
    }),
    body: z
        .object({
            // Only deletion status is mutable for a semester instance. Other fields define its identity.
            isDeleted: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const semesterIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid semester ID is required."),
    }),
});

// Schema for validating query parameters for filtering semesters
export const semesterQuerySchema = z.object({
    query: z.object({
        departmentId: z.string().cuid("A valid department ID is required."),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required."),
    }),
});
