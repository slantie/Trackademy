import { Request, Response, NextFunction } from "express";
import { CertificateService } from "../services/certificate.service";
import { prisma } from "../config/prisma.service";
import { validate } from "../middlewares/validate.middleware";
import { uploadToCloudinary } from "../config/cloudinary.service";
import {
  createCertificateSchema,
  updateCertificateSchema,
  certificateIdParamSchema,
  studentIdParamSchema,
  getCertificatesQuerySchema,
} from "../validations/certificate.validation";
import AppError from "../utils/appError";

export class CertificateController {
  /**
   * Create a new certificate for the authenticated student
   * POST /api/v1/certificates
   */
  static createCertificate = [
    validate(createCertificateSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Extract user ID from authenticated user
        const studentUserId = req.user?.userId;
        if (!studentUserId) {
          throw new AppError("User not authenticated", 401);
        }

        // Create the certificate (validation already done by middleware)
        const certificate = await CertificateService.createCertificate(
          req.body,
          studentUserId
        );

        res.status(201).json({
          success: true,
          message: "Certificate created successfully",
          data: certificate,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Create a new certificate with file upload
   * POST /api/v1/certificates/upload
   */
  static async createCertificateWithFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const studentUserId = req.user?.userId;
      if (!studentUserId) {
        throw new AppError("User not authenticated", 401);
      }

      // Check if file was uploaded
      const file = (req as any).file;
      if (!file) {
        throw new AppError("Certificate file is required", 400);
      }

      console.log("File received:", {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      // Convert buffer to base64 for Cloudinary
      const base64String = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      // Determine resource type based on file mimetype
      let resourceType: "auto" | "image" | "video" | "raw" = "raw";
      if (file.mimetype.startsWith("image/")) {
        resourceType = "image";
      }

      console.log("Uploading to Cloudinary with resource type:", resourceType);

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(base64String, {
        folder: `trackademy/certificates/${studentUserId}`,
        public_id: `certificate_${Date.now()}_${studentUserId}`,
        resource_type: resourceType,
      });

      console.log("Cloudinary upload result:", uploadResult);

      if (!uploadResult.success) {
        throw new AppError(`File upload failed: ${uploadResult.error}`, 500);
      }

      // Create certificate data with the uploaded file URL
      const certificateData = {
        title: req.body.title,
        issuingOrganization: req.body.issuingOrganization,
        issueDate: req.body.issueDate,
        description: req.body.description || "",
        certificatePath: uploadResult.data?.secure_url!, // Cloudinary secure URL
      };

      console.log("Certificate data to create:", certificateData);

      const certificate = await CertificateService.createCertificate(
        certificateData,
        studentUserId
      );

      res.status(201).json({
        success: true,
        message: "Certificate created successfully with file upload",
        data: certificate,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all certificates for the authenticated student
   * GET /api/v1/certificates
   */
  static async getMyCertificates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract user ID from authenticated user
      const studentUserId = req.user?.userId;
      if (!studentUserId) {
        throw new AppError("User not authenticated", 401);
      }

      // Get user's certificates
      const certificates = await CertificateService.getMyCertificates(
        studentUserId
      );

      res.status(200).json({
        success: true,
        message: "Certificates retrieved successfully",
        data: certificates,
        count: certificates.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get certificates for a specific student (Faculty/Admin only)
   * GET /api/v1/certificates/student/:studentId
   */
  static async getStudentCertificates(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate student ID parameter
      const { studentId } = studentIdParamSchema.parse(req.params);

      // Ensure user has permission (Faculty/Admin)
      const userRole = req.user?.role;
      if (userRole === "STUDENT") {
        throw new AppError(
          "You don't have permission to view other students' certificates",
          403
        );
      }

      // Get student's certificates
      const certificates = await CertificateService.getCertificatesByStudentId(
        studentId
      );

      res.status(200).json({
        success: true,
        message: "Student certificates retrieved successfully",
        data: certificates,
        count: certificates.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific certificate by ID
   * GET /api/v1/certificates/:id
   */
  static getCertificateById = [
    validate(certificateIdParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Extract certificate ID from params (validation already done by middleware)
        const { id } = req.params;

        // Extract user info for authorization
        const requestingUserId = req.user?.userId;
        const requestingUserRole = req.user?.role;

        if (!requestingUserId || !requestingUserRole) {
          throw new AppError("User not authenticated", 401);
        }

        // Get the certificate with authorization check
        const certificate = await CertificateService.getCertificateById(
          id,
          requestingUserId,
          requestingUserRole
        );

        res.status(200).json({
          success: true,
          message: "Certificate retrieved successfully",
          data: certificate,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Update a certificate (students can only update their own)
   * PATCH /api/v1/certificates/:id
   */
  static updateCertificate = [
    validate(certificateIdParamSchema),
    validate(updateCertificateSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Extract certificate ID from params
        const { id } = req.params;

        // Extract user ID from authenticated user
        const studentUserId = req.user?.userId;
        if (!studentUserId) {
          throw new AppError("User not authenticated", 401);
        }

        // Update the certificate (validation already done by middleware)
        const updatedCertificate = await CertificateService.updateCertificate(
          id,
          req.body,
          studentUserId
        );

        res.status(200).json({
          success: true,
          message: "Certificate updated successfully",
          data: updatedCertificate,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Delete a certificate (soft delete - students can only delete their own)
   * DELETE /api/v1/certificates/:id
   */
  static deleteCertificate = [
    validate(certificateIdParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Extract certificate ID from params (validation already done by middleware)
        const { id } = req.params;

        // Extract user ID from authenticated user
        const studentUserId = req.user?.userId;
        if (!studentUserId) {
          throw new AppError("User not authenticated", 401);
        }

        // Delete the certificate
        const result = await CertificateService.deleteCertificate(
          id,
          studentUserId
        );

        res.status(200).json({
          success: true,
          message: result.message,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Get certificate statistics (Faculty/Admin only)
   * GET /api/v1/certificates/stats
   */
  static getCertificateStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract user role for authorization
      const userRole = req.user?.role;
      if (!userRole) {
        throw new AppError("User not authenticated", 401);
      }

      // Get certificate statistics
      const stats = await CertificateService.getCertificateStats(userRole);

      res.status(200).json({
        success: true,
        message: "Certificate statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search and filter certificates (Faculty/Admin only)
   * GET /api/v1/certificates/search
   */
  static searchCertificates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Ensure user has permission (Faculty/Admin)
      const userRole = req.user?.role;
      if (userRole === "STUDENT") {
        throw new AppError(
          "You don't have permission to search all certificates",
          403
        );
      }

      // Validate query parameters
      const queryParams = getCertificatesQuerySchema.parse(req.query);

      // Build search filters
      const whereClause: any = {
        isDeleted: false,
      };

      if (queryParams.search) {
        whereClause.OR = [
          {
            title: {
              contains: queryParams.search,
              mode: "insensitive",
            },
          },
          {
            issuingOrganization: {
              contains: queryParams.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: queryParams.search,
              mode: "insensitive",
            },
          },
        ];
      }

      if (queryParams.issuingOrganization) {
        whereClause.issuingOrganization = {
          contains: queryParams.issuingOrganization,
          mode: "insensitive",
        };
      }

      if (queryParams.fromDate || queryParams.toDate) {
        whereClause.issueDate = {};
        if (queryParams.fromDate) {
          whereClause.issueDate.gte = queryParams.fromDate;
        }
        if (queryParams.toDate) {
          whereClause.issueDate.lte = queryParams.toDate;
        }
      }

      // Calculate pagination
      const page = queryParams.page || 1;
      const limit = queryParams.limit || 10;
      const skip = (page - 1) * limit;

      // Execute search with pagination
      const [certificates, totalCount] = await Promise.all([
        prisma.certificate.findMany({
          where: whereClause,
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
          skip,
          take: limit,
        }),
        prisma.certificate.count({
          where: whereClause,
        }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        message: "Certificates search completed successfully",
        data: certificates,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CertificateController;
