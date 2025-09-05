/**
 * @file src/routes/api/v1/course.routes.ts
 * @description Defines API routes for the Course resource.
 */

import { Router } from "express";
import { CourseController } from "../../../controllers/course.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
  createCourseSchema,
  courseIdParamSchema,
  courseQuerySchema,
} from "../../../validations/course.validation";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

router
  .route("/")
  .post(
    authorize(Role.ADMIN),
    validate(createCourseSchema),
    CourseController.createCourse
  )
  .get(
    authorize(Role.ADMIN, Role.FACULTY, Role.STUDENT),
    CourseController.getAllCourses
  );

router
  .route("/:id")
  .delete(
    authorize(Role.ADMIN),
    validate(courseIdParamSchema),
    CourseController.deleteCourse
  );

export default router;
