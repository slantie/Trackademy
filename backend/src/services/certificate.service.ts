import { PrismaClient, Role } from "@prisma/client";
import AppError from "../utils/appError";
import { prisma } from "../config/prisma.service";

interface CreateCertificateData {
  title: string;
  issuingOrganization: string;
  issueDate: string; // Changed from Date to string
  description?: string;
  certificatePath: string;
}

interface UpdateCertificateData {
  title?: string;
  issuingOrganization?: string;
  issueDate?: string; // Changed from Date to string
  description?: string;
  certificatePath?: string;
}

export class CertificateService {
  /**
   * Create a new certificate for a student
   */
  static async createCertificate(
    data: CreateCertificateData,
    studentUserId: string
  ) {
    // Find the student associated with the user
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId, isDeleted: false },
    });

    if (!student) {
      throw new AppError("Student not found", 404);
    }

    // Create the certificate
    const certificate = await prisma.certificate.create({
      data: {
        title: data.title,
        issuingOrganization: data.issuingOrganization,
        issueDate: new Date(data.issueDate), // Convert string to Date
        description: data.description,
        certificatePath: data.certificatePath,
        studentId: student.id,
      },
      include: {
        student: {
          select: {
            id: true,
            enrollmentNumber: true,
            fullName: true,
          },
        },
      },
    });

    return certificate;
  }

  /**
   * Get all certificates for a specific student
   */
  static async getCertificatesByStudentId(studentId: string) {
    const certificates = await prisma.certificate.findMany({
      where: {
        studentId,
        isDeleted: false,
      },
      include: {
        student: {
          select: {
            id: true,
            enrollmentNumber: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        issueDate: "desc",
      },
    });

    return certificates;
  }

  /**
   * Get my certificates (for authenticated student)
   */
  static async getMyCertificates(studentUserId: string) {
    // Find the student
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId, isDeleted: false },
    });

    if (!student) {
      throw new AppError("Student profile not found", 404);
    }

    return this.getCertificatesByStudentId(student.id);
  }

  /**
   * Get a specific certificate by ID with authorization checks
   */
  static async getCertificateById(
    certificateId: string,
    requestingUserId: string,
    requestingUserRole: Role
  ) {
    const certificate = await prisma.certificate.findUnique({
      where: {
        id: certificateId,
        isDeleted: false,
      },
      include: {
        student: {
          select: {
            id: true,
            enrollmentNumber: true,
            fullName: true,
            userId: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new AppError("Certificate not found", 404);
    }

    // Authorization check: Students can only view their own certificates
    // Faculty and Admin can view any certificate
    if (
      requestingUserRole === "STUDENT" &&
      certificate.student.userId !== requestingUserId
    ) {
      throw new AppError("You can only view your own certificates", 403);
    }

    return certificate;
  }

  /**
   * Update a certificate (only by the owning student)
   */
  static async updateCertificate(
    certificateId: string,
    data: UpdateCertificateData,
    studentUserId: string
  ) {
    // Find the certificate and verify ownership
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        id: certificateId,
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

    if (!existingCertificate) {
      throw new AppError("Certificate not found", 404);
    }

    // Verify ownership
    if (existingCertificate.student.userId !== studentUserId) {
      throw new AppError("You can only update your own certificates", 403);
    }

    // Update the certificate
    const updatedCertificate = await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.issuingOrganization && {
          issuingOrganization: data.issuingOrganization,
        }),
        ...(data.issueDate && { issueDate: new Date(data.issueDate) }), // Convert string to Date
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.certificatePath && { certificatePath: data.certificatePath }),
        updatedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            enrollmentNumber: true,
            fullName: true,
          },
        },
      },
    });

    return updatedCertificate;
  }

  /**
   * Delete a certificate (soft delete - only by the owning student)
   */
  static async deleteCertificate(certificateId: string, studentUserId: string) {
    // Find the certificate and verify ownership
    const existingCertificate = await prisma.certificate.findUnique({
      where: {
        id: certificateId,
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

    if (!existingCertificate) {
      throw new AppError("Certificate not found", 404);
    }

    // Verify ownership
    if (existingCertificate.student.userId !== studentUserId) {
      throw new AppError("You can only delete your own certificates", 403);
    }

    // Soft delete the certificate
    await prisma.certificate.update({
      where: { id: certificateId },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });

    return { message: "Certificate deleted successfully" };
  }

  /**
   * Get certificate statistics (for faculty/admin)
   */
  static async getCertificateStats(requestingUserRole: Role) {
    if (requestingUserRole === "STUDENT") {
      throw new AppError(
        "You don't have permission to view certificate statistics",
        403
      );
    }

    const totalCertificates = await prisma.certificate.count({
      where: { isDeleted: false },
    });

    const certificatesThisMonth = await prisma.certificate.count({
      where: {
        isDeleted: false,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const topIssuingOrganizations = await prisma.certificate.groupBy({
      by: ["issuingOrganization"],
      where: { isDeleted: false },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });

    const studentsWithCertificates = await prisma.student.count({
      where: {
        isDeleted: false,
        certificates: {
          some: {
            isDeleted: false,
          },
        },
      },
    });

    return {
      totalCertificates,
      certificatesThisMonth,
      topIssuingOrganizations: topIssuingOrganizations.map((org) => ({
        issuingOrganization: org.issuingOrganization,
        count: org._count.id,
      })),
      studentsWithCertificates,
    };
  }
}

export default CertificateService;
