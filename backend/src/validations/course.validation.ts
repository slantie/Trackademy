/**
 * @file src/validations/course.validation.ts
 * @description Zod validation schemas for course offering related API requests.
 */

import { z } from "zod";
import { LectureType } from "@prisma/client";

// Schema for creating a new course offering
export const createCourseSchema = z.object({
    body: z.object({
        lectureType: z.nativeEnum(LectureType),
        batch: z.string().optional().nullable(),
        subjectId: z.string().cuid("A valid master subject ID is required."),
        facultyId: z.string().cuid("A valid master faculty ID is required."),
        semesterId: z
            .string()
            .cuid("A valid semester instance ID is required."),
        divisionId: z
            .string()
            .cuid("A valid division instance ID is required."),
    }),
});

// Schema for validating a CUID in the URL parameters
export const courseIdParamSchema = z.object({
    params: z.object({
        id: z.string().cuid("A valid course offering ID is required."),
    }),
});

// Schema for validating query parameters for filtering course offerings
export const courseQuerySchema = z.object({
    query: z.object({
        divisionId: z.string().cuid("A valid division ID is required."),
    }),
});
