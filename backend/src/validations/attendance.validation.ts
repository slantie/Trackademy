/**
 * @file src/validations/attendance.validation.ts
 * @description Zod validation schemas for attendance-related API requests.
 */

import { z } from "zod";
import { AttendanceStatus } from "@prisma/client";

// Schema for creating a single attendance record
export const createAttendanceSchema = z.object({
    body: z.object({
        date: z
            .string()
            .datetime({ message: "A valid ISO date string is required." }),
        status: z.nativeEnum(AttendanceStatus),
        courseId: z.string().cuid("A valid course ID is required."),
        studentId: z.string().cuid("A valid student ID is required."),
    }),
});

// Schema for updating a single attendance record
export const updateAttendanceSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid attendance record ID is required."),
    }),
    body: z.object({
        status: z.nativeEnum(AttendanceStatus),
    }),
});

// Schema for validating a CUID in the URL parameters
export const attendanceIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid attendance record ID is required."),
    }),
});

// Schema for validating query parameters for fetching attendance
export const attendanceQuerySchema = z.object({
    query: z
        .object({
            // For Faculty:
            courseId: z.string().cuid().optional(),
            date: z
                .string()
                .datetime({ message: "A valid ISO date string is required." })
                .optional(),
            // For Student:
            semesterId: z.string().cuid().optional(),
        })
        .refine((data) => data.courseId || data.semesterId, {
            message:
                "Either courseId (for faculty) or semesterId (for students) must be provided.",
        }),
});
