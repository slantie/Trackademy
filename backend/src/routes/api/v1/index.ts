/**
 * @file src/api/index.ts
 * @description Main API routes aggregator
 */

import { Router } from "express";
import authRoutes from "./auth.routes";
import protectedRoutes from "./protected.routes";
import collegeRoutes from "./college.routes";
import academicYearRoutes from "./academicYear.routes";
import departmentRoutes from "./department.routes";
import semesterRoutes from "./semester.routes";
import divisionRoutes from "./division.routes";
import subjectRoutes from "./subject.routes";
import facultyRoutes from "./faculty.routes";
import databaseRoutes from "./database.routes";
import studentRoutes from "./student.routes";
import serviceRoutes from "./service.routes";
import uploadRoutes from "./upload.routes";
import courseRoutes from "./course.routes";
import examRoutes from "./exam.routes";
import examResultRoutes from "./examResult.routes";
import attendanceRoutes from "./attendance.routes";

const router = Router();

// Mount Authentication Routes
router.use("/auth", authRoutes);
router.use("/protected", protectedRoutes);

// Mount Main Routes
router.use("/colleges", collegeRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/departments", departmentRoutes);
router.use("/semesters", semesterRoutes);
router.use("/divisions", divisionRoutes);
router.use("/subjects", subjectRoutes);
router.use("/faculties", facultyRoutes);
router.use("/database", databaseRoutes);
router.use("/students", studentRoutes);
router.use("/service", serviceRoutes);
router.use("/upload", uploadRoutes);
router.use("/courses", courseRoutes);
router.use("/exams", examRoutes);
router.use("/exam-results", examResultRoutes);
router.use("/attendance", attendanceRoutes);

export default router;
