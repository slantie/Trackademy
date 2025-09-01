/**
 * @file src/routes/api/v1/assignment.routes.ts
 * @description Defines API routes for the Assignment resource.
 */

import { Router } from "express";
import { AssignmentController } from "../../../controllers/assignment.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
  assignmentIdParamSchema,
  assignmentQuerySchema,
  assignmentStatisticsQuerySchema,
} from "../../../validations/assignment.validation";
import { Role } from "@prisma/client";

const router = Router();

// All assignment routes require authentication
router.use(authenticate);

// Assignment CRUD operations
router
  .route("/")
  .post(
    authorize(Role.FACULTY),
    validate(createAssignmentSchema),
    AssignmentController.createAssignment
  )
  .get(validate(assignmentQuerySchema), AssignmentController.getAllAssignments);

router
  .route("/statistics")
  .get(
    authorize(Role.FACULTY),
    validate(assignmentStatisticsQuerySchema),
    AssignmentController.getAssignmentStatistics
  );

router
  .route("/:id")
  .get(
    validate(assignmentIdParamSchema),
    AssignmentController.getAssignmentById
  )
  .put(
    authorize(Role.FACULTY),
    validate(assignmentIdParamSchema),
    validate(updateAssignmentSchema),
    AssignmentController.updateAssignment
  )
  .delete(
    authorize(Role.FACULTY),
    validate(assignmentIdParamSchema),
    AssignmentController.deleteAssignment
  );

export default router;
