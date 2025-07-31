/**
 * @file src/routes/api/v1/department.routes.ts
 * @description Defines API routes for the Department resource.
 */

import { Router } from "express";
import { DepartmentController } from "../../../controllers/department.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createDepartmentSchema,
    updateDepartmentSchema,
    departmentIdParamSchema,
    departmentQuerySchema,
} from "../../../validations/department.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createDepartmentSchema),
        DepartmentController.createDepartment
    )
    .get(
        validate(departmentQuerySchema),
        DepartmentController.getAllDepartments
    );

router
    .route("/:id")
    .get(
        validate(departmentIdParamSchema),
        DepartmentController.getDepartmentById
    )
    .patch(
        authorize(Role.ADMIN),
        validate(updateDepartmentSchema),
        DepartmentController.updateDepartment
    )
    .delete(
        authorize(Role.ADMIN),
        validate(departmentIdParamSchema),
        DepartmentController.deleteDepartment
    );

export default router;
