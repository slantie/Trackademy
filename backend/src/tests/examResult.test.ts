/**
 * @file src/tests/examResult.test.ts
 * @description Robust, independent integration tests for the ExamResult API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { ExamType, SemesterType, ResultStatus, Role } from "@prisma/client";
import { hashPassword } from "../utils/hash";
import {
  cleanDatabaseAndSeedAdmin,
  getAdminToken,
  cleanupTestData,
} from "./helpers/testSetup";

describe("ExamResult API Endpoints", () => {
  let adminToken: string;
  let studentToken: string;
  let testStudent: any;
  let testExam: any;
  let testExamResult: any;
  let testDepartment: any;
  let testSemester: any;
  let testDivision: any;
  let testCollege: any;
  let testAcademicYear: any;

  const TEST_COLLEGE_NAME = "Result Test College";
  const TEST_STUDENT_EMAIL = "result.student@test.edu";
  const OTHER_STUDENT_EMAIL = "other.student@test.edu";

  beforeAll(async () => {
    // Clean database and seed admin
    await cleanDatabaseAndSeedAdmin();

    // Get admin token
    adminToken = await getAdminToken(request, app);

    // Create test data directly via Prisma for reliable setup
    testCollege = await prisma.college.create({
      data: { name: TEST_COLLEGE_NAME, abbreviation: "RTC" },
    });
    testDepartment = await prisma.department.create({
      data: {
        name: "Test Dept For Result",
        abbreviation: "TDR",
        collegeId: testCollege.id,
      },
    });
    testAcademicYear = await prisma.academicYear.create({
      data: { year: "2093-2094", collegeId: testCollege.id },
    });
    testSemester = await prisma.semester.create({
      data: {
        semesterNumber: 1,
        semesterType: SemesterType.ODD,
        departmentId: testDepartment.id,
        academicYearId: testAcademicYear.id,
      },
    });
    testDivision = await prisma.division.create({
      data: { name: "R1", semesterId: testSemester.id },
    });

    // FIX: Use a correctly hashed password for the test student
    const studentUser = await prisma.user.create({
      data: {
        email: TEST_STUDENT_EMAIL,
        password: await hashPassword("password123"),
        role: Role.STUDENT,
      },
    });
    testStudent = await prisma.student.create({
      data: {
        userId: studentUser.id,
        fullName: "Result Student",
        enrollmentNumber: "RESULT001",
        batch: "R1",
        departmentId: testDepartment.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
      },
    });

    const studentLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ identifier: "RESULT001", password: "password123" });
    studentToken = studentLogin.body.token;

    testExam = await prisma.exam.create({
      data: {
        name: "Result Test Exam",
        examType: ExamType.FINAL,
        semesterId: testSemester.id,
      },
    });
    testExamResult = await prisma.examResult.create({
      data: {
        examId: testExam.id,
        studentId: testStudent.id,
        studentEnrollmentNumber: testStudent.enrollmentNumber,
        spi: 8.5,
        cpi: 8.2,
        status: ResultStatus.PASS,
      },
    });
  });

  it("Admin should be able to get all results for an exam", async () => {
    const response = await request(app)
      .get(`/api/v1/exam-results?examId=${testExam.id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.results).toBe(1);
  });

  it("Student should be able to get their list of exam results", async () => {
    const response = await request(app)
      .get("/api/v1/exam-results")
      .set("Authorization", `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(response.body.results).toBe(1);
  });

  it("Student should be able to get their own detailed result by ID", async () => {
    const response = await request(app)
      .get(`/api/v1/exam-results/${testExamResult.id}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data.result.spi).toBe(8.5);
  });

  it("Student should be blocked from accessing another student's result by ID", async () => {
    const otherUser = await prisma.user.create({
      data: {
        email: OTHER_STUDENT_EMAIL,
        password: "123",
        role: Role.STUDENT,
      },
    });
    const otherStudent = await prisma.student.create({
      data: {
        userId: otherUser.id,
        fullName: "Other Student",
        enrollmentNumber: "OTHER001",
        batch: "R1",
        departmentId: testDepartment.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
      },
    });
    const otherResult = await prisma.examResult.create({
      data: {
        examId: testExam.id,
        studentId: otherStudent.id,
        studentEnrollmentNumber: "OTHER001",
        spi: 9.0,
        cpi: 9.0,
        status: ResultStatus.PASS,
      },
    });

    const response = await request(app)
      .get(`/api/v1/exam-results/${otherResult.id}`)
      .set("Authorization", `Bearer ${studentToken}`);
    expect(response.status).toBe(403);
  });

  afterAll(async () => {
    await cleanupTestData({
      colleges: [TEST_COLLEGE_NAME],
      users: [TEST_STUDENT_EMAIL, OTHER_STUDENT_EMAIL],
    });
  });
});
