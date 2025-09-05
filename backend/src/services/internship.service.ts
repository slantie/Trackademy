import { PrismaClient, InternshipStatus, Role } from "@prisma/client";
import AppError from "../utils/appError";
import { prisma } from "../config/prisma.service";

interface CreateInternshipData {
  companyName: string;
  role: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  status?: InternshipStatus;
  stipend?: number;
  location?: string;
  offerLetterPath?: string;
}

interface UpdateInternshipData {
  companyName?: string;
  role?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status?: InternshipStatus;
  stipend?: number;
  location?: string;
  offerLetterPath?: string;
  nocPath?: string;
  completionCertificatePath?: string;
}

export class InternshipService {
  /**
   * Create a new internship record for a student
   */
  static async createInternship(studentId: string, data: CreateInternshipData) {
    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id: studentId, isDeleted: false },
    });

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    // Validate dates
    if (data.endDate && data.startDate >= data.endDate) {
      throw new AppError("End date must be after start date", 400);
    }

    const internship = await prisma.internship.create({
      data: {
        companyName: data.companyName,
        role: data.role,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        stipend: data.stipend,
        location: data.location,
        offerLetterPath: data.offerLetterPath,
        studentId,
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

    return internship;
  }

  /**
   * Get all internships for a specific student
   */
  static async getStudentInternships(
    studentId: string,
    requestingUserId: string,
    requestingUserRole: Role
  ) {
    // Authorization check
    const isOwner = await this.verifyStudentOwnership(
      studentId,
      requestingUserId
    );
    const isAuthorized =
      isOwner ||
      requestingUserRole === Role.FACULTY ||
      requestingUserRole === Role.ADMIN;

    if (!isAuthorized) {
      throw new AppError("You can only view your own internships", 403);
    }

    const internships = await prisma.internship.findMany({
      where: {
        studentId,
        isDeleted: false,
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
      orderBy: {
        startDate: "desc",
      },
    });

    return internships;
  }

  /**
   * Get internships for the logged-in student
   */
  static async getMyInternships(requestingUserId: string) {
    const student = await prisma.student.findUnique({
      where: { userId: requestingUserId, isDeleted: false },
    });

    if (!student) {
      throw new AppError("Student profile not found", 404);
    }

    return this.getStudentInternships(
      student.id,
      requestingUserId,
      Role.STUDENT
    );
  }

  /**
   * Get a single internship by ID
   */
  static async getInternshipById(
    internshipId: string,
    requestingUserId: string,
    requestingUserRole: Role
  ) {
    const internship = await prisma.internship.findUnique({
      where: {
        id: internshipId,
        isDeleted: false,
      },
      include: {
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

    if (!internship) {
      throw new AppError("Internship not found", 404);
    }

    // Authorization check
    const isOwner = internship.student.userId === requestingUserId;
    const isAuthorized =
      isOwner ||
      requestingUserRole === Role.FACULTY ||
      requestingUserRole === Role.ADMIN;

    if (!isAuthorized) {
      throw new AppError("You can only view your own internships", 403);
    }

    return internship;
  }

  /**
   * Update an internship record
   */
  static async updateInternship(
    internshipId: string,
    data: UpdateInternshipData,
    requestingUserId: string
  ) {
    const internship = await prisma.internship.findUnique({
      where: {
        id: internshipId,
        isDeleted: false,
      },
      include: {
        student: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!internship) {
      throw new AppError("Internship not found", 404);
    }

    // Authorization check - only the student who owns the internship can update it
    if (internship.student.userId !== requestingUserId) {
      throw new AppError("You can only update your own internships", 403);
    }

    // Validate dates if both are provided
    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      throw new AppError("End date must be after start date", 400);
    }

    const updatedInternship = await prisma.internship.update({
      where: { id: internshipId },
      data,
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

    return updatedInternship;
  }

  /**
   * Soft delete an internship record
   */
  static async deleteInternship(
    internshipId: string,
    requestingUserId: string
  ) {
    const internship = await prisma.internship.findUnique({
      where: {
        id: internshipId,
        isDeleted: false,
      },
      include: {
        student: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!internship) {
      throw new AppError("Internship not found", 404);
    }

    // Authorization check - only the student who owns the internship can delete it
    if (internship.student.userId !== requestingUserId) {
      throw new AppError("You can only delete your own internships", 403);
    }

    await prisma.internship.update({
      where: { id: internshipId },
      data: { isDeleted: true },
    });

    return { message: "Internship deleted successfully" };
  }

  /**
   * Helper method to verify if a user owns a student record
   */
  private static async verifyStudentOwnership(
    studentId: string,
    userId: string
  ): Promise<boolean> {
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
        userId,
        isDeleted: false,
      },
    });

    return !!student;
  }

  /**
   * Get student record by user ID
   */
  static async getStudentByUserId(userId: string) {
    return await prisma.student.findUnique({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        id: true,
        fullName: true,
        enrollmentNumber: true,
      },
    });
  }

  /**
   * Get internships statistics for analytics
   */
  static async getInternshipStats(
    requestingUserRole: Role,
    departmentId?: string
  ) {
    if (
      requestingUserRole !== Role.FACULTY &&
      requestingUserRole !== Role.ADMIN
    ) {
      throw new AppError(
        "Only faculty and admins can view internship statistics",
        403
      );
    }

    const whereClause: any = {
      isDeleted: false,
    };

    if (departmentId) {
      whereClause.student = {
        departmentId,
        isDeleted: false,
      };
    }

    const [totalInternships, statusBreakdown, monthlyTrends] =
      await Promise.all([
        // Total internships count
        prisma.internship.count({ where: whereClause }),

        // Status breakdown
        prisma.internship.groupBy({
          by: ["status"],
          where: whereClause,
          _count: {
            status: true,
          },
        }),

        // Monthly trends (last 12 months)
        prisma.internship.groupBy({
          by: ["startDate"],
          where: {
            ...whereClause,
            startDate: {
              gte: new Date(
                new Date().setFullYear(new Date().getFullYear() - 1)
              ),
            },
          },
          _count: {
            startDate: true,
          },
        }),
      ]);

    return {
      totalInternships,
      statusBreakdown: statusBreakdown.map((item) => ({
        status: item.status,
        count: item._count.status,
      })),
      monthlyTrends: monthlyTrends.map((item) => ({
        month: item.startDate,
        count: item._count.startDate,
      })),
    };
  }
}
