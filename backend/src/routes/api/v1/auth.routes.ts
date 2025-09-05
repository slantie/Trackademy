/**
 * @file src/routes/v1/auth.routes.ts
 * @description Defines API routes for authentication and user management.
 */

import { Router } from "express";
import { AuthController } from "../../../controllers/auth.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { Role } from "@prisma/client";
import {
  loginSchema,
  registerFacultySchema,
  registerAdminSchema,
  updatePasswordSchema,
  resetUserPasswordSchema,
  resetFacultyPasswordSchema,
} from "../../../validations/auth.validation";

const router = Router();

// --- Public Routes ---

// Route for any user (Student, Faculty, Admin) to log in.
router.post("/login", validate(loginSchema), AuthController.login);

// --- Protected Routes (Require Authentication) ---

// Route for an authenticated user to get their own profile.
router.get("/me", authenticate, AuthController.getProfile);

// Route for an authenticated user to update their own password.
router.patch(
  "/update-password",
  authenticate,
  validate(updatePasswordSchema),
  AuthController.updatePassword
);

// --- Admin-Only Routes ---

// Route for an Admin to reset any user's password by user ID.
router.patch(
  "/reset-password/user/:userId",
  authenticate,
  authorize(Role.ADMIN),
  validate(resetUserPasswordSchema),
  AuthController.resetUserPassword
);

// Route for an Admin to reset a faculty member's password by faculty ID.
router.patch(
  "/reset-password/faculty/:facultyId",
  authenticate,
  authorize(Role.ADMIN),
  validate(resetFacultyPasswordSchema),
  AuthController.resetFacultyPassword
);

// Route for an Admin to register a new Faculty member.
router.post(
  "/register/faculty",
  authenticate,
  authorize(Role.ADMIN),
  validate(registerFacultySchema),
  AuthController.registerFaculty
);

// Route for an Admin to register another Admin.
router.post(
  "/register/admin",
  // authenticate,
  // authorize(Role.ADMIN),
  validate(registerAdminSchema),
  AuthController.registerAdmin
);

export default router;
