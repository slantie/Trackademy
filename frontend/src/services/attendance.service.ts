/**
 * @file src/services/attendance.service.ts
 * @description API functions for the Attendance module.
 */

import axiosInstance from "../lib/axiosInstance";
import { ATTENDANCE_ENDPOINTS } from "../constants/apiEndpoints";
import {
    AttendanceRecord,
    AttendanceSummary,
    UpdateAttendanceRequest,
    GetAttendanceByCourseResponse,
    GetAttendanceSummaryResponse,
    AttendanceResponse,
} from "../interfaces/attendance.types";

export const getAttendanceByCourseAndDate = async ({
    courseId,
    date,
}: {
    courseId: string;
    date: string;
}): Promise<AttendanceRecord[]> => {
    const response = await axiosInstance.get<GetAttendanceByCourseResponse>(
        ATTENDANCE_ENDPOINTS.BASE,
        {
            params: { courseId, date },
        }
    );
    return response.data.data.attendance;
};

export const getMyAttendanceSummary = async (
    semesterId: string
): Promise<AttendanceSummary[]> => {
    const response = await axiosInstance.get<GetAttendanceSummaryResponse>(
        ATTENDANCE_ENDPOINTS.BASE,
        {
            params: { semesterId },
        }
    );
    return response.data.data.attendance;
};

export const updateAttendance = async ({
    id,
    data,
}: {
    id: string;
    data: UpdateAttendanceRequest;
}): Promise<AttendanceRecord> => {
    const response = await axiosInstance.patch<AttendanceResponse>(
        ATTENDANCE_ENDPOINTS.BY_ID(id),
        data
    );
    return response.data.data.attendance;
};
