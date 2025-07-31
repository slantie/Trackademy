/**
 * @file src/validations/subject.validation.ts
 * @description Zod validation schemas for master subject-related API requests.
 */

import { z } from "zod";
import { SubjectType } from "@prisma/client";

// Schema for creating a new master subject
export const createSubjectSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Subject name is required."),
        abbreviation: z.string().min(1, "Abbreviation is required."),
        code: z.string().min(1, "Subject code is required."),
        type: z.nativeEnum(SubjectType).default(SubjectType.MANDATORY),
        semesterNumber: z.number().int().min(1, "Semester number is required."),
        departmentId: z.string().cuid("A valid department ID is required."),
    }),
});

// Schema for updating an existing master subject
export const updateSubjectSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid subject ID is required."),
    }),
    body: z
        .object({
            name: z.string().min(1).optional(),
            abbreviation: z.string().min(1).optional(),
            code: z.string().min(1).optional(),
            type: z.nativeEnum(SubjectType).optional(),
            semesterNumber: z.number().int().min(1).optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const subjectIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid subject ID is required."),
    }),
});

// Schema for validating query parameters for filtering subjects
export const subjectQuerySchema = z.object({
    query: z.object({
        departmentId: z.string().cuid("A valid department ID is required."),
        semesterNumber: z
            .string()
            .regex(/^\d+$/, "Semester number must be a number.")
            .transform(Number),
    }),
});
