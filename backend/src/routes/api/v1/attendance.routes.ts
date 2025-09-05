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
  createBulkAttendanceSchema,
} from "../../../validations/attendance.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

// Get faculty courses
router.get(
  "/faculty/courses",
  authorize(Role.FACULTY),
  AttendanceController.getFacultyCourses
);

// Get students for a specific course
router.get(
  "/course/:courseId/students",
  authorize(Role.FACULTY, Role.ADMIN),
  AttendanceController.getCourseStudents
);

// Download attendance template for a specific course
router.get(
  "/course/:courseId/template",
  authorize(Role.FACULTY, Role.ADMIN),
  AttendanceController.downloadAttendanceTemplate
);

// A single GET endpoint for both faculty and students, handled by the controller
router.get(
  "/",
  validate(attendanceQuerySchema),
  AttendanceController.getAttendance
);

// Create bulk attendance records for a course
router.post(
  "/",
  // authorize(Role.FACULTY, Role.ADMIN),
  validate(createBulkAttendanceSchema),
  AttendanceController.createAttendance
);

// Only faculty/admins can update an attendance record
router.patch(
  "/:id",
  // authorize(Role.ADMIN, Role.FACULTY),
  validate(updateAttendanceSchema),
  AttendanceController.updateAttendance
);

export default router;
