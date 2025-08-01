/**
 * @file src/services/student.service.ts
 * @description API functions for the Student module.
 */

import axiosInstance from "../lib/axiosInstance";
import { STUDENT_ENDPOINTS } from "../constants/apiEndpoints";
import {
    Student,
    CreateStudentRequest,
    UpdateStudentRequest,
    GetAllStudentsResponse,
    StudentResponse,
} from "../interfaces/student.types";

export const getAllStudents = async (
    divisionId: string
): Promise<Student[]> => {
    const response = await axiosInstance.get<GetAllStudentsResponse>(
        STUDENT_ENDPOINTS.BASE,
        {
            params: { divisionId },
        }
    );
    return response.data.data.students;
};

export const createStudent = async (
    data: CreateStudentRequest
): Promise<Student> => {
    const response = await axiosInstance.post<StudentResponse>(
        STUDENT_ENDPOINTS.BASE,
        data
    );
    return response.data.data.student;
};

export const updateStudent = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateStudentRequest;
}): Promise<Student> => {
    const response = await axiosInstance.patch<StudentResponse>(
        STUDENT_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.student;
};

export const deleteStudent = async (id: string): Promise<void> => {
    await axiosInstance.delete(STUDENT_ENDPOINTS.BY_ID(id));
};
