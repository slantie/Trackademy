/**
 * @file src/validations/semester.validation.ts
 * @description Zod validation schemas for semester-related API requests.
 */

import { z } from "zod";
import { SemesterType } from "@prisma/client";

// Schema for creating a new semester
export const createSemesterSchema = z.object({
    body: z.object({
        semesterNumber: z
            .number()
            .int()
            .min(1)
            .max(12),
        semesterType: z.nativeEnum(SemesterType),
        departmentId: z
            .string()
            .nonempty("Department ID is required.")
            .cuid(),
        academicYearId: z
            .string()
            .nonempty("Academic Year ID is required.")
            .cuid(),
    }),
});

// Schema for updating an existing semester
export const updateSemesterSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid semester ID is required."),
    }),
    body: z
        .object({
            semesterNumber: z.number().int().min(1).max(12).optional(),
            semesterType: z.nativeEnum(SemesterType).optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine(
            (data) =>
                data.semesterNumber !== undefined ||
                data.semesterType !== undefined ||
                data.isDeleted !== undefined,
            { message: "At least one field must be provided for update." }
        ),
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
        // academicYearId is optional for filtering
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required.")
            .optional(),
    }),
});
