/**
 * @file src/validations/upload.validation.ts
 * @description Zod schemas for validating data within uploaded Excel files and request bodies.
 */

import { z } from "zod";
import {
    Designation,
    SubjectType,
    SemesterType,
    ExamType,
    LectureType,
} from "@prisma/client";

// Helper to map various string inputs to the Designation enum
const designationMap: { [key: string]: Designation } = {
    HEADOFDEPARTMENT: Designation.HOD,
    HOD: Designation.HOD,
    PROFESSOR: Designation.PROFESSOR,
    ASSISTANTPROFESSOR: Designation.ASST_PROFESSOR,
    ASSTPROF: Designation.ASST_PROFESSOR,
    LABASSISTANT: Designation.LAB_ASSISTANT,
};

// Schema for a single row in the faculty data Excel file
export const facultyExcelRowSchema = z.object({
    fullName: z.string().min(1, "Full name is required."),
    email: z.string().email("A valid email is required."),
    abbreviation: z.string().min(1).optional().nullable(),
    designation: z
        .string()
        .transform((val) => val.toUpperCase().replace(/\s+/g, ""))
        .refine(
            (val) =>
                Object.keys(designationMap)
                    .map((k) => k.replace(/\s+/g, ""))
                    .includes(val),
            {
                message: `Designation must be a valid role (e.g., 'Head of Department').`,
            }
        )
        .transform(
            (val) =>
                designationMap[
                    Object.keys(designationMap).find(
                        (k) => k.replace(/\s+/g, "") === val
                    )!
                ]
        ),
    department: z.string().min(1, "Department name is required."),
    joiningDate: z.union([z.string(), z.date()]).optional().nullable(),
    college: z.string().min(1, "College abbreviation is required."),
});

// Schema for a single row in the student data Excel file
export const studentExcelRowSchema = z.object({
    studentName: z.string().min(1, "Student Name is required."),
    enrollmentNumber: z.string().min(1, "Enrollment Number is required."),
    department: z.string().min(1, "Department abbreviation is required."),
    semester: z.number().int().min(1, "Semester must be >= 1."),
    division: z.string().min(1, "Division is required."),
    batch: z.string().min(1, "Batch is required."),
    email: z.string().email("A valid Email ID is required."),
    academicYear: z
        .string()
        .regex(/^\d{4}-\d{4}$/, "Academic Year must be in YYYY-YYYY format."),
});

// Schema for a single row in the master subjects Excel file
export const subjectExcelRowSchema = z.object({
    subjectName: z.string().min(1, "Subject Name is required."),
    abbreviation: z.string().min(1, "Abbreviation is required."),
    subjectCode: z.string().min(1, "Subject Code is required."),
    semester: z.number().int().min(1, "Semester must be >= 1."),
    isElective: z
        .string()
        .transform((val) => val.toString().toUpperCase() === "TRUE")
        .default(false),
    department: z.string().min(1, "Department abbreviation is required."),
});

// Schema for validating the body of a faculty matrix upload request
export const facultyMatrixBodySchema = z.object({
    body: z.object({
        academicYear: z
            .string()
            .regex(
                /^\d{4}-\d{4}$/,
                "Academic Year must be in YYYY-YYYY format."
            ),
        semesterType: z.nativeEnum(SemesterType),
        departmentId: z.string().cuid("A valid department ID is required."),
    }),
});

// Schema for validating the body of a results upload request
export const resultsUploadBodySchema = z.object({
    body: z.object({
        examName: z.optional(z.string().min(1, "An exam name is required.")),
        examType: z.nativeEnum(ExamType),
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required."),
        departmentId: z.string().cuid("A valid department ID is required."),
        semesterNumber: z
            .string()
            .transform((val) => parseInt(val))
            .refine((val) => !isNaN(val) && val >= 1, {
                message: "A valid semester number is required.",
            }),
    }),
});

// Schema for validating the body of an attendance upload request
export const attendanceUploadBodySchema = z.object({
    body: z.object({
        // FIX: Require the specific academicYearId to make the lookup unambiguous
        academicYearId: z
            .string()
            .cuid("A valid academic year ID is required."),
        departmentId: z.string().cuid("A valid department ID is required."),
        semesterNumber: z
            .string()
            .regex(/^\d+$/, "Semester number must be a valid number.")
            .transform(Number)
            .refine((num) => num >= 1, {
                message: "Semester number must be at least 1.",
            }),
        divisionId: z.string().cuid("A valid division ID is required."),
        subjectId: z.string().cuid("A valid subject ID is required."),
        lectureType: z.nativeEnum(LectureType),
        batch: z.string().min(1).optional().nullable(),
        date: z
            .string()
            .regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in DD-MM-YYYY format.")
            .transform((dateStr, ctx) => {
                const [day, month, year] = dateStr.split("-").map(Number);
                const date = new Date(year, month - 1, day);
                if (
                    date.getFullYear() !== year ||
                    date.getMonth() !== month - 1 ||
                    date.getDate() !== day
                ) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "The provided date is invalid.",
                    });
                    return z.NEVER;
                }
                return date.toISOString();
            }),
    }),
});

// Schema for validating a single row in the attendance Excel file
export const attendanceExcelRowSchema = z.object({
    enrollmentNumber: z.string().min(1, "Enrollment number is required."),
    status: z
        .number()
        .int()
        .min(0)
        .max(1)
        .transform((val) => (val === 1 ? "PRESENT" : "ABSENT")),
});
