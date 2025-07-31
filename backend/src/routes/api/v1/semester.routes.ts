/**
 * @file src/routes/api/v1/semester.routes.ts
 * @description Defines API routes for the Semester resource.
 */

import { Router } from "express";
import { SemesterController } from "../../../controllers/semester.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createSemesterSchema,
    updateSemesterSchema,
    semesterIdParamSchema,
    semesterQuerySchema,
} from "../../../validations/semester.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createSemesterSchema),
        SemesterController.createSemester
    )
    .get(validate(semesterQuerySchema), SemesterController.getAllSemesters);

router
    .route("/:id")
    .get(validate(semesterIdParamSchema), SemesterController.getSemesterById)
    .patch(
        authorize(Role.ADMIN),
        validate(updateSemesterSchema),
        SemesterController.updateSemester
    )
    .delete(
        authorize(Role.ADMIN),
        validate(semesterIdParamSchema),
        SemesterController.deleteSemester
    );

export default router;
