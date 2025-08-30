/**
 * @file src/validations/semester.validation.ts
 * @description Enhanced Zod validation schemas for semester-related API requests with comprehensive validation.
 */

import { z } from "zod";
import { SemesterType } from "@prisma/client";

// Schema for creating a new semester instance
export const createSemesterSchema = z.object({
    body: z.object({
        semesterNumber: z
            .number()
            .int()
            .min(1, "Semester number must be at least 1")
            .max(12, "Semester number cannot exceed 12"),
        semesterType: z.nativeEnum(SemesterType),
        departmentId: z.string().cuid("A valid department ID is required"),
        academicYearId: z.string().cuid("A valid academic year ID is required"),
    }),
});

// Schema for updating an existing semester instance
export const updateSemesterSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid semester ID is required"),
    }),
    body: z
        .object({
            semesterNumber: z
                .number()
                .int()
                .min(1, "Semester number must be at least 1")
                .max(12, "Semester number cannot exceed 12")
                .optional(),
            semesterType: z.nativeEnum(SemesterType).optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        }),
});

// Schema for validating a CUID in the URL parameters
export const semesterIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid semester ID is required"),
    }),
});

// Schema for validating query parameters for getting all semesters
export const getAllSemestersQuerySchema = z.object({
    query: z.object({
        page: z
            .string()
            .regex(/^\d+$/, "Page must be a positive integer")
            .transform(Number)
            .refine((val) => val > 0, "Page must be greater than 0")
            .optional(),
        limit: z
            .string()
            .regex(/^\d+$/, "Limit must be a positive integer")
            .transform(Number)
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            )
            .optional(),
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
            .optional(),
        semesterNumber: z
            .string()
            .regex(/^\d+$/, "Semester number must be a positive integer")
            .transform(Number)
            .refine(
                (val) => val >= 1 && val <= 12,
                "Semester number must be between 1 and 12"
            )
            .optional(),
        semesterType: z.nativeEnum(SemesterType).optional(),
        search: z.string().min(1, "Search query cannot be empty").optional(),
        includeDeleted: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
    }),
});

// Schema for count endpoint
export const getSemesterCountQuerySchema = z.object({
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
            .optional(),
        semesterNumber: z
            .string()
            .regex(/^\d+$/, "Semester number must be a positive integer")
            .transform(Number)
            .refine(
                (val) => val >= 1 && val <= 12,
                "Semester number must be between 1 and 12"
            )
            .optional(),
        semesterType: z.nativeEnum(SemesterType).optional(),
        search: z.string().min(1, "Search query cannot be empty").optional(),
        includeDeleted: z
            .enum(["true", "false"])
            .transform((val) => val === "true")
            .optional(),
    }),
});

// Schema for search endpoint
export const searchSemestersQuerySchema = z.object({
    query: z.object({
        q: z.string().min(1, "Search query cannot be empty"),
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
            .optional(),
        limit: z
            .string()
            .regex(/^\d+$/, "Limit must be a positive integer")
            .transform(Number)
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            )
            .optional(),
    }),
});

// Schema for semester number param
export const semesterNumberParamSchema = z.object({
    params: z.object({
        semesterNumber: z
            .string()
            .regex(/^\d+$/, "Semester number must be a positive integer")
            .transform(Number)
            .refine(
                (val) => val >= 1 && val <= 12,
                "Semester number must be between 1 and 12"
            ),
    }),
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
            .optional(),
    }),
});

// Schema for semester type param
export const semesterTypeParamSchema = z.object({
    params: z.object({
        semesterType: z.nativeEnum(SemesterType),
    }),
    query: z.object({
        departmentId: z
            .string()
            .cuid("A valid department ID is required")
            .optional(),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required")
            .optional(),
        limit: z
            .string()
            .regex(/^\d+$/, "Limit must be a positive integer")
            .transform(Number)
            .refine(
                (val) => val > 0 && val <= 100,
                "Limit must be between 1 and 100"
            )
            .optional(),
    }),
});

// Schema for validating query parameters for filtering semesters by department and year
export const semesterQuerySchema = z.object({
    query: z.object({
        departmentId: z.string().cuid("A valid department ID is required"),
        academicYearId: z.string().cuid("A valid academic year ID is required"),
    }),
});
