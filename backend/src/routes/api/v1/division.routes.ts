/**
 * @file src/routes/api/v1/division.routes.ts
 * @description Defines API routes for the Division resource.
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
} from "../../../validations/division.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createDivisionSchema),
        DivisionController.createDivision
    )
    .get(validate(divisionQuerySchema), DivisionController.getAllDivisions);

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
