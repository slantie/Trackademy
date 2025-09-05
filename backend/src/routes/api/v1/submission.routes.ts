/**
 * @file src/routes/api/v1/submission.routes.ts
 * @description Defines API routes for the Submission resource.
 */

import { Router } from "express";
import { SubmissionController } from "../../../controllers/submission.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { uploadSingle } from "../../../middlewares/upload.middleware";
import {
  createSubmissionSchema,
  updateSubmissionSchema,
  gradeSubmissionSchema,
  submissionIdParamSchema,
  submissionQuerySchema,
  assignmentSubmissionsQuerySchema,
  submissionStatisticsQuerySchema,
} from "../../../validations/submission.validation";
import { Role } from "@prisma/client";

const router = Router();

// All submission routes require authentication
router.use(authenticate);

// Submission CRUD operations
router
  .route("/")
  .post(
    authorize(Role.STUDENT),
    validate(createSubmissionSchema),
    SubmissionController.createSubmission
  )
  .get(
    authorize(Role.ADMIN),
    validate(submissionQuerySchema),
    SubmissionController.getAllSubmissions
  );

// Create submission with file upload
router
  .route("/upload")
  .post(
    authorize(Role.STUDENT),
    uploadSingle("file"),
    SubmissionController.createSubmissionWithFile
  );

// Get submissions for a specific assignment (faculty view)
router
  .route("/assignment/:assignmentId")
  .get(
    authorize(Role.FACULTY),
    validate(assignmentSubmissionsQuerySchema),
    SubmissionController.getSubmissionsForAssignment
  );

// Get submission statistics for an assignment
router
  .route("/assignment/:assignmentId/statistics")
  .get(
    authorize(Role.FACULTY),
    validate(submissionStatisticsQuerySchema),
    SubmissionController.getSubmissionStatistics
  );

// Individual submission operations
router
  .route("/:id")
  .get(
    validate(submissionIdParamSchema),
    SubmissionController.getSubmissionById
  )
  .put(
    authorize(Role.STUDENT),
    validate(submissionIdParamSchema),
    validate(updateSubmissionSchema),
    SubmissionController.updateSubmission
  )
  .delete(
    authorize(Role.STUDENT),
    validate(submissionIdParamSchema),
    SubmissionController.deleteSubmission
  );

// Grade a submission (faculty only)
router
  .route("/:id/grade")
  .post(
    authorize(Role.FACULTY),
    validate(submissionIdParamSchema),
    validate(gradeSubmissionSchema),
    SubmissionController.gradeSubmission
  );

export default router;
