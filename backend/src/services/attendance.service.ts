/**
 * @file src/services/attendance.service.ts
 * @description Service layer for attendance-related business logic.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Attendance, AttendanceStatus } from "@prisma/client";
import * as ExcelJS from "exceljs";

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
}

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
   * Creates bulk attendance records for a course on a specific date.
   * @param courseId The ID of the course.
   * @param date The date for attendance.
   * @param attendanceData Array of student attendance records.
   * @returns The created attendance records.
   */
  public async createBulkAttendance(
    courseId: string,
    date: string,
    attendanceData: AttendanceRecord[]
  ) {
    const attendanceDate = new Date(date);

    // First, delete any existing attendance for this course and date
    await prisma.attendance.deleteMany({
      where: {
        courseId,
        date: attendanceDate,
      },
    });

    // Create new attendance records
    const createData = attendanceData.map((record) => ({
      courseId,
      studentId: record.studentId,
      date: attendanceDate,
      status: record.status,
    }));

    return prisma.attendance.createMany({
      data: createData,
      skipDuplicates: true,
    });
  }

  /**
   * Gets all courses assigned to a faculty member.
   * @param facultyId The ID of the faculty member.
   * @returns A list of courses with relevant details.
   */
  public async getFacultyCourses(facultyId: string) {
    return prisma.course.findMany({
      where: {
        facultyId,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        division: {
          select: {
            id: true,
            name: true,
          },
        },
        semester: {
          select: {
            id: true,
            semesterNumber: true,
            academicYear: {
              select: {
                id: true,
                year: true,
                isActive: true,
              },
            },
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { semester: { academicYear: { year: "desc" } } },
        { semester: { semesterNumber: "asc" } },
        { subject: { name: "asc" } },
      ],
    });
  }

  /**
   * Gets all students enrolled in a specific course.
   * @param courseId The ID of the course.
   * @returns A list of students enrolled in the course.
   */
  public async getCourseStudents(courseId: string) {
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        courseId,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            enrollmentNumber: true,
            batch: true,
          },
        },
      },
      orderBy: {
        student: {
          enrollmentNumber: "asc",
        },
      },
    });

    return enrollments.map((enrollment) => enrollment.student);
  }

  /**
   * Generates an attendance summary for a specific student across all their enrolled courses.
   * @param studentId The ID of the student.
   * @param semesterId Optional semester filter - if provided, only shows that semester's courses.
   * @returns An array of summaries, one for each course the student is enrolled in.
   */
  public async getSummaryForStudent(studentId: string, semesterId?: string) {
    // Build the where clause - if semesterId is provided, filter by it, otherwise get all enrollments
    const whereClause: any = {
      studentId,
    };

    // Only filter by semester if semesterId is provided and not null/undefined
    if (semesterId) {
      whereClause.course = {
        semesterId: semesterId,
      };
    }

    // Fetch student's enrollments, including course details
    const enrollments = await prisma.studentEnrollment.findMany({
      where: whereClause,
      include: {
        course: {
          include: {
            subject: true,
            faculty: true,
            semester: {
              include: {
                academicYear: true,
              },
            },
          },
        },
      },
      orderBy: {
        course: {
          semester: {
            semesterNumber: "desc", // Show higher semesters first
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
        semesterNumber: course.semester.semesterNumber,
        academicYear: course.semester.academicYear.year,
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

  /**
   * Generates an Excel template for attendance marking with enrolled students.
   * @param courseId The ID of the course.
   * @returns Excel buffer for download.
   */
  public async generateAttendanceTemplate(courseId: string): Promise<Buffer> {
    const students = await this.getCourseStudents(courseId);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Attendance Template");

    // Add headers
    worksheet.columns = [
      { header: "Enrollment Number", key: "enrollmentNumber", width: 20 },
      { header: "Student Name", key: "studentName", width: 30 },
      { header: "Status (1=Present, 0=Absent)", key: "status", width: 25 },
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6E6FA" },
    };

    // Add student data
    students.forEach((student, index) => {
      worksheet.addRow({
        enrollmentNumber: student.enrollmentNumber,
        studentName: student.fullName,
        status: 1, // Default to present
      });
    });

    // Add data validation for status column
    const statusColumn = worksheet.getColumn(3);
    statusColumn.eachCell((cell, rowNumber) => {
      if (rowNumber > 1) {
        cell.dataValidation = {
          type: "list",
          allowBlank: false,
          formulae: ['"0,1"'],
          showErrorMessage: true,
          errorTitle: "Invalid Status",
          error: "Please enter 0 for Absent or 1 for Present",
        };
      }
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}

export const attendanceService = new AttendanceService();
