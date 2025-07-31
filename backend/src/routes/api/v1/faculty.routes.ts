/**
 * @file src/routes/api/v1/faculty.routes.ts
 * @description Defines API routes for the Faculty resource.
 */

import { Router } from "express";
import { FacultyController } from "../../../controllers/faculty.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createFacultySchema,
    updateFacultySchema,
    facultyIdParamSchema,
    facultyQuerySchema,
} from "../../../validations/faculty.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate, authorize(Role.ADMIN));

router
    .route("/")
    .post(validate(createFacultySchema), FacultyController.createFaculty)
    .get(validate(facultyQuerySchema), FacultyController.getAllFaculties);

router
    .route("/:id")
    .get(validate(facultyIdParamSchema), FacultyController.getFacultyById)
    .patch(validate(updateFacultySchema), FacultyController.updateFaculty)
    .delete(validate(facultyIdParamSchema), FacultyController.deleteFaculty);

export default router;
