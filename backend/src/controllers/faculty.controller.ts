/**
 * @file src/controllers/faculty.controller.ts
 * @description Enhanced controller for handling faculty profile management API requests.
 */

import { Request, Response, NextFunction } from "express";
import { facultyService } from "../services/faculty.service";
import { authService } from "../services/auth.service";
import { Designation } from "@prisma/client";

export class FacultyController {
  static async createFaculty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newFaculty = await facultyService.create(req.body);
      res.status(201).json({
        status: "success",
        message: "Faculty created successfully",
        data: { faculty: newFaculty },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllFaculties(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        departmentId,
        designation,
        search,
        includeDeleted = false,
      } = req.query;

      const result = await facultyService.getAll({
        departmentId: departmentId as string,
        designation: designation as Designation,
        search: search as string,
        includeDeleted: includeDeleted === "true",
      });

      res.status(200).json({
        status: "success",
        results: result.data.length,
        data: { faculties: result.data },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFacultyCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        departmentId,
        designation,
        search,
        includeDeleted = false,
      } = req.query;

      const result = await facultyService.getCount({
        departmentId: departmentId as string,
        designation: designation as Designation,
        search: search as string,
        includeDeleted: includeDeleted === "true",
      });

      res.status(200).json({
        success: true,
        message: "Faculty count retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchFaculties(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q: query, departmentId, limit = 20 } = req.query;

      if (!query) {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const faculties = await facultyService.search(query as string, {
        departmentId: departmentId as string,
        limit: Number(limit),
      });

      res.status(200).json({
        success: true,
        message: "Search completed successfully",
        data: faculties,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFacultiesByDesignation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { designation } = req.params;
      const { departmentId } = req.query;

      const faculties = await facultyService.getByDesignation(
        designation as Designation,
        { departmentId: departmentId as string }
      );

      res.status(200).json({
        success: true,
        message: "Faculties retrieved successfully",
        data: faculties,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFacultiesGroupedByDesignation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { departmentId } = req.query;

      const grouped = await facultyService.getGroupedByDesignation(
        departmentId as string
      );

      res.status(200).json({
        success: true,
        message: "Grouped faculties retrieved successfully",
        data: grouped,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFacultyById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const faculty = await facultyService.getById(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Faculty retrieved successfully",
        data: { faculty },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateFaculty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedFaculty = await facultyService.update(
        req.params.id,
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Faculty updated successfully",
        data: { faculty: updatedFaculty },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteFaculty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { hard } = req.query;

      if (hard === "true") {
        await facultyService.hardDelete(req.params.id);
        res.status(200).json({
          status: "success",
          message: "Faculty permanently deleted",
        });
      } else {
        await facultyService.delete(req.params.id);
        res.status(200).json({
          status: "success",
          message: "Faculty soft deleted successfully",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async restoreFaculty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const restoredFaculty = await facultyService.restore(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Faculty restored successfully",
        data: { faculty: restoredFaculty },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin-only: Reset a faculty member's password.
   * @param req - Express request object.
   * @param res - Express response object.
   * @param next - Express next middleware function.
   */
  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id: facultyId } = req.params;
      const { newPassword } = req.body;

      if (!facultyId) {
        throw new Error("Faculty ID is required.");
      }
      if (!newPassword) {
        throw new Error("New password is required.");
      }

      const message = await authService.resetFacultyPassword(
        facultyId,
        newPassword
      );

      res.status(200).json({
        status: "success",
        message,
      });
    } catch (error) {
      next(error);
    }
  }
}
