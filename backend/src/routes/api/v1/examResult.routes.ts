/**
 * @file src/routes/api/v1/examResult.routes.ts
 * @description Defines API routes for the ExamResult resource.
 */

import { Router } from "express";
import { ExamResultController } from "../../../controllers/examResult.controller";
import { authenticate } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { examResultIdParamSchema } from "../../../validations/examResult.validation";

const router = Router();

// All routes require an authenticated user
router.use(authenticate);

// A single endpoint to get results. The controller handles logic based on user role.
router.get("/", ExamResultController.getResults);

// Route to get a single, detailed result by its ID
router.get(
    "/:id",
    validate(examResultIdParamSchema),
    ExamResultController.getResultById
);

export default router;
