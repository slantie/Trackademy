/**
 * @file src/routes/api/v1/exam.routes.ts
 * @description Defines API routes for the Exam resource.
 */

import { Router } from "express";
import { ExamController } from "../../../controllers/exam.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createExamSchema,
    updateExamSchema,
    examIdParamSchema,
    examQuerySchema,
} from "../../../validations/exam.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate, authorize(Role.ADMIN));

router
    .route("/")
    .post(validate(createExamSchema), ExamController.createExam)
    .get(validate(examQuerySchema), ExamController.getAllExams);

router
    .route("/:id")
    .get(validate(examIdParamSchema), ExamController.getExamById)
    .patch(validate(updateExamSchema), ExamController.updateExam)
    .delete(validate(examIdParamSchema), ExamController.deleteExam);

export default router;
