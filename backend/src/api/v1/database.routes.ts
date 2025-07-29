/**
 * @file src/routes/v1/database.routes.ts
 * @description Defines API routes for administrative database operations.
 */

import { Router } from "express";
import { DatabaseController } from "../../controllers/database.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Protect this highly sensitive route. It requires the user to be authenticated and have the ADMIN role.
router.delete(
    "/clean",
    authenticate,
    authorize(Role.ADMIN),
    DatabaseController.cleanDatabase
);

export default router;
