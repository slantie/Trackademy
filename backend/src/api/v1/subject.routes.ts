/**
 * @file src/routes/v1/subject.routes.ts
 * @description Defines API routes for the Subject resource.
 */

import { Router } from "express";
import { SubjectController } from "../../controllers/subject.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
    createSubjectSchema,
    updateSubjectSchema,
    subjectIdParamSchema,
    subjectQuerySchema,
} from "../../validations/subject.validation";
import { Role } from "@prisma/client";

const router = Router();

// All subject routes require an authenticated user.
router.use(authenticate);

// Routes for creating and listing subjects.
router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createSubjectSchema),
        SubjectController.createSubject
    )
    .get(validate(subjectQuerySchema), SubjectController.getAllSubjects);

// Routes for getting, updating, and deleting a specific subject.
router
    .route("/:id")
    .get(validate(subjectIdParamSchema), SubjectController.getSubjectById)
    .patch(
        authorize(Role.ADMIN),
        validate(updateSubjectSchema),
        SubjectController.updateSubject
    )
    .delete(
        authorize(Role.ADMIN),
        validate(subjectIdParamSchema),
        SubjectController.deleteSubject
    );

export default router;
