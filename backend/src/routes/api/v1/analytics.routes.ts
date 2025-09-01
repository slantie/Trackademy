/**
 * @file src/routes/api/v1/analytics.routes.ts
 * @description Defines API routes for the Analytics resource.
 */

import { Router } from "express";
import { AnalyticsController } from "../../../controllers/analytics.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import { getResultsAnalyticsSchema } from "../../../validations/analytics.validation";
import { Role } from "@prisma/client";

const router = Router();

// All analytics routes require an authenticated user.
router.use(authenticate);

// This route is protected and only accessible by ADMIN and FACULTY roles.
router.get(
  "/results",
  authorize(Role.ADMIN, Role.FACULTY),
  validate(getResultsAnalyticsSchema),
  AnalyticsController.getResultsAnalytics
);

export default router;
