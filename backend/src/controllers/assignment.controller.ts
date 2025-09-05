/**
 * @file src/controllers/assignment.controller.ts
 * @description Controller for handling assignment-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { assignmentService } from "../services/assignment.service";

export class AssignmentController {
  static async createAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      const newAssignment = await assignmentService.create(
        req.body,
        req.user.userId
      );

      res.status(201).json({
        status: "success",
        message: "Assignment created successfully",
        data: { assignment: newAssignment },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllAssignments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId, includeDeleted, includePastDue, sortBy, sortOrder } =
        req.query;

      let assignments;
      const options = {
        courseId: courseId as string,
        includeDeleted: includeDeleted === "true",
        includePastDue: includePastDue !== "false", // default to true
        sortBy: sortBy as "dueDate" | "title" | "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
      };

      // If user is a student, get assignments for their enrolled courses
      if (req.user?.role === "STUDENT") {
        try {
          assignments = await assignmentService.getForStudent(
            req.user.userId,
            options
          );
          // If student has no enrollments, fallback to all assignments temporarily
          if (assignments.data.length === 0) {
            console.log(
              "Student has no enrollments, showing all assignments temporarily"
            );
            assignments = await assignmentService.getAll(options);
          }
        } catch (error) {
          console.log(
            "Student enrollment error, showing all assignments temporarily:",
            error
          );
          assignments = await assignmentService.getAll(options);
        }
      } else if (req.user?.role === "FACULTY") {
        // If user is faculty, get assignments for their courses
        assignments = await assignmentService.getAll({
          ...options,
          facultyUserId: req.user.userId,
        });
      } else {
        // Admin can see all assignments
        assignments = await assignmentService.getAll(options);
      }

      res.status(200).json({
        status: "success",
        results: assignments.data.length,
        data: {
          assignments,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAssignmentById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const studentUserId =
        req.user?.role === "STUDENT" ? req.user.userId : undefined;

      const assignment = await assignmentService.getById(id, studentUserId);

      res.status(200).json({
        status: "success",
        data: { assignment },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      const updatedAssignment = await assignmentService.update(
        id,
        req.body,
        req.user.userId
      );

      res.status(200).json({
        status: "success",
        message: "Assignment updated successfully",
        data: { assignment: updatedAssignment },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      await assignmentService.delete(id, req.user.userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getAssignmentStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.query;

      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      if (!courseId) {
        throw new Error("Course ID is required.");
      }

      const statistics = await assignmentService.getStatistics(
        courseId as string,
        req.user.userId
      );

      res.status(200).json({
        status: "success",
        data: { statistics },
      });
    } catch (error) {
      next(error);
    }
  }
}
