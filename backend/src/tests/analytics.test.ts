/**
 * @file src/tests/analytics.test.ts
 * @description Integration tests for the Analytics API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { Role, SemesterType, ExamType, ResultStatus } from "@prisma/client";
import { hashPassword } from "../utils/hash";
import {
  cleanDatabaseAndSeedAdmin,
  getAdminToken,
  cleanupTestData,
} from "./helpers/testSetup";

describe("Analytics API Endpoint", () => {
  let adminToken: string;
  let facultyToken: string;
  let studentToken: string;
  let testData: any = {};
  const TEST_COLLEGE_NAME = "Analytics Test College";

  beforeAll(async () => {
    // Clean database and seed admin
    await cleanDatabaseAndSeedAdmin();

    // Get admin token
    adminToken = await getAdminToken(request, app);

    // --- Create a full hierarchy of test data ---
    testData.college = await prisma.college.create({
      data: { name: TEST_COLLEGE_NAME, abbreviation: "ANTC" },
    });
    testData.department = await prisma.department.create({
      data: {
        name: "Analytics Test Dept",
        abbreviation: "ATD",
        collegeId: testData.college.id,
      },
    });
    testData.academicYear = await prisma.academicYear.create({
      data: { year: "2090-2091", collegeId: testData.college.id },
    });
    testData.semester = await prisma.semester.create({
      data: {
        semesterNumber: 1,
        semesterType: SemesterType.ODD,
        departmentId: testData.department.id,
        academicYearId: testData.academicYear.id,
      },
    });
    testData.division = await prisma.division.create({
      data: { name: "A1", semesterId: testData.semester.id },
    });

    const facultyUser = await prisma.user.create({
      data: {
        email: "analytics.faculty@analyticstest.edu",
        password: await hashPassword("password123"),
        role: Role.FACULTY,
      },
    });
    testData.faculty = await prisma.faculty.create({
      data: {
        fullName: "Prof. Analytics",
        designation: "PROFESSOR",
        userId: facultyUser.id,
        departmentId: testData.department.id,
      },
    });
    const facultyLogin = await request(app).post("/api/v1/auth/login").send({
      identifier: "analytics.faculty@analyticstest.edu",
      password: "password123",
    });
    facultyToken = facultyLogin.body.token;

    const studentUser = await prisma.user.create({
      data: {
        email: "analytics.student@analyticstest.edu",
        password: await hashPassword("password123"),
        role: Role.STUDENT,
      },
    });
    testData.student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        fullName: "Student Analytics",
        enrollmentNumber: "ANALYTICS01",
        batch: "B1",
        departmentId: testData.department.id,
        semesterId: testData.semester.id,
        divisionId: testData.division.id,
      },
    });
    const studentLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ identifier: "ANALYTICS01", password: "password123" });
    studentToken = studentLogin.body.token;

    testData.exam = await prisma.exam.create({
      data: {
        name: "Analytics Test Exam",
        examType: ExamType.MIDTERM,
        semesterId: testData.semester.id,
      },
    });

    await prisma.examResult.createMany({
      data: [
        {
          examId: testData.exam.id,
          studentId: testData.student.id,
          studentEnrollmentNumber: "ANALYTICS01",
          spi: 9.0,
          cpi: 9.0,
          status: ResultStatus.PASS,
        },
        {
          examId: testData.exam.id,
          studentEnrollmentNumber: "ANALYTICS02",
          spi: 5.0,
          cpi: 5.5,
          status: ResultStatus.FAIL,
        },
      ],
    });
  });

  it("Admin should be able to get unfiltered result analytics", async () => {
    const response = await request(app)
      .get(`/api/v1/analytics/results`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    const stats = response.body.data.statistics;
    expect(stats.totalResults).toBeGreaterThanOrEqual(2);
    expect(stats).toHaveProperty("passCount");
    expect(stats).toHaveProperty("failCount");
    expect(stats).toHaveProperty("averageSpi");
  });

  it("Faculty should be able to get result analytics filtered by department", async () => {
    const response = await request(app)
      .get(`/api/v1/analytics/results?departmentId=${testData.department.id}`)
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(200);
    const stats = response.body.data.statistics;
    expect(stats.totalResults).toBe(2);
    expect(stats.passCount).toBe(1);
    expect(stats.failCount).toBe(1);
    expect(stats.averageSpi).toBe(7.0); // (9.0 + 5.0) / 2
  });

  it("Student should be blocked from accessing the analytics endpoint", async () => {
    const response = await request(app)
      .get(`/api/v1/analytics/results`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(403); // Forbidden
  });

  it("Should return a 400 Bad Request for an invalid filter ID", async () => {
    const response = await request(app)
      .get(`/api/v1/analytics/results?departmentId=invalid-cuid`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(400);
  });

  afterAll(async () => {
    await cleanupTestData({
      colleges: [TEST_COLLEGE_NAME],
      departments: ["Analytics Test Dept"],
      users: ["faculty@analyticstest.edu", "student@analyticstest.edu"],
    });
  });
});
