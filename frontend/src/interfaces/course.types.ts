/**
 * @file src/interfaces/course.types.ts
 * @description Type definitions for the Course (Offering) module.
 */

import { LectureType } from "@/constants/enums";
import { Subject } from "./subject.types";
import { Faculty } from "./faculty.types";

// Represents the structure of a Course object as returned by the API
// This includes nested Subject and Faculty objects for easy display
export interface Course {
    id: string;
    lectureType: LectureType;
    batch?: string | null;
    subjectId: string;
    facultyId: string;
    semesterId: string;
    divisionId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    subject: Pick<Subject, "name" | "code" | "abbreviation">; // Only include necessary fields
    faculty: Pick<Faculty, "fullName" | "abbreviation">;
}

// --- API Request & Response Types ---

// Data required to create a new course offering
export interface CreateCourseRequest {
    subjectId: string;
    facultyId: string;
    semesterId: string;
    divisionId: string;
    lectureType: LectureType;
    batch?: string | null;
}

// The shape of the API response when fetching a list of course offerings
export interface GetAllCoursesResponse {
    status: string;
    results: number;
    data: {
        courses: Course[];
    };
}

// The shape of the API response when creating a single course offering
export interface CourseResponse {
    status: string;
    data: {
        course: Course;
    };
}
