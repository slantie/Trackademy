/**
 * @file src/routes/api/v1/examResult.routes.ts
 * @description Enhanced API routes for the ExamResult resource with comprehensive CRUD operations.
 */

import { Router } from "express";
import { ExamResultController } from "../../../controllers/examResult.controller";
import { authenticate, authorize } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate.middleware";
import {
    createExamResultSchema,
    updateExamResultSchema,
    examResultIdParamSchema,
    examIdParamSchema,
    studentIdParamSchema,
    studentEnrollmentParamSchema,
    semesterIdParamSchema,
    departmentIdParamSchema,
    resultStatusParamSchema,
    examResultListQuerySchema,
    examResultCountQuerySchema,
    examResultSearchQuerySchema,
    examResultFilterQuerySchema,
    examResultStatisticsQuerySchema,
    listResultsByExamSchema,
} from "../../../validations/examResult.validation";
import { Role } from "@prisma/client";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin-only routes for comprehensive CRUD operations
// router.use("/admin", authorize(Role.ADMIN));

router
    .route("/admin")
    .post(
        validate(createExamResultSchema),
        ExamResultController.createExamResult
    )
    .get(
        validate(examResultListQuerySchema),
        ExamResultController.getAllExamResults
    );

router.get(
    "/admin/count",
    validate(examResultCountQuerySchema),
    ExamResultController.getExamResultCount
);

router.get(
    "/admin/search",
    validate(examResultSearchQuerySchema),
    ExamResultController.searchExamResults
);

router.get(
    "/admin/statistics",
    validate(examResultStatisticsQuerySchema),
    ExamResultController.getStatistics
);

router.get(
    "/admin/top-performers",
    validate(examResultFilterQuerySchema),
    ExamResultController.getTopPerformers
);

router.get(
    "/admin/status/:status",
    validate(resultStatusParamSchema),
    validate(examResultFilterQuerySchema),
    ExamResultController.getExamResultsByStatus
);

router.get(
    "/admin/exam/:examId",
    validate(examIdParamSchema),
    ExamResultController.getExamResultsByExam
);

router.get(
    "/admin/student/:studentId",
    validate(studentIdParamSchema),
    ExamResultController.getExamResultsByStudent
);

router.get(
    "/admin/enrollment/:enrollmentNumber",
    validate(studentEnrollmentParamSchema),
    ExamResultController.getExamResultsByStudentEnrollment
);

router.get(
    "/admin/semester/:semesterId",
    validate(semesterIdParamSchema),
    validate(examResultFilterQuerySchema),
    ExamResultController.getExamResultsBySemester
);

router.get(
    "/admin/department/:departmentId",
    validate(departmentIdParamSchema),
    validate(examResultFilterQuerySchema),
    ExamResultController.getExamResultsByDepartment
);

router
    .route("/admin/:id")
    .get(validate(examResultIdParamSchema), ExamResultController.getResultById)
    .patch(
        validate(updateExamResultSchema),
        ExamResultController.updateExamResult
    )
    .delete(
        validate(examResultIdParamSchema),
        ExamResultController.deleteExamResult
    );

// Faculty routes (read-only access to results)
router.use("/faculty", authorize(Role.FACULTY));

router.get(
    "/faculty",
    validate(examResultListQuerySchema),
    ExamResultController.getAllExamResults
);

router.get(
    "/faculty/count",
    validate(examResultCountQuerySchema),
    ExamResultController.getExamResultCount
);

router.get(
    "/faculty/search",
    validate(examResultSearchQuerySchema),
    ExamResultController.searchExamResults
);

router.get(
    "/faculty/statistics",
    validate(examResultStatisticsQuerySchema),
    ExamResultController.getStatistics
);

router.get(
    "/faculty/top-performers",
    validate(examResultFilterQuerySchema),
    ExamResultController.getTopPerformers
);

router.get(
    "/faculty/status/:status",
    validate(resultStatusParamSchema),
    validate(examResultFilterQuerySchema),
    ExamResultController.getExamResultsByStatus
);

router.get(
    "/faculty/exam/:examId",
    validate(examIdParamSchema),
    ExamResultController.getExamResultsByExam
);

router.get(
    "/faculty/student/:studentId",
    validate(studentIdParamSchema),
    ExamResultController.getExamResultsByStudent
);

router.get(
    "/faculty/enrollment/:enrollmentNumber",
    validate(studentEnrollmentParamSchema),
    ExamResultController.getExamResultsByStudentEnrollment
);

router.get(
    "/faculty/semester/:semesterId",
    validate(semesterIdParamSchema),
    validate(examResultFilterQuerySchema),
    ExamResultController.getExamResultsBySemester
);

router.get(
    "/faculty/department/:departmentId",
    validate(departmentIdParamSchema),
    validate(examResultFilterQuerySchema),
    ExamResultController.getExamResultsByDepartment
);

router.get(
    "/faculty/:id",
    validate(examResultIdParamSchema),
    ExamResultController.getResultById
);

// Public routes - role-based access handled in controller
router.get("/", ExamResultController.getResults);

router.get(
    "/:id",
    validate(examResultIdParamSchema),
    ExamResultController.getResultById
);

export default router;
