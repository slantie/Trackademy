/**
 * @file src/routes/api/v1/subject.routes.ts
 * @description Defines API routes for the Subject resource.
 */

import { Router } from "express";
import { SubjectController } from "../../../controllers/subject.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createSubjectSchema,
    updateSubjectSchema,
    subjectIdParamSchema,
    subjectQuerySchema,
    subjectCountQuerySchema,
    subjectSearchQuerySchema,
    subjectTypeParamSchema,
    subjectDeleteSchema,
} from "../../../validations/subject.validation";
import { Role } from "@prisma/client";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// Main subject routes
router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createSubjectSchema),
        SubjectController.createSubject
    )
    .get(validate(subjectQuerySchema), SubjectController.getAllSubjects);

// Count route
router
    .route("/count")
    .get(validate(subjectCountQuerySchema), SubjectController.getSubjectCount);

// Search route
router
    .route("/search")
    .get(validate(subjectSearchQuerySchema), SubjectController.searchSubjects);

// Type-based retrieval route
router
    .route("/type/:type")
    .get(validate(subjectTypeParamSchema), SubjectController.getSubjectsByType);

// Individual subject routes
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
        validate(subjectDeleteSchema),
        SubjectController.deleteSubject
    );

export default router;
