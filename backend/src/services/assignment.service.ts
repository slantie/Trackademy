/**
 * @file src/services/assignment.service.ts
 * @description Service layer for assignment-related business logic with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Assignment, SubmissionStatus } from "@prisma/client";

interface AssignmentCreateData {
  title: string;
  description?: string;
  dueDate: Date;
  totalMarks: number;
  courseId: string;
}

type AssignmentUpdateData = Partial<Omit<AssignmentCreateData, "courseId">> & {
  isDeleted?: boolean;
};

interface AssignmentQueryOptions {
  courseId?: string;
  facultyId?: string;
  facultyUserId?: string;
  includeDeleted?: boolean;
  includePastDue?: boolean;
  sortBy?: "dueDate" | "title" | "createdAt";
  sortOrder?: "asc" | "desc";
}

class AssignmentService {
  /**
   * Creates a new assignment.
   * @param data - The data for the new assignment.
   * @param facultyUserId - The user ID of the faculty creating the assignment.
   * @returns The newly created assignment.
   */
  public async create(
    data: AssignmentCreateData,
    facultyUserId: string
  ): Promise<Assignment> {
    // First, get the faculty record from the user ID
    const faculty = await prisma.faculty.findUnique({
      where: { userId: facultyUserId, isDeleted: false },
    });

    if (!faculty) {
      throw new AppError("Faculty record not found.", 404);
    }

    // Verify that the faculty is assigned to the course
    const course = await prisma.course.findUnique({
      where: {
        id: data.courseId,
        isDeleted: false,
      },
      include: {
        faculty: true,
        subject: true,
        division: true,
        semester: true,
      },
    });

    if (!course) {
      throw new AppError("Course not found.", 404);
    }

    if (course.facultyId !== faculty.id) {
      throw new AppError(
        "You are not authorized to create assignments for this course.",
        403
      );
    }

    // Validate due date is in the future
    if (new Date(data.dueDate) <= new Date()) {
      throw new AppError("Due date must be in the future.", 400);
    }

    // Validate total marks is positive
    if (data.totalMarks <= 0) {
      throw new AppError("Total marks must be greater than 0.", 400);
    }

    return prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        totalMarks: data.totalMarks,
        courseId: data.courseId,
      },
      include: {
        course: {
          include: {
            subject: true,
            faculty: true,
            division: true,
            semester: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });
  }

  /**
   * Gets all assignments with optional filtering.
   */
  public async getAll(options: AssignmentQueryOptions = {}) {
    const {
      courseId,
      facultyId,
      facultyUserId,
      includeDeleted = false,
      includePastDue = true,
      sortBy = "dueDate",
      sortOrder = "desc",
    } = options;

    const where: any = {};

    if (!includeDeleted) {
      where.isDeleted = false;
    }

    if (courseId) {
      where.courseId = courseId;
    }

    if (facultyId) {
      where.course = {
        facultyId: facultyId,
      };
    }

    if (facultyUserId) {
      where.course = {
        faculty: {
          userId: facultyUserId,
        },
      };
    }

    if (!includePastDue) {
      where.dueDate = {
        gte: new Date(),
      };
    }

    const orderBy: any = {};
    if (sortBy === "dueDate" || sortBy === "title" || sortBy === "createdAt") {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.dueDate = "desc";
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: {
          include: {
            subject: true,
            faculty: {
              select: {
                id: true,
                fullName: true,
                abbreviation: true,
              },
            },
            division: true,
            semester: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy,
    });

    return { data: assignments };
  }

  /**
   * Gets assignments for a specific student (based on their enrollments).
   */
  public async getForStudent(
    studentUserId: string,
    options: AssignmentQueryOptions = {}
  ) {
    const {
      includeDeleted = false,
      includePastDue = true,
      sortBy = "dueDate",
      sortOrder = "desc",
    } = options;

    // Get student record from user ID
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId, isDeleted: false },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!student) {
      throw new AppError("Student not found.", 404);
    }

    const courseIds = student.enrollments.map(
      (enrollment) => enrollment.courseId
    );

    const where: any = {
      courseId: {
        in: courseIds,
      },
    };

    if (!includeDeleted) {
      where.isDeleted = false;
    }

    if (!includePastDue) {
      where.dueDate = {
        gte: new Date(),
      };
    }

    const orderBy: any = {};
    if (sortBy === "dueDate" || sortBy === "title" || sortBy === "createdAt") {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.dueDate = "desc";
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: {
          include: {
            subject: true,
            faculty: {
              select: {
                id: true,
                fullName: true,
                abbreviation: true,
              },
            },
            division: true,
            semester: true,
          },
        },
        submissions: {
          where: {
            studentId: student.id,
            isDeleted: false,
          },
          select: {
            id: true,
            status: true,
            submittedAt: true,
            marksAwarded: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy,
    });

    return { data: assignments };
  }

  /**
   * Retrieves a single assignment by its ID.
   */
  public async getById(
    id: string,
    studentUserId?: string
  ): Promise<Assignment> {
    const includeOptions: any = {
      course: {
        include: {
          subject: true,
          faculty: {
            select: {
              id: true,
              fullName: true,
              abbreviation: true,
            },
          },
          division: true,
          semester: true,
        },
      },
      _count: {
        select: {
          submissions: true,
        },
      },
    };

    // If studentUserId is provided, include the student's submission for this assignment
    if (studentUserId) {
      // First get the student record
      const student = await prisma.student.findUnique({
        where: { userId: studentUserId, isDeleted: false },
      });

      if (student) {
        includeOptions.submissions = {
          where: {
            studentId: student.id,
            isDeleted: false,
          },
        };
      }
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id, isDeleted: false },
      include: includeOptions,
    });

    if (!assignment) {
      throw new AppError("Assignment not found.", 404);
    }

    return assignment;
  }

  /**
   * Updates an existing assignment.
   */
  public async update(
    id: string,
    data: AssignmentUpdateData,
    facultyUserId: string
  ): Promise<Assignment> {
    // First, get the faculty record from the user ID
    const faculty = await prisma.faculty.findUnique({
      where: { userId: facultyUserId, isDeleted: false },
    });

    if (!faculty) {
      throw new AppError("Faculty record not found.", 404);
    }

    const existingAssignment = await prisma.assignment.findUnique({
      where: { id, isDeleted: false },
      include: {
        course: true,
      },
    });

    if (!existingAssignment) {
      throw new AppError("Assignment not found.", 404);
    }

    // Verify faculty authorization
    if (existingAssignment.course.facultyId !== faculty.id) {
      throw new AppError(
        "You are not authorized to update this assignment.",
        403
      );
    }

    // If updating due date, validate it's in the future
    if (data.dueDate && new Date(data.dueDate) <= new Date()) {
      throw new AppError("Due date must be in the future.", 400);
    }

    // If updating total marks, validate it's positive
    if (data.totalMarks !== undefined && data.totalMarks <= 0) {
      throw new AppError("Total marks must be greater than 0.", 400);
    }

    return prisma.assignment.update({
      where: { id },
      data,
      include: {
        course: {
          include: {
            subject: true,
            faculty: true,
            division: true,
            semester: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });
  }

  /**
   * Soft deletes an assignment.
   */
  public async delete(id: string, facultyUserId: string): Promise<void> {
    // First, get the faculty record from the user ID
    const faculty = await prisma.faculty.findUnique({
      where: { userId: facultyUserId, isDeleted: false },
    });

    if (!faculty) {
      throw new AppError("Faculty record not found.", 404);
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id, isDeleted: false },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      throw new AppError("Assignment not found.", 404);
    }

    // Verify faculty authorization
    if (assignment.course.facultyId !== faculty.id) {
      throw new AppError(
        "You are not authorized to delete this assignment.",
        403
      );
    }

    await prisma.assignment.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  /**
   * Gets assignment statistics for a course.
   */
  public async getStatistics(courseId: string, facultyUserId: string) {
    // First, get the faculty record from the user ID
    const faculty = await prisma.faculty.findUnique({
      where: { userId: facultyUserId, isDeleted: false },
    });

    if (!faculty) {
      throw new AppError("Faculty record not found.", 404);
    }

    // Verify faculty authorization
    const course = await prisma.course.findUnique({
      where: { id: courseId, facultyId: faculty.id, isDeleted: false },
    });

    if (!course) {
      throw new AppError("Course not found or you are not authorized.", 404);
    }

    const [
      totalAssignments,
      activeAssignments,
      overdueAssignments,
      totalSubmissions,
      gradedSubmissions,
      pendingSubmissions,
    ] = await Promise.all([
      prisma.assignment.count({
        where: { courseId, isDeleted: false },
      }),
      prisma.assignment.count({
        where: {
          courseId,
          isDeleted: false,
          dueDate: { gte: new Date() },
        },
      }),
      prisma.assignment.count({
        where: {
          courseId,
          isDeleted: false,
          dueDate: { lt: new Date() },
        },
      }),
      prisma.submission.count({
        where: {
          assignment: { courseId },
          isDeleted: false,
        },
      }),
      prisma.submission.count({
        where: {
          assignment: { courseId },
          status: SubmissionStatus.GRADED,
          isDeleted: false,
        },
      }),
      prisma.submission.count({
        where: {
          assignment: { courseId },
          status: {
            in: [SubmissionStatus.SUBMITTED, SubmissionStatus.PENDING_REVIEW],
          },
          isDeleted: false,
        },
      }),
    ]);

    return {
      totalAssignments,
      activeAssignments,
      overdueAssignments,
      totalSubmissions,
      gradedSubmissions,
      pendingSubmissions,
      averageSubmissionsPerAssignment:
        totalAssignments > 0
          ? (totalSubmissions / totalAssignments).toFixed(2)
          : "0.00",
    };
  }
}

export const assignmentService = new AssignmentService();
