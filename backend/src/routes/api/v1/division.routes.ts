/**
 * @file src/routes/api/v1/division.routes.ts
 * @description Enhanced API routes for the Division resource with comprehensive endpoints.
 */

import { Router } from "express";
import { DivisionController } from "../../../controllers/division.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createDivisionSchema,
    updateDivisionSchema,
    divisionIdParamSchema,
    divisionQuerySchema,
    getAllDivisionsQuerySchema,
    getDivisionCountQuerySchema,
    searchDivisionsQuerySchema,
    departmentParamSchema,
    academicYearParamSchema,
} from "../../../validations/division.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

// Special routes that must come before the /:id route to avoid conflicts
router.get(
    "/count",
    validate(getDivisionCountQuerySchema),
    DivisionController.getDivisionCount
);

router.get(
    "/search",
    validate(searchDivisionsQuerySchema),
    DivisionController.searchDivisions
);

router.get(
    "/by-semester",
    validate(divisionQuerySchema),
    DivisionController.getDivisionsBySemester
);

router.get(
    "/department/:departmentId",
    validate(departmentParamSchema),
    DivisionController.getDivisionsByDepartment
);

router.get(
    "/academic-year/:academicYearId",
    validate(academicYearParamSchema),
    DivisionController.getDivisionsByAcademicYear
);

// Restore and hard delete routes
router.patch(
    "/:id/restore",
    authorize(Role.ADMIN),
    validate(divisionIdParamSchema),
    DivisionController.restoreDivision
);

router.delete(
    "/:id/hard",
    authorize(Role.ADMIN),
    validate(divisionIdParamSchema),
    DivisionController.hardDeleteDivision
);

// Main CRUD routes
router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createDivisionSchema),
        DivisionController.createDivision
    )
    .get(
        validate(getAllDivisionsQuerySchema),
        DivisionController.getAllDivisions
    );

router
    .route("/:id")
    .get(validate(divisionIdParamSchema), DivisionController.getDivisionById)
    .patch(
        authorize(Role.ADMIN),
        validate(updateDivisionSchema),
        DivisionController.updateDivision
    )
    .delete(
        authorize(Role.ADMIN),
        validate(divisionIdParamSchema),
        DivisionController.deleteDivision
    );

export default router;
