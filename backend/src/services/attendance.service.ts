/**
 * @file src/services/attendance.service.ts
 * @description Service layer for attendance-related business logic.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Attendance, AttendanceStatus } from "@prisma/client";

class AttendanceService {
  /**
   * Retrieves all attendance records for a specific course on a given date.
   * @param courseId The ID of the course.
   * @param date The date for which to fetch attendance.
   * @returns A list of attendance records.
   */
  public async getByCourseAndDate(
    courseId: string,
    date: string
  ): Promise<Attendance[]> {
    return prisma.attendance.findMany({
      where: {
        courseId,
        date: new Date(date),
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            enrollmentNumber: true,
          },
        },
      },
    });
  }

  /**
   * Generates an attendance summary for a specific student in a given semester.
   * @param studentId The ID of the student.
   * @param semesterId The ID of the semester instance.
   * @returns An array of summaries, one for each course the student is enrolled in.
   */
  public async getSummaryForStudent(studentId: string, semesterId: string) {
    // --- Start of modified logic ---
    // Fetch student's enrollments for the given semester, including course details
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        studentId,
        course: {
          semesterId: semesterId,
        },
      },
      include: {
        course: {
          include: {
            subject: true,
            faculty: true,
          },
        },
      },
    });

    // If no enrollments, return an empty summary
    if (!enrollments || enrollments.length === 0) {
      return [];
    }

    const courses = enrollments.map((e) => e.course);
    const courseIds = courses.map((c) => c.id);
    // --- End of modified logic ---

    const attendanceRecords = await prisma.attendance.groupBy({
      by: ["courseId", "status"],
      where: {
        studentId,
        courseId: { in: courseIds },
      },
      _count: {
        status: true,
      },
    });

    const summary = courses.map((course) => {
      const presentCount =
        attendanceRecords.find(
          (r) => r.courseId === course.id && r.status === "PRESENT"
        )?._count.status || 0;
      const absentCount =
        attendanceRecords.find(
          (r) => r.courseId === course.id && r.status === "ABSENT"
        )?._count.status || 0;
      const totalLectures = presentCount + absentCount;
      const percentage =
        totalLectures > 0 ? (presentCount / totalLectures) * 100 : 0;

      return {
        courseId: course.id,
        subjectName: course.subject.name,
        subjectCode: course.subject.code,
        facultyName: course.faculty.fullName,
        lectureType: course.lectureType,
        batch: course.batch,
        presentCount,
        absentCount,
        totalLectures,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });

    return summary;
  }

  /**
   * Updates the status of a single attendance record.
   * @param id The ID of the attendance record to update.
   * @param status The new attendance status.
   * @returns The updated attendance record.
   */
  public async updateStatus(
    id: string,
    status: AttendanceStatus
  ): Promise<Attendance> {
    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });
    if (!attendance) throw new AppError("Attendance record not found.", 404);

    return prisma.attendance.update({
      where: { id },
      data: { status },
    });
  }
}

export const attendanceService = new AttendanceService();
