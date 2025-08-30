/**
 * @file src/routes/api/v1/student.routes.ts
 * @description Enhanced API routes for the Student resource with comprehensive CRUD operations and role-based access control.
 */

import { Router } from "express";
import { StudentController } from "../../../controllers/student.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createStudentSchema,
    updateStudentSchema,
    studentIdParamSchema,
    enrollmentNumberParamSchema,
    departmentIdParamSchema,
    semesterIdParamSchema,
    divisionIdParamSchema,
    batchParamSchema,
    getAllStudentsQuerySchema,
    searchStudentsQuerySchema,
    getStudentsCountQuerySchema,
    getStudentsByDepartmentQuerySchema,
    getStudentsBySemesterQuerySchema,
    getStudentsByBatchQuerySchema,
    getStudentStatisticsQuerySchema,
} from "../../../validations/student.validation";
import { Role } from "@prisma/client";

const router = Router();

// Public routes (authentication required but accessible to all roles)
router.use(authenticate);

// Search students - accessible to faculty and admin
router.get(
    "/search",
    authorize(Role.FACULTY, Role.ADMIN),
    validate(searchStudentsQuerySchema),
    StudentController.searchStudents
);

// Get students count - accessible to faculty and admin
router.get(
    "/count",
    authorize(Role.FACULTY, Role.ADMIN),
    validate(getStudentsCountQuerySchema),
    StudentController.getStudentsCount
);

// Get student statistics - admin only
router.get(
    "/statistics",
    authorize(Role.ADMIN),
    validate(getStudentStatisticsQuerySchema),
    StudentController.getStudentStatistics
);

// Get students by specific filters - accessible to faculty and admin
router.get(
    "/department/:departmentId",
    authorize(Role.FACULTY, Role.ADMIN),
    validate(departmentIdParamSchema),
    validate(getStudentsByDepartmentQuerySchema),
    StudentController.getStudentsByDepartment
);

router.get(
    "/semester/:semesterId",
    authorize(Role.FACULTY, Role.ADMIN),
    validate(semesterIdParamSchema),
    validate(getStudentsBySemesterQuerySchema),
    StudentController.getStudentsBySemester
);

router.get(
    "/division/:divisionId",
    authorize(Role.FACULTY, Role.ADMIN),
    validate(divisionIdParamSchema),
    StudentController.getStudentsByDivision
);

router.get(
    "/batch/:batch",
    authorize(Role.FACULTY, Role.ADMIN),
    validate(batchParamSchema),
    validate(getStudentsByBatchQuerySchema),
    StudentController.getStudentsByBatch
);

// Get student by enrollment number - accessible to faculty and admin
router.get(
    "/enrollment/:enrollmentNumber",
    authorize(Role.FACULTY, Role.ADMIN),
    validate(enrollmentNumberParamSchema),
    StudentController.getStudentByEnrollmentNumber
);

// Student management routes - admin only
router
    .route("/")
    .post(
        authorize(Role.ADMIN),
        validate(createStudentSchema),
        StudentController.createStudent
    )
    .get(
        authorize(Role.FACULTY, Role.ADMIN),
        validate(getAllStudentsQuerySchema),
        StudentController.getAllStudents
    );

// Individual student operations
router
    .route("/:id")
    .get(
        authorize(Role.FACULTY, Role.ADMIN),
        validate(studentIdParamSchema),
        StudentController.getStudentById
    )
    .patch(
        authorize(Role.ADMIN),
        validate(updateStudentSchema),
        StudentController.updateStudent
    )
    .delete(
        authorize(Role.ADMIN),
        validate(studentIdParamSchema),
        StudentController.deleteStudent
    );

// Get student with full relations - accessible to faculty and admin
router.get(
    "/:id/details",
    authorize(Role.FACULTY, Role.ADMIN),
    validate(studentIdParamSchema),
    StudentController.getStudentByIdWithRelations
);

// Restore deleted student - admin only
router.patch(
    "/:id/restore",
    authorize(Role.ADMIN),
    validate(studentIdParamSchema),
    StudentController.restoreStudent
);

// Hard delete student - super admin operation
router.delete(
    "/:id/hard",
    authorize(Role.ADMIN),
    validate(studentIdParamSchema),
    StudentController.hardDeleteStudent
);

export default router;
