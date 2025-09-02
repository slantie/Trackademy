/**
 * @file src/routes/internship.routes.ts
 * @description Routes for internship-related API endpoints.
 */

import { Router } from "express";
import { InternshipController } from "../controllers/internship.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

/**
 * @route POST /api/v1/internships
 * @desc Create a new internship record
 * @access Private - Students only
 */
router.post(
  "/",
  authorize(Role.STUDENT),
  InternshipController.createInternship
);

/**
 * @route GET /api/v1/internships
 * @desc Get all internships for the logged-in student
 * @access Private - Students only
 */
router.get("/", authorize(Role.STUDENT), InternshipController.getMyInternships);

/**
 * @route GET /api/v1/internships/student/:studentId
 * @desc Get internships for a specific student
 * @access Private - Faculty and Admin only
 */
router.get(
  "/student/:studentId",
  authorize(Role.FACULTY, Role.ADMIN),
  InternshipController.getStudentInternships
);

/**
 * @route GET /api/v1/internships/stats
 * @desc Get internship statistics
 * @access Private - Faculty and Admin only
 */
router.get(
  "/stats",
  authorize(Role.FACULTY, Role.ADMIN),
  InternshipController.getInternshipStats
);

/**
 * @route GET /api/v1/internships/:id
 * @desc Get a single internship by ID
 * @access Private - Students can view their own, Faculty/Admin can view any
 */
router.get(
  "/:id",
  authorize(Role.STUDENT, Role.FACULTY, Role.ADMIN),
  InternshipController.getInternshipById
);

/**
 * @route PATCH /api/v1/internships/:id
 * @desc Update an internship record
 * @access Private - Students can update their own only
 */
router.patch(
  "/:id",
  authorize(Role.STUDENT),
  InternshipController.updateInternship
);

/**
 * @route DELETE /api/v1/internships/:id
 * @desc Delete an internship record
 * @access Private - Students can delete their own only
 */
router.delete(
  "/:id",
  authorize(Role.STUDENT),
  InternshipController.deleteInternship
);

export default router;
