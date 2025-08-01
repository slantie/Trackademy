/**
 * @file src/controllers/attendance.controller.ts
 * @description Controller for handling attendance-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { attendanceService } from "../services/attendance.service";
import AppError from "../utils/appError";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma.service";

export class AttendanceController {
    static async getAttendance(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = (req as any).user;
            let attendanceData;

            if (user.role === Role.ADMIN || user.role === Role.FACULTY) {
                const { courseId, date } = req.query;
                if (!courseId || !date)
                    throw new AppError(
                        "Course ID and Date are required for this role.",
                        400
                    );
                attendanceData = await attendanceService.getByCourseAndDate(
                    courseId as string,
                    date as string
                );
            } else {
                // Student role
                const { semesterId } = req.query;
                if (!semesterId)
                    throw new AppError(
                        "Semester ID is required for students.",
                        400
                    );
                const studentProfile = await prisma.student.findUnique({
                    where: { userId: user.userId },
                });
                if (!studentProfile)
                    throw new AppError("Student profile not found.", 404);
                attendanceData = await attendanceService.getSummaryForStudent(
                    studentProfile.id,
                    semesterId as string
                );
            }

            res.status(200).json({
                status: "success",
                results: attendanceData.length,
                data: { attendance: attendanceData },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateAttendance(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedAttendance = await attendanceService.updateStatus(
                req.params.id,
                req.body.status
            );
            res.status(200).json({
                status: "success",
                data: { attendance: updatedAttendance },
            });
        } catch (error) {
            next(error);
        }
    }
}
