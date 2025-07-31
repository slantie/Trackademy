/**
 * @file src/routes/api/v1/subject.routes.ts
 * @description Defines API routes for the master Subject resource.
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
} from "../../../validations/subject.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createSubjectSchema),
        SubjectController.createSubject
    )
    .get(validate(subjectQuerySchema), SubjectController.getAllSubjects);

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
