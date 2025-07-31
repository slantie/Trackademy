/**
 * @file src/routes/api/v1/student.routes.ts
 * @description Defines API routes for the Student resource.
 */

import { Router } from "express";
import { StudentController } from "../../../controllers/student.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createStudentSchema,
    updateStudentSchema,
    studentIdParamSchema,
    studentQuerySchema,
} from "../../../validations/student.validation";
import { Role } from "@prisma/client";

const router = Router();

// All student management routes are protected and admin-only.
router.use(authenticate, authorize(Role.ADMIN));

router
    .route("/")
    .post(validate(createStudentSchema), StudentController.createStudent)
    .get(validate(studentQuerySchema), StudentController.getAllStudents);

router
    .route("/:id")
    .get(validate(studentIdParamSchema), StudentController.getStudentById)
    .patch(validate(updateStudentSchema), StudentController.updateStudent)
    .delete(validate(studentIdParamSchema), StudentController.deleteStudent);

export default router;
