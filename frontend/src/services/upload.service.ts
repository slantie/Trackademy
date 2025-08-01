/**
 * @file src/services/upload.service.ts
 * @description Service layer for handling bulk data upload API calls.
 */

import axiosInstance from "../lib/axiosInstance";
import { UPLOAD_ENDPOINTS } from "../constants/apiEndpoints";
import {
    UploadResponse,
    UploadApiResponse,
    FacultyMatrixUploadRequest,
    ResultsUploadRequest,
    AttendanceUploadRequest,
} from "../interfaces/upload.types";

class UploadService {
    /**
     * Uploads an Excel file containing faculty data.
     */
    public async uploadFaculty(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post<UploadApiResponse>(
            UPLOAD_ENDPOINTS.FACULTY,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.data;
    }

    /**
     * Uploads an Excel file containing master subject data.
     */
    public async uploadSubjects(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosInstance.post<UploadApiResponse>(
            UPLOAD_ENDPOINTS.SUBJECTS,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.data;
    }

    /**
     * Uploads a Faculty Matrix Excel file along with contextual data.
     */
    public async uploadFacultyMatrix(
        file: File,
        data: FacultyMatrixUploadRequest
    ): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("academicYear", data.academicYear);
        formData.append("semesterType", data.semesterType);
        formData.append("departmentId", data.departmentId);

        const response = await axiosInstance.post<UploadApiResponse>(
            UPLOAD_ENDPOINTS.FACULTY_MATRIX,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.data;
    }

    /**
     * Uploads a Results Excel file along with contextual data.
     */
    public async uploadResults(
        file: File,
        data: ResultsUploadRequest
    ): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("examName", data.examName);
        formData.append("examType", data.examType);
        formData.append("academicYearId", data.academicYearId);
        formData.append("departmentId", data.departmentId);
        formData.append("semesterNumber", String(data.semesterNumber));

        const response = await axiosInstance.post<UploadApiResponse>(
            UPLOAD_ENDPOINTS.RESULTS,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.data;
    }

    /**
     * Uploads an Attendance Excel file along with contextual data.
     */
    public async uploadAttendance(
        file: File,
        data: AttendanceUploadRequest
    ): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("academicYearId", data.academicYearId);
        formData.append("departmentId", data.departmentId);
        formData.append("semesterNumber", String(data.semesterNumber));
        formData.append("divisionId", data.divisionId);
        formData.append("subjectId", data.subjectId);
        formData.append("lectureType", data.lectureType);
        formData.append("date", data.date);
        if (data.batch) {
            formData.append("batch", data.batch);
        }

        const response = await axiosInstance.post<UploadApiResponse>(
            UPLOAD_ENDPOINTS.ATTENDANCE,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.data;
    }
}

export const uploadService = new UploadService();
