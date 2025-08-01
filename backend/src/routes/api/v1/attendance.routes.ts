/**
 * @file src/routes/api/v1/attendance.routes.ts
 * @description Defines API routes for the Attendance resource.
 */

import { Router } from "express";
import { AttendanceController } from "../../../controllers/attendance.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    updateAttendanceSchema,
    attendanceIdParamSchema,
    attendanceQuerySchema,
} from "../../../validations/attendance.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

// A single GET endpoint for both faculty and students, handled by the controller
router.get(
    "/",
    validate(attendanceQuerySchema),
    AttendanceController.getAttendance
);

// Only faculty/admins can update an attendance record
router.patch(
    "/:id",
    authorize(Role.ADMIN, Role.FACULTY),
    validate(updateAttendanceSchema),
    AttendanceController.updateAttendance
);

export default router;
