/**
 * @file src/routes/v1/academicYear.routes.ts
 * @description Defines API routes for the AcademicYear resource.
 */

import { Router } from "express";
import { AcademicYearController } from "../../controllers/academicYear.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
    createAcademicYearSchema,
    updateAcademicYearSchema,
    academicYearIdParamSchema,
    academicYearQuerySchema,
} from "../../validations/academicYear.validation";
import { Role } from "@prisma/client";

const router = Router();

// All academic year routes require an authenticated user.
router.use(authenticate);

// Special route for getting the active year must come before the /:id route.
router.get(
    "/active",
    validate(academicYearQuerySchema),
    AcademicYearController.getActiveAcademicYear
);

// Routes for creating and listing academic years.
router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createAcademicYearSchema),
        AcademicYearController.createAcademicYear
    )
    .get(
        validate(academicYearQuerySchema),
        AcademicYearController.getAllAcademicYears
    );

// Routes for getting, updating, and deleting a specific academic year.
router
    .route("/:id")
    .get(
        validate(academicYearIdParamSchema),
        AcademicYearController.getAcademicYearById
    )
    .patch(
        authorize(Role.ADMIN),
        validate(updateAcademicYearSchema),
        AcademicYearController.updateAcademicYear
    )
    .delete(
        authorize(Role.ADMIN),
        validate(academicYearIdParamSchema),
        AcademicYearController.deleteAcademicYear
    );

export default router;
