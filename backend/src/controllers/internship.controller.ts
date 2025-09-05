import { Request, Response, NextFunction } from "express";
import { InternshipService } from "../services/internship.service";
import { uploadToCloudinary } from "../config/cloudinary.service";
import { validate } from "../middlewares/validate.middleware";
import {
  createInternshipSchema,
  updateInternshipSchema,
  getInternshipsQuerySchema,
  studentIdParamSchema,
  internshipIdParamSchema,
} from "../validations/internship.validation";

export class InternshipController {
  /**
   * Create a new internship record
   */
  static createInternship = [
    validate(createInternshipSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user?.userId) {
          throw new Error("User ID not found in request.");
        }

        const userId = req.user.userId;
        const data = req.body;

        // Get student ID from user ID
        const student = await InternshipService.getStudentByUserId(userId);
        if (!student) {
          return res.status(404).json({
            success: false,
            message: "Student profile not found",
          });
        }

        const internship = await InternshipService.createInternship(
          student.id,
          data
        );

        res.status(201).json({
          success: true,
          message: "Internship created successfully",
          data: internship,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Create a new internship record with file upload
   */
  static createInternshipWithFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      const userId = req.user.userId;
      const data = req.body;
      const file = req.file;

      console.log("Creating internship with file:", {
        userId,
        file: file
          ? { originalname: file.originalname, size: file.size }
          : null,
        data,
      });

      // Get student ID from user ID
      const student = await InternshipService.getStudentByUserId(userId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student profile not found",
        });
      }

      let certificateUrl = null;

      // Handle file upload if present
      if (file) {
        try {
          console.log("Uploading file to Cloudinary...");
          const fileBuffer = file.buffer;
          const base64File = `data:${
            file.mimetype
          };base64,${fileBuffer.toString("base64")}`;

          const uploadResult = await uploadToCloudinary(base64File, {
            folder: "trackademy/internship-certificates",
          });

          if (uploadResult.success && uploadResult.data) {
            certificateUrl = uploadResult.data.secure_url;
            console.log("File uploaded successfully:", certificateUrl);
          } else {
            throw new Error(uploadResult.error || "Upload failed");
          }
        } catch (uploadError) {
          console.error("Error uploading file to Cloudinary:", uploadError);
          return res.status(500).json({
            success: false,
            message: "Failed to upload certificate file",
            error:
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown error",
          });
        }
      }

      // Prepare internship data with proper type conversions
      const internshipData = {
        companyName: data.companyName,
        role: data.role,
        description: data.description || undefined,
        startDate: new Date(data.startDate), // Required field
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: data.status,
        location: data.location || undefined,
        stipend: data.stipend ? Number(data.stipend) : undefined,
        offerLetterPath: certificateUrl || data.offerLetterPath || undefined,
      };

      console.log("Creating internship with data:", internshipData);

      const internship = await InternshipService.createInternship(
        student.id,
        internshipData
      );

      res.status(201).json({
        success: true,
        message: "Internship created successfully",
        data: internship,
      });
    } catch (error) {
      console.error("Error in createInternshipWithFile:", error);
      next(error);
    }
  };

  /**
   * Get all internships for the logged-in student
   */
  static getMyInternships = [
    validate(getInternshipsQuerySchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user?.userId) {
          throw new Error("User ID not found in request.");
        }

        const userId = req.user.userId;

        const internships = await InternshipService.getMyInternships(userId);

        res.status(200).json({
          success: true,
          message: "Internships retrieved successfully",
          data: internships,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Get internships for a specific student (Faculty/Admin only)
   */
  static getStudentInternships = [
    validate(studentIdParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user?.userId || !req.user?.role) {
          throw new Error("User authentication data not found in request.");
        }

        const userId = req.user.userId;
        const userRole = req.user.role;
        const { studentId } = req.params;

        const internships = await InternshipService.getStudentInternships(
          studentId,
          userId,
          userRole
        );

        res.status(200).json({
          success: true,
          message: "Student internships retrieved successfully",
          data: internships,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Get a single internship by ID
   */
  static getInternshipById = [
    validate(internshipIdParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user?.userId || !req.user?.role) {
          throw new Error("User authentication data not found in request.");
        }

        const userId = req.user.userId;
        const userRole = req.user.role;
        const { id } = req.params;

        const internship = await InternshipService.getInternshipById(
          id,
          userId,
          userRole
        );

        res.status(200).json({
          success: true,
          message: "Internship retrieved successfully",
          data: internship,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Update an internship record
   */
  static updateInternship = [
    validate(updateInternshipSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user?.userId) {
          throw new Error("User ID not found in request.");
        }

        const userId = req.user.userId;
        const { id } = req.params;
        const data = req.body;

        const internship = await InternshipService.updateInternship(
          id,
          data,
          userId
        );

        res.status(200).json({
          success: true,
          message: "Internship updated successfully",
          data: internship,
        });
      } catch (error) {
        next(error);
      }
    },
  ];

  /**
   * Delete an internship record
   */
  static deleteInternship = [
    validate(internshipIdParamSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.user?.userId) {
          throw new Error("User ID not found in request.");
        }

        const userId = req.user.userId;
        const { id } = req.params;

        const result = await InternshipService.deleteInternship(id, userId);

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
   * Get internship statistics (Faculty/Admin only)
   */
  static getInternshipStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user?.role) {
        throw new Error("User role not found in request.");
      }

      const userRole = req.user.role;
      const { departmentId } = req.query;

      const stats = await InternshipService.getInternshipStats(
        userRole,
        departmentId as string
      );

      res.status(200).json({
        success: true,
        message: "Internship statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };
}
