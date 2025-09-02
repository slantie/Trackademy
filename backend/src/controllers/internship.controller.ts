import { Request, Response, NextFunction } from "express";
import { InternshipService } from "../services/internship.service";
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
