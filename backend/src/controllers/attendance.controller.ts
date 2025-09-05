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
        // Student role - show attendance summary for all enrolled courses
        const { semesterId } = req.query;
        const studentProfile = await prisma.student.findUnique({
          where: { userId: user.userId },
        });
        if (!studentProfile)
          throw new AppError("Student profile not found.", 404);

        // If semesterId is provided, filter by that semester, otherwise show all courses
        attendanceData = await attendanceService.getSummaryForStudent(
          studentProfile.id,
          semesterId as string | undefined
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

  static async createAttendance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId, date, attendanceData } = req.body;
      const user = (req as any).user;

      // Verify faculty has access to this course
      if (user.role === Role.FACULTY) {
        const facultyProfile = await prisma.faculty.findUnique({
          where: { userId: user.userId },
        });
        if (!facultyProfile) {
          throw new AppError("Faculty profile not found.", 404);
        }

        const course = await prisma.course.findFirst({
          where: {
            id: courseId,
            facultyId: facultyProfile.id,
          },
        });
        if (!course) {
          throw new AppError("You don't have access to this course.", 403);
        }
      }

      const createdAttendance = await attendanceService.createBulkAttendance(
        courseId,
        date,
        attendanceData
      );

      res.status(201).json({
        status: "success",
        data: { attendance: createdAttendance },
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

  static async getFacultyCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;

      if (user.role !== Role.FACULTY) {
        throw new AppError("Only faculty can access this resource.", 403);
      }

      const facultyProfile = await prisma.faculty.findUnique({
        where: { userId: user.userId },
      });
      if (!facultyProfile) {
        throw new AppError("Faculty profile not found.", 404);
      }

      const courses = await attendanceService.getFacultyCourses(
        facultyProfile.id
      );

      res.status(200).json({
        status: "success",
        results: courses.length,
        data: { courses },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCourseStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const user = (req as any).user;

      // Verify faculty has access to this course
      if (user.role === Role.FACULTY) {
        const facultyProfile = await prisma.faculty.findUnique({
          where: { userId: user.userId },
        });
        if (!facultyProfile) {
          throw new AppError("Faculty profile not found.", 404);
        }

        const course = await prisma.course.findFirst({
          where: {
            id: courseId,
            facultyId: facultyProfile.id,
          },
        });
        if (!course) {
          throw new AppError("You don't have access to this course.", 403);
        }
      }

      const students = await attendanceService.getCourseStudents(courseId);

      res.status(200).json({
        status: "success",
        results: students.length,
        data: { students },
      });
    } catch (error) {
      next(error);
    }
  }

  static async downloadAttendanceTemplate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const user = (req as any).user;

      // Verify faculty has access to this course
      if (user.role === Role.FACULTY) {
        const facultyProfile = await prisma.faculty.findUnique({
          where: { userId: user.userId },
        });
        if (!facultyProfile) {
          throw new AppError("Faculty profile not found.", 404);
        }

        const course = await prisma.course.findFirst({
          where: {
            id: courseId,
            facultyId: facultyProfile.id,
          },
        });
        if (!course) {
          throw new AppError("You don't have access to this course.", 403);
        }
      }

      const template = await attendanceService.generateAttendanceTemplate(
        courseId
      );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="attendance_template_${courseId}.xlsx"`
      );

      res.send(template);
    } catch (error) {
      next(error);
    }
  }
}
