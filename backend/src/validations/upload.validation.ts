/**
 * @file src/validations/upload.validation.ts
 * @description Zod schemas for validating data within uploaded Excel files and request bodies.
 */

import { z } from "zod";
import { Designation, SubjectType, SemesterType } from "@prisma/client";

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
