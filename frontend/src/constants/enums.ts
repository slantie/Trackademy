/**
 * @file src/constants/enums.ts
 * @description Defines and exports shared enums to be used across the frontend application,
 * ensuring consistency with the backend Prisma schema.
 */

export enum Role {
    STUDENT = "STUDENT",
    FACULTY = "FACULTY",
    ADMIN = "ADMIN",
}

export enum Designation {
    HOD = "HOD",
    PROFESSOR = "PROFESSOR",
    ASST_PROFESSOR = "ASST_PROFESSOR",
    LAB_ASSISTANT = "LAB_ASSISTANT",
}

export enum SemesterType {
    ODD = "ODD",
    EVEN = "EVEN",
}

export enum SubjectType {
    MANDATORY = "MANDATORY",
    ELECTIVE = "ELECTIVE",
}

export enum LectureType {
    THEORY = "THEORY",
    PRACTICAL = "PRACTICAL",
}

export enum ExamType {
    MIDTERM = "MIDTERM",
    REMEDIAL = "REMEDIAL",
    FINAL = "FINAL",
    REPEAT = "REPEAT",
}

export enum ResultStatus {
    PASS = "PASS",
    FAIL = "FAIL",
    TRIAL = "TRIAL",
    ABSENT = "ABSENT",
    WITHHELD = "WITHHELD",
}

export enum AttendanceStatus {
    PRESENT = "PRESENT",
    ABSENT = "ABSENT",
    MEDICAL_LEAVE = "MEDICAL_LEAVE",
    AUTHORIZED_LEAVE = "AUTHORIZED_LEAVE",
}
