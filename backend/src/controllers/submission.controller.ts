/**
 * @file src/controllers/submission.controller.ts
 * @description Controller for handling submission-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { submissionService } from "../services/submission.service";
import { SubmissionStatus } from "@prisma/client";

export class SubmissionController {
  static async createSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      const newSubmission = await submissionService.create(
        req.body,
        req.user.userId
      );

      res.status(201).json({
        status: "success",
        message: "Submission created successfully",
        data: { submission: newSubmission },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllSubmissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        assignmentId,
        studentId,
        status,
        includeDeleted,
        sortBy,
        sortOrder,
      } = req.query;

      const options = {
        assignmentId: assignmentId as string,
        studentId: studentId as string,
        status: status as SubmissionStatus,
        includeDeleted: includeDeleted === "true",
        sortBy: sortBy as "submittedAt" | "marksAwarded" | "gradedAt",
        sortOrder: sortOrder as "asc" | "desc",
      };

      const submissions = await submissionService.getAll(options);

      res.status(200).json({
        status: "success",
        results: submissions.data.length,
        data: {
          submissions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissionsForAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { assignmentId } = req.params;
      const { status, includeDeleted, sortBy, sortOrder } = req.query;

      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      const options = {
        status: status as SubmissionStatus,
        includeDeleted: includeDeleted === "true",
        sortBy: sortBy as "submittedAt" | "marksAwarded" | "gradedAt",
        sortOrder: sortOrder as "asc" | "desc",
      };

      const submissions = await submissionService.getForAssignment(
        assignmentId,
        req.user.userId,
        options
      );

      res.status(200).json({
        status: "success",
        results: submissions.data.length,
        data: {
          submissions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissionById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const submission = await submissionService.getById(
        id,
        req.user?.userId,
        req.user?.role
      );

      res.status(200).json({
        status: "success",
        data: { submission },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      const updatedSubmission = await submissionService.update(
        id,
        req.body,
        req.user.userId
      );

      res.status(200).json({
        status: "success",
        message: "Submission updated successfully",
        data: { submission: updatedSubmission },
      });
    } catch (error) {
      next(error);
    }
  }

  static async gradeSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      const gradedSubmission = await submissionService.grade(
        id,
        req.body,
        req.user.userId
      );

      res.status(200).json({
        status: "success",
        message: "Submission graded successfully",
        data: { submission: gradedSubmission },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      await submissionService.delete(id, req.user.userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissionStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { assignmentId } = req.params;

      if (!req.user?.userId) {
        throw new Error("User ID not found in request.");
      }

      const statistics = await submissionService.getStatistics(
        assignmentId,
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
