/**
 * @file src/routes/v1/faculty.routes.ts
 * @description Defines API routes for the Faculty resource.
 */

import { Router } from "express";
import { FacultyController } from "../../controllers/faculty.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
    updateFacultySchema,
    facultyIdParamSchema,
    facultyQuerySchema,
} from "../../validations/faculty.validation";
import { Role } from "@prisma/client";

const router = Router();

// All faculty routes are protected and admin-only.
router.use(authenticate, authorize(Role.ADMIN));

// Routes for listing faculty.
router
    .route("/")
    .get(validate(facultyQuerySchema), FacultyController.getAllFaculties);

// Routes for getting, updating, and deleting a specific faculty profile.
router
    .route("/:id")
    .get(validate(facultyIdParamSchema), FacultyController.getFacultyById)
    .patch(validate(updateFacultySchema), FacultyController.updateFaculty)
    .delete(validate(facultyIdParamSchema), FacultyController.deleteFaculty);

export default router;
