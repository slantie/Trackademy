/**
 * @file src/validations/student.validation.ts
 * @description Zod validation schemas for student-related API requests.
 */

import { z } from "zod";

// Schema for creating a new student (which also creates a user)
export const createStudentSchema = z.object({
    body: z.object({
        email: z.string().email("A valid email is required."),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long."),
        fullName: z.string().min(1, "Full name is required."),
        enrollmentNumber: z.string().min(1, "Enrollment number is required."),
        batch: z.string().min(1, "Batch is required."),
        departmentId: z.string().cuid("A valid department ID is required."),
        semesterId: z
            .string()
            .cuid("A valid semester instance ID is required."),
        divisionId: z
            .string()
            .cuid("A valid division instance ID is required."),
    }),
});

// Schema for updating an existing student's profile
export const updateStudentSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid student profile ID is required."),
    }),
    body: z
        .object({
            fullName: z.string().min(1).optional(),
            batch: z.string().min(1).optional(),
            // Allow moving a student to a new division/semester
            semesterId: z.string().cuid().optional(),
            divisionId: z.string().cuid().optional(),
            isDeleted: z.boolean().optional(),
        })
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update.",
        }),
});

// Schema for validating a CUID in the URL parameters
export const studentIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid student profile ID is required."),
    }),
});

// Schema for validating query parameters for filtering students
export const studentQuerySchema = z.object({
    query: z.object({
        divisionId: z.string().cuid("A valid division ID is required."),
    }),
});
