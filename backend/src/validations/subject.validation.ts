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
            .min(1, "Subject name is required.")
            .min(3, "Subject name must be at least 3 characters long.")
            .max(100, "Subject name must not exceed 100 characters."),
        abbreviation: z
            .string()
            .min(1, "Abbreviation is required.")
            .min(2, "Abbreviation must be at least 2 characters long.")
            .max(10, "Abbreviation must not exceed 10 characters.")
            .regex(
                /^[A-Z0-9]+$/,
                "Abbreviation must contain only uppercase letters and numbers."
            ),
        code: z
            .string()
            .min(1, "Subject code is required.")
            .min(3, "Subject code must be at least 3 characters long.")
            .max(20, "Subject code must not exceed 20 characters.")
            .regex(
                /^[A-Z0-9]+$/,
                "Subject code must contain only uppercase letters and numbers."
            ),
        type: z.nativeEnum(SubjectType).default(SubjectType.MANDATORY),
        semesterNumber: z
            .number()
            .int("Semester number must be an integer.")
            .min(1, "Semester number must be at least 1.")
            .max(12, "Semester number must not exceed 12."),
        departmentId: z.string().cuid("A valid department ID is required."),
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
                .max(100, "Subject name must not exceed 100 characters.")
                .optional(),
            abbreviation: z
                .string()
                .min(2, "Abbreviation must be at least 2 characters long.")
                .max(10, "Abbreviation must not exceed 10 characters.")
                .regex(
                    /^[A-Z0-9]+$/,
                    "Abbreviation must contain only uppercase letters and numbers."
                )
                .optional(),
            code: z
                .string()
                .min(3, "Subject code must be at least 3 characters long.")
                .max(20, "Subject code must not exceed 20 characters.")
                .regex(
                    /^[A-Z0-9]+$/,
                    "Subject code must contain only uppercase letters and numbers."
                )
                .optional(),
            type: z.nativeEnum(SubjectType).optional(),
            semesterNumber: z
                .number()
                .int("Semester number must be an integer.")
                .min(1, "Semester number must be at least 1.")
                .max(12, "Semester number must not exceed 12.")
                .optional(),
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
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
        semesterNumber: z
            .string()
            .regex(/^\d+$/, "Semester number must be a number.")
            .transform(Number)
            .optional(),
        type: z.nativeEnum(SubjectType).optional(),
        search: z.string().min(1).optional(),
        grouped: z.enum(["true", "false"]).optional(),
        include: z.enum(["relations"]).optional(),
        force: z.enum(["true", "false"]).optional(),
        bySemester: z.enum(["true", "false"]).optional(),
    }),
});

// Schema for count endpoint queries
export const subjectCountQuerySchema = z.object({
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
        bySemester: z.enum(["true", "false"]).optional(),
    }),
});

// Schema for search endpoint
export const subjectSearchQuerySchema = z.object({
    query: z.object({
        q: z
            .string()
            .min(1, "Search term is required.")
            .min(2, "Search term must be at least 2 characters long."),
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
        semesterNumber: z
            .string()
            .regex(/^\d+$/, "Semester number must be a number.")
            .transform(Number)
            .optional(),
    }),
});

// Schema for subject type parameter
export const subjectTypeParamSchema = z.object({
    params: z.object({
        type: z.nativeEnum(SubjectType),
    }),
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required.")
            .optional(),
    }),
});

// Schema for delete with force option
export const subjectDeleteSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid subject ID is required."),
    }),
    query: z.object({
        force: z.enum(["true", "false"]).optional(),
    }),
});
