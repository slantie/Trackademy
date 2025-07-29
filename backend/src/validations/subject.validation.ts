/**
 * @file src/validations/subject.validation.ts
 * @description Zod validation schemas for subject-related API requests.
 */

import { z } from "zod";
import { SubjectType } from "@prisma/client";

// Schema for creating a new subject
export const createSubjectSchema = z.object({
    body: z.object({
        name: z
            .string()
            .nonempty("Subject name is required.")
            .min(3, "Subject name must be at least 3 characters long."),
        code: z
            .string()
            .nonempty("Subject code is required.")
            .min(1, "Subject code cannot be empty."),
        type: z.nativeEnum(SubjectType).default(SubjectType.THEORY),
        departmentId: z
            .string()
            .nonempty("Department ID is required.")
            .cuid(),
        semesterId: z
            .string()
            .nonempty("Semester ID is required.")
            .cuid(),
    }),
});

// Schema for updating an existing subject
export const updateSubjectSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid subject ID is required."),
    }),
    body: z
        .object({
            name: z
                .string()
                .min(3, "Subject name must be at least 3 characters long.")
                .optional(),
            code: z.string().min(1, "Subject code cannot be empty.").optional(),
            type: z.nativeEnum(SubjectType).optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine(
            (data) => Object.keys(data).length > 0,
            { message: "At least one field must be provided for update." }
        ),
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
        semesterId: z.string().cuid("A valid semester ID is required."),
    }),
});
