/**
 * @file src/routes/api/v1/exam.routes.ts
 * @description Enhanced API routes for the Exam resource with comprehensive CRUD operations.
 */

import { Router } from "express";
import { ExamController } from "../../../controllers/exam.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
  createExamSchema,
  updateExamSchema,
  examIdParamSchema,
  examTypeParamSchema,
  semesterIdParamSchema,
  departmentIdParamSchema,
  examListQuerySchema,
  examCountQuerySchema,
  examSearchQuerySchema,
  examFilterQuerySchema,
  examBulkIdsSchema,
} from "../../../validations/exam.validation";
import { Role } from "@prisma/client";

const router = Router();

// All exam routes require authentication
router.use(authenticate);

// Public routes (accessible by all authenticated users)
router.get(
  "/published",
  validate(examFilterQuerySchema),
  ExamController.getPublishedExams
);
router.get(
  "/search",
  validate(examSearchQuerySchema),
  ExamController.searchExams
);
router.get(
  "/type/:examType",
  validate(examTypeParamSchema),
  validate(examFilterQuerySchema),
  ExamController.getExamsByType
);
router.get(
  "/semester/:semesterId",
  validate(semesterIdParamSchema),
  ExamController.getExamsBySemester
);
router.get(
  "/department/:departmentId",
  validate(departmentIdParamSchema),
  validate(examFilterQuerySchema),
  ExamController.getExamsByDepartment
);
router.get(
  "/count",
  validate(examCountQuerySchema),
  ExamController.getExamCount
);

// Admin-only routes
// router.use(authorize(Role.FACULTY));
// router.use(authorize(Role.ADMIN));

router
  .route("/")
  .post(validate(createExamSchema), ExamController.createExam)
  .get(validate(examListQuerySchema), ExamController.getAllExams);

// Individual exam operations
router
  .route("/:id")
  .get(validate(examIdParamSchema), ExamController.getExamById)
  .patch(validate(updateExamSchema), ExamController.updateExam)
  .delete(validate(examIdParamSchema), ExamController.deleteExam);

// Exam state management
router.patch(
  "/:id/publish",
  validate(examIdParamSchema),
  ExamController.publishExam
);
router.patch(
  "/:id/unpublish",
  validate(examIdParamSchema),
  ExamController.unpublishExam
);

// Restore and hard delete operations
router.patch(
  "/:id/restore",
  validate(examIdParamSchema),
  ExamController.restoreExam
);
router.delete(
  "/:id/hard",
  validate(examIdParamSchema),
  ExamController.hardDeleteExam
);

export default router;
