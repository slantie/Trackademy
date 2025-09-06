/**
 * @file src/routes/api/v1/faculty.routes.ts
 * @description Enhanced API routes for the Faculty resource.
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
  facultyCountQuerySchema,
  facultySearchQuerySchema,
  facultyDesignationParamSchema,
  facultyDeleteSchema,
  facultyGroupedQuerySchema,
} from "../../../validations/faculty.validation";
import { resetFacultyPasswordSchema } from "../../../validations/auth.validation";
import { Role } from "@prisma/client";

const router = Router();

// Public routes (no authentication required)
router
  .route("/:id/public-profile")
  .get(validate(facultyIdParamSchema), FacultyController.getPublicProfile);

// Apply authentication to all other routes
router.use(authenticate);

// Main faculty routes
router
  .route("/")
  .post(
    authorize(Role.ADMIN),
    validate(createFacultySchema),
    FacultyController.createFaculty
  )
  .get(validate(facultyQuerySchema), FacultyController.getAllFaculties);

// Count route
router
  .route("/count")
  .get(validate(facultyCountQuerySchema), FacultyController.getFacultyCount);

// Search route
router
  .route("/search")
  .get(validate(facultySearchQuerySchema), FacultyController.searchFaculties);

// Grouped by designation route
router
  .route("/grouped")
  .get(
    validate(facultyGroupedQuerySchema),
    FacultyController.getFacultiesGroupedByDesignation
  );

// Designation-based retrieval route
router
  .route("/designation/:designation")
  .get(
    validate(facultyDesignationParamSchema),
    FacultyController.getFacultiesByDesignation
  );

// Individual faculty routes
router
  .route("/:id")
  .get(validate(facultyIdParamSchema), FacultyController.getFacultyById)
  .patch(
    authorize(Role.ADMIN),
    validate(updateFacultySchema),
    FacultyController.updateFaculty
  )
  .delete(
    authorize(Role.ADMIN),
    validate(facultyDeleteSchema),
    FacultyController.deleteFaculty
  );

// Restore route
router
  .route("/:id/restore")
  .patch(
    authorize(Role.ADMIN),
    validate(facultyIdParamSchema),
    FacultyController.restoreFaculty
  );

// Password reset route
router
  .route("/:id/reset-password")
  .patch(
    authorize(Role.ADMIN),
    validate(resetFacultyPasswordSchema),
    FacultyController.resetPassword
  );

export default router;
