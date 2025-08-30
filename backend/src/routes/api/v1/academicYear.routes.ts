/**
 * @file src/routes/api/v1/academicYear.routes.ts
 * @description Enhanced API routes for the AcademicYear resource with comprehensive endpoints.
 */

import { Router } from "express";
import { AcademicYearController } from "../../../controllers/academicYear.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createAcademicYearSchema,
    updateAcademicYearSchema,
    academicYearIdParamSchema,
    academicYearQuerySchema,
    getAllAcademicYearsQuerySchema,
    getAcademicYearCountQuerySchema,
    searchAcademicYearsQuerySchema,
    optionalCollegeQuerySchema,
    activateDeactivateAcademicYearSchema,
} from "../../../validations/academicYear.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

// Special routes that must come before the /:id route to avoid conflicts
router.get(
    "/active",
    validate(optionalCollegeQuerySchema),
    AcademicYearController.getActiveAcademicYear
);

router.get(
    "/active/all",
    validate(optionalCollegeQuerySchema),
    AcademicYearController.getActiveAcademicYears
);

router.get(
    "/count",
    validate(getAcademicYearCountQuerySchema),
    AcademicYearController.getAcademicYearCount
);

router.get(
    "/search",
    validate(searchAcademicYearsQuerySchema),
    AcademicYearController.searchAcademicYears
);

router.get(
    "/by-college",
    validate(academicYearQuerySchema),
    AcademicYearController.getAllAcademicYearsByCollege
);

// Activation and deactivation routes
router.patch(
    "/:id/activate",
    authorize(Role.ADMIN),
    validate(activateDeactivateAcademicYearSchema),
    AcademicYearController.activateAcademicYear
);

router.patch(
    "/:id/deactivate",
    authorize(Role.ADMIN),
    validate(activateDeactivateAcademicYearSchema),
    AcademicYearController.deactivateAcademicYear
);

// Restore and hard delete routes
router.patch(
    "/:id/restore",
    authorize(Role.ADMIN),
    validate(academicYearIdParamSchema),
    AcademicYearController.restoreAcademicYear
);

router.delete(
    "/:id/hard",
    authorize(Role.ADMIN),
    validate(academicYearIdParamSchema),
    AcademicYearController.hardDeleteAcademicYear
);

// Main CRUD routes
router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createAcademicYearSchema),
        AcademicYearController.createAcademicYear
    )
    .get(
        validate(getAllAcademicYearsQuerySchema),
        AcademicYearController.getAllAcademicYears
    );

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
