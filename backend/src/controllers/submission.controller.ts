/**
 * @file src/controllers/submission.controller.ts
 * @description Controller for handling submission-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { submissionService } from "../services/submission.service";
import { SubmissionStatus } from "@prisma/client";
import { uploadToCloudinary } from "../config/cloudinary.service";
import AppError from "../utils/appError";

export class SubmissionController {
  static async createSubmissionWithFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        throw new AppError("User ID not found in request.", 401);
      }

      const { assignmentId, content } = req.body;
      const file = req.file;

      if (!assignmentId) {
        throw new AppError("Assignment ID is required.", 400);
      }

      if (!content && !file) {
        throw new AppError("Either content or file must be provided.", 400);
      }

      let filePath: string | undefined;

      // If file is provided, upload to Cloudinary
      if (file) {
        // Convert buffer to base64 for Cloudinary
        const base64String = `data:${
          file.mimetype
        };base64,${file.buffer.toString("base64")}`;

        // Determine resource type based on file mimetype
        let resourceType: "auto" | "image" | "video" | "raw" = "raw";
        if (file.mimetype.startsWith("image/")) {
          resourceType = "image";
        } else if (file.mimetype.startsWith("video/")) {
          resourceType = "video";
        }

        const uploadResult = await uploadToCloudinary(base64String, {
          folder: `trackademy/submissions/${assignmentId}`,
          public_id: `submission_${Date.now()}_${req.user.userId}`,
          resource_type: resourceType,
        });

        if (!uploadResult.success) {
          throw new AppError(`File upload failed: ${uploadResult.error}`, 500);
        }

        filePath = uploadResult.data?.secure_url;
      }

      const submissionData = {
        assignmentId,
        content: content || undefined,
        filePath,
      };

      const newSubmission = await submissionService.create(
        submissionData,
        req.user.userId
      );

      res.status(201).json({
        status: "success",
        message: "Submission created successfully",
        data: {
          submission: newSubmission,
          uploadInfo: file
            ? {
                originalName: file.originalname,
                size: file.size,
                mimeType: file.mimetype,
              }
            : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  }

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
