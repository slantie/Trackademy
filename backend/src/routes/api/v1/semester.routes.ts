/**
 * @file src/routes/api/v1/semester.routes.ts
 * @description Enhanced API routes for the Semester resource with comprehensive endpoints.
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
    getAllSemestersQuerySchema,
    getSemesterCountQuerySchema,
    searchSemestersQuerySchema,
    semesterNumberParamSchema,
    semesterTypeParamSchema,
} from "../../../validations/semester.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

// Special routes that must come before the /:id route to avoid conflicts
router.get(
    "/count",
    validate(getSemesterCountQuerySchema),
    SemesterController.getSemesterCount
);

router.get(
    "/search",
    validate(searchSemestersQuerySchema),
    SemesterController.searchSemesters
);

router.get(
    "/by-department-year",
    validate(semesterQuerySchema),
    SemesterController.getSemestersByDepartmentAndYear
);

router.get(
    "/number/:semesterNumber",
    validate(semesterNumberParamSchema),
    SemesterController.getSemestersBySemesterNumber
);

router.get(
    "/type/:semesterType",
    validate(semesterTypeParamSchema),
    SemesterController.getSemestersBySemesterType
);

// Restore and hard delete routes
router.patch(
    "/:id/restore",
    authorize(Role.ADMIN),
    validate(semesterIdParamSchema),
    SemesterController.restoreSemester
);

router.delete(
    "/:id/hard",
    authorize(Role.ADMIN),
    validate(semesterIdParamSchema),
    SemesterController.hardDeleteSemester
);

// Main CRUD routes
router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createSemesterSchema),
        SemesterController.createSemester
    )
    .get(
        validate(getAllSemestersQuerySchema),
        SemesterController.getAllSemesters
    );

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
