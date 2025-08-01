/**
 * @file src/interfaces/attendance.types.ts
 * @description Type definitions for the Attendance module.
 */

import { AttendanceStatus, LectureType } from "@/constants/enums";
import { Student } from "./student.types";

// Represents a single, raw attendance record, typically for faculty view
export interface AttendanceRecord {
    id: string;
    date: string;
    status: AttendanceStatus;
    courseId: string;
    studentId: string;
    student: Pick<Student, "id" | "fullName" | "enrollmentNumber">;
}

// Represents a calculated summary of attendance for a student in one course
export interface AttendanceSummary {
    courseId: string;
    subjectName: string;
    subjectCode: string;
    facultyName: string;
    lectureType: LectureType;
    batch: string | null;
    presentCount: number;
    absentCount: number;
    totalLectures: number;
    percentage: number;
}

// --- API Request & Response Types ---

// Data required to update an existing attendance record
export interface UpdateAttendanceRequest {
    status: AttendanceStatus;
}

// The shape of the API response when fetching raw attendance records (for faculty)
export interface GetAttendanceByCourseResponse {
    status: string;
    results: number;
    data: {
        attendance: AttendanceRecord[];
    };
}

// The shape of the API response when fetching an attendance summary (for students)
export interface GetAttendanceSummaryResponse {
    status: string;
    results: number;
    data: {
        attendance: AttendanceSummary[];
    };
}

// The shape of the API response when updating a single attendance record
export interface AttendanceResponse {
    status: string;
    data: {
        attendance: AttendanceRecord;
    };
}
