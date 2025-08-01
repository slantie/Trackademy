/**
 * @file src/services/course.service.ts
 * @description API functions for the Course (Offering) module.
 */

import axiosInstance from "../lib/axiosInstance";
import { COURSE_ENDPOINTS } from "../constants/apiEndpoints";
import {
    Course,
    CreateCourseRequest,
    GetAllCoursesResponse,
    CourseResponse,
} from "../interfaces/course.types";

export const getAllCourses = async (divisionId: string): Promise<Course[]> => {
    const response = await axiosInstance.get<GetAllCoursesResponse>(
        COURSE_ENDPOINTS.BASE,
        {
            params: { divisionId },
        }
    );
    return response.data.data.courses;
};

export const createCourse = async (
    data: CreateCourseRequest
): Promise<Course> => {
    const response = await axiosInstance.post<CourseResponse>(
        COURSE_ENDPOINTS.BASE,
        data
    );
    return response.data.data.course;
};

export const deleteCourse = async (id: string): Promise<void> => {
    await axiosInstance.delete(COURSE_ENDPOINTS.BY_ID(id));
};
