/**
 * @file src/routes/v1/auth.routes.ts
 * @description Defines API routes for authentication and user management.
 */

import { Router } from "express";
import { AuthController } from "../../../controllers/auth.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// --- Public Routes ---

// Route for any user (Student, Faculty, Admin) to log in.
router.post("/login", AuthController.login);

// --- Protected Routes (Require Authentication) ---

// Route for an authenticated user to get their own profile.
router.get("/me", authenticate, AuthController.getProfile);

// Route for an authenticated user to update their own password.
router.patch("/update-password", authenticate, AuthController.updatePassword);

// --- Admin-Only Routes ---

// Route for an Admin to register a new Faculty member.
router.post(
    "/register/faculty",
    authenticate,
    authorize(Role.ADMIN),
    AuthController.registerFaculty
);

// Route for an Admin to register another Admin.
router.post(
    "/register/admin",
    // authenticate,
    // authorize(Role.ADMIN),
    AuthController.registerAdmin
);

export default router;
