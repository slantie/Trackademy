/**
 * @file src/services/submission.service.ts
 * @description Service layer for submission-related business logic with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Submission, SubmissionStatus } from "@prisma/client";

interface SubmissionCreateData {
  content?: string;
  filePath?: string;
  assignmentId: string;
}

interface SubmissionUpdateData {
  content?: string;
  filePath?: string;
}

interface SubmissionGradeData {
  marksAwarded: number;
  feedback?: string;
}

interface SubmissionQueryOptions {
  assignmentId?: string;
  studentId?: string;
  status?: SubmissionStatus;
  includeDeleted?: boolean;
  sortBy?: "submittedAt" | "marksAwarded" | "gradedAt";
  sortOrder?: "asc" | "desc";
}

class SubmissionService {
  /**
   * Creates a new submission by a student.
   */
  public async create(
    data: SubmissionCreateData,
    studentUserId: string
  ): Promise<Submission> {
    // First, get the student record from the user ID
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId, isDeleted: false },
    });

    if (!student) {
      throw new AppError("Student record not found.", 404);
    }

    // Verify assignment exists and is not deleted
    const assignment = await prisma.assignment.findUnique({
      where: { id: data.assignmentId, isDeleted: false },
      include: {
        course: {
          include: {
            enrollments: {
              where: { studentId: student.id },
            },
          },
        },
      },
    });

    if (!assignment) {
      throw new AppError("Assignment not found.", 404);
    }

    // Verify student is enrolled in the course
    if (assignment.course.enrollments.length === 0) {
      throw new AppError("You are not enrolled in this course.", 403);
    }

    // Check if assignment is past due
    if (new Date() > assignment.dueDate) {
      throw new AppError("Assignment submission deadline has passed.", 400);
    }

    // Check if student has already submitted
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId: data.assignmentId,
          studentId: student.id,
        },
      },
    });

    if (existingSubmission && !existingSubmission.isDeleted) {
      throw new AppError("You have already submitted this assignment.", 409);
    }

    // Validate submission has content or file
    if (!data.content && !data.filePath) {
      throw new AppError("Submission must have either content or a file.", 400);
    }

    return prisma.submission.create({
      data: {
        content: data.content,
        filePath: data.filePath,
        assignmentId: data.assignmentId,
        studentId: student.id,
        status: SubmissionStatus.SUBMITTED,
      },
      include: {
        assignment: {
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
              },
            },
          },
        },
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
   * Gets all submissions with optional filtering.
   */
  public async getAll(options: SubmissionQueryOptions = {}) {
    const {
      assignmentId,
      studentId,
      status,
      includeDeleted = false,
      sortBy = "submittedAt",
      sortOrder = "desc",
    } = options;

    const where: any = {};

    if (!includeDeleted) {
      where.isDeleted = false;
    }

    if (assignmentId) {
      where.assignmentId = assignmentId;
    }

    if (studentId) {
      where.studentId = studentId;
    }

    if (status) {
      where.status = status;
    }

    const orderBy: any = {};
    if (
      sortBy === "submittedAt" ||
      sortBy === "marksAwarded" ||
      sortBy === "gradedAt"
    ) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.submittedAt = "desc";
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        assignment: {
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
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            fullName: true,
            enrollmentNumber: true,
          },
        },
      },
      orderBy,
    });

    return { data: submissions };
  }

  /**
   * Gets submissions for a specific assignment (faculty view).
   */
  public async getForAssignment(
    assignmentId: string,
    facultyUserId: string,
    options: SubmissionQueryOptions = {}
  ) {
    // First, get the faculty record from the user ID
    const faculty = await prisma.faculty.findUnique({
      where: { userId: facultyUserId, isDeleted: false },
    });

    if (!faculty) {
      throw new AppError("Faculty record not found.", 404);
    }

    // Verify faculty authorization
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId, isDeleted: false },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      throw new AppError("Assignment not found.", 404);
    }

    if (assignment.course.facultyId !== faculty.id) {
      throw new AppError(
        "You are not authorized to view submissions for this assignment.",
        403
      );
    }

    const {
      status,
      includeDeleted = false,
      sortBy = "submittedAt",
      sortOrder = "desc",
    } = options;

    const where: any = {
      assignmentId,
    };

    if (!includeDeleted) {
      where.isDeleted = false;
    }

    if (status) {
      where.status = status;
    }

    const orderBy: any = {};
    if (
      sortBy === "submittedAt" ||
      sortBy === "marksAwarded" ||
      sortBy === "gradedAt"
    ) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.submittedAt = "desc";
    }

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            totalMarks: true,
            dueDate: true,
          },
        },
        student: {
          select: {
            id: true,
            fullName: true,
            enrollmentNumber: true,
            batch: true,
          },
        },
      },
      orderBy,
    });

    return { data: submissions };
  }

  /**
   * Retrieves a single submission by its ID.
   */
  public async getById(
    id: string,
    userId?: string,
    userRole?: string
  ): Promise<Submission> {
    const submission = await prisma.submission.findUnique({
      where: { id, isDeleted: false },
      include: {
        assignment: {
          include: {
            course: {
              include: {
                subject: true,
                faculty: {
                  select: {
                    id: true,
                    fullName: true,
                    abbreviation: true,
                    userId: true,
                  },
                },
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            fullName: true,
            enrollmentNumber: true,
            userId: true,
          },
        },
      },
    });

    if (!submission) {
      throw new AppError("Submission not found.", 404);
    }

    // Authorization check
    if (userId && userRole !== "ADMIN") {
      const isStudent =
        userRole === "STUDENT" && submission.student.userId === userId;
      const isFaculty =
        userRole === "FACULTY" &&
        submission.assignment.course.faculty.userId === userId;

      if (!isStudent && !isFaculty) {
        throw new AppError(
          "You are not authorized to view this submission.",
          403
        );
      }
    }

    return submission;
  }

  /**
   * Updates a submission by a student (before grading).
   */
  public async update(
    id: string,
    data: SubmissionUpdateData,
    studentUserId: string
  ): Promise<Submission> {
    // First, get the student record from the user ID
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId, isDeleted: false },
    });

    if (!student) {
      throw new AppError("Student record not found.", 404);
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: { id, isDeleted: false },
      include: {
        assignment: true,
      },
    });

    if (!existingSubmission) {
      throw new AppError("Submission not found.", 404);
    }

    // Verify student authorization
    if (existingSubmission.studentId !== student.id) {
      throw new AppError(
        "You are not authorized to update this submission.",
        403
      );
    }

    // Check if submission is already graded
    if (existingSubmission.status === SubmissionStatus.GRADED) {
      throw new AppError("Cannot update a graded submission.", 400);
    }

    // Check if assignment is past due
    if (new Date() > existingSubmission.assignment.dueDate) {
      throw new AppError("Assignment submission deadline has passed.", 400);
    }

    // Validate submission has content or file
    if (!data.content && !data.filePath) {
      throw new AppError("Submission must have either content or a file.", 400);
    }

    return prisma.submission.update({
      where: { id },
      data: {
        content: data.content,
        filePath: data.filePath,
        updatedAt: new Date(),
      },
      include: {
        assignment: {
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
              },
            },
          },
        },
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
   * Grades a submission by faculty.
   */
  public async grade(
    id: string,
    data: SubmissionGradeData,
    facultyUserId: string
  ): Promise<Submission> {
    // First, get the faculty record from the user ID
    const faculty = await prisma.faculty.findUnique({
      where: { userId: facultyUserId, isDeleted: false },
    });

    if (!faculty) {
      throw new AppError("Faculty record not found.", 404);
    }

    const submission = await prisma.submission.findUnique({
      where: { id, isDeleted: false },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!submission) {
      throw new AppError("Submission not found.", 404);
    }

    // Verify faculty authorization
    if (submission.assignment.course.facultyId !== faculty.id) {
      throw new AppError(
        "You are not authorized to grade this submission.",
        403
      );
    }

    // Validate marks are within bounds
    if (
      data.marksAwarded < 0 ||
      data.marksAwarded > submission.assignment.totalMarks
    ) {
      throw new AppError(
        `Marks must be between 0 and ${submission.assignment.totalMarks}.`,
        400
      );
    }

    return prisma.submission.update({
      where: { id },
      data: {
        marksAwarded: data.marksAwarded,
        feedback: data.feedback,
        status: SubmissionStatus.GRADED,
        gradedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        assignment: {
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
              },
            },
          },
        },
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
   * Soft deletes a submission.
   */
  public async delete(id: string, studentUserId: string): Promise<void> {
    // First, get the student record from the user ID
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId, isDeleted: false },
    });

    if (!student) {
      throw new AppError("Student record not found.", 404);
    }

    const submission = await prisma.submission.findUnique({
      where: { id, isDeleted: false },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      throw new AppError("Submission not found.", 404);
    }

    // Verify student authorization
    if (submission.studentId !== student.id) {
      throw new AppError(
        "You are not authorized to delete this submission.",
        403
      );
    }

    // Check if submission is already graded
    if (submission.status === SubmissionStatus.GRADED) {
      throw new AppError("Cannot delete a graded submission.", 400);
    }

    // Check if assignment is past due
    if (new Date() > submission.assignment.dueDate) {
      throw new AppError("Assignment submission deadline has passed.", 400);
    }

    await prisma.submission.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  /**
   * Gets submission statistics for an assignment.
   */
  public async getStatistics(assignmentId: string, facultyUserId: string) {
    // First, get the faculty record from the user ID
    const faculty = await prisma.faculty.findUnique({
      where: { userId: facultyUserId, isDeleted: false },
    });

    if (!faculty) {
      throw new AppError("Faculty record not found.", 404);
    }

    // Verify faculty authorization
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId, isDeleted: false },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      throw new AppError("Assignment not found.", 404);
    }

    if (assignment.course.facultyId !== faculty.id) {
      throw new AppError(
        "You are not authorized to view statistics for this assignment.",
        403
      );
    }

    const [
      totalSubmissions,
      gradedSubmissions,
      pendingSubmissions,
      lateSubmissions,
      averageMarks,
      highestMarks,
      lowestMarks,
    ] = await Promise.all([
      prisma.submission.count({
        where: { assignmentId, isDeleted: false },
      }),
      prisma.submission.count({
        where: {
          assignmentId,
          status: SubmissionStatus.GRADED,
          isDeleted: false,
        },
      }),
      prisma.submission.count({
        where: {
          assignmentId,
          status: {
            in: [SubmissionStatus.SUBMITTED, SubmissionStatus.PENDING_REVIEW],
          },
          isDeleted: false,
        },
      }),
      prisma.submission.count({
        where: {
          assignmentId,
          submittedAt: { gt: assignment.dueDate },
          isDeleted: false,
        },
      }),
      prisma.submission.aggregate({
        where: {
          assignmentId,
          status: SubmissionStatus.GRADED,
          isDeleted: false,
        },
        _avg: { marksAwarded: true },
      }),
      prisma.submission.aggregate({
        where: {
          assignmentId,
          status: SubmissionStatus.GRADED,
          isDeleted: false,
        },
        _max: { marksAwarded: true },
      }),
      prisma.submission.aggregate({
        where: {
          assignmentId,
          status: SubmissionStatus.GRADED,
          isDeleted: false,
        },
        _min: { marksAwarded: true },
      }),
    ]);

    return {
      totalSubmissions,
      gradedSubmissions,
      pendingSubmissions,
      lateSubmissions,
      onTimeSubmissions: totalSubmissions - lateSubmissions,
      submissionRate: `${(
        (totalSubmissions /
          (await prisma.studentEnrollment.count({
            where: { courseId: assignment.courseId },
          }))) *
        100
      ).toFixed(1)}%`,
      averageMarks: averageMarks._avg.marksAwarded?.toFixed(2) || "0.00",
      highestMarks: highestMarks._max.marksAwarded || 0,
      lowestMarks: lowestMarks._min.marksAwarded || 0,
      totalMarks: assignment.totalMarks,
    };
  }
}

export const submissionService = new SubmissionService();
