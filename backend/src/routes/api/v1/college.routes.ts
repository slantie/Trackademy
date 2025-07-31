/**
 * @file src/routes/v1/college.routes.ts
 * @description Defines API routes for the College resource.
 */

import { Router } from "express";
import { CollegeController } from "../../../controllers/college.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createCollegeSchema,
    updateCollegeSchema,
    collegeIdParamSchema,
} from "../../../validations/college.validation";
import { Role } from "@prisma/client";

const router = Router();

// All college routes require an authenticated user.
router.use(authenticate);

// Routes for creating and listing colleges.
router
    .route("/")
    .post(
        authorize(Role.ADMIN), // Only Admins can create colleges
        validate(createCollegeSchema),
        CollegeController.createCollege
    )
    .get(CollegeController.getAllColleges); // Any authenticated user can view the list

// Routes for getting, updating, and deleting a specific college.
router
    .route("/:id")
    .get(validate(collegeIdParamSchema), CollegeController.getCollegeById)
    .patch(
        authorize(Role.ADMIN), // Only Admins can update colleges
        validate(updateCollegeSchema),
        CollegeController.updateCollege
    )
    .delete(
        authorize(Role.ADMIN), // Only Admins can delete colleges
        validate(collegeIdParamSchema),
        CollegeController.deleteCollege
    );

export default router;
