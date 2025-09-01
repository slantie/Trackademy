/**
 * @file src/tests/exam.test.ts
 * @description Robust, independent integration tests for the Exam CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { ExamType, SemesterType } from "@prisma/client";

describe("Exam API Endpoints", () => {
  let adminToken: string;
  let testSemester: any;
  let newExamId: string;
  const TEST_COLLEGE_NAME = "Exam Test College";

  beforeAll(async () => {
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      identifier: "admin_ce@ldrp.ac.in",
      password: "password123",
    });
    adminToken = loginResponse.body.token;

    // Cleanup and setup
    // Cleanup in correct dependency order
    // 1. Delete most dependent records first
    await prisma.result.deleteMany({});
    await prisma.examResult.deleteMany({});

    // 2. Delete exams
    await prisma.exam.deleteMany({
      where: {
        semester: {
          academicYear: { college: { name: TEST_COLLEGE_NAME } },
        },
      },
    });

    // 3. Delete enrollments, attendance, courses, students
    await prisma.studentEnrollment.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.student.deleteMany({});

    // 4. Delete divisions
    await prisma.division.deleteMany({
      where: {
        semester: {
          academicYear: { college: { name: TEST_COLLEGE_NAME } },
        },
      },
    });

    // 5. Delete semesters
    await prisma.semester.deleteMany({
      where: { academicYear: { college: { name: TEST_COLLEGE_NAME } } },
    });

    // 6. Delete subjects and faculty
    await prisma.subject.deleteMany({
      where: { department: { college: { name: TEST_COLLEGE_NAME } } },
    });
    await prisma.faculty.deleteMany({
      where: { department: { college: { name: TEST_COLLEGE_NAME } } },
    });

    // 7. Delete departments
    await prisma.department.deleteMany({
      where: { college: { name: TEST_COLLEGE_NAME } },
    });

    // 8. Delete academic years
    await prisma.academicYear.deleteMany({
      where: { college: { name: TEST_COLLEGE_NAME } },
    });

    // 9. Finally delete colleges
    await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

    const college = await prisma.college.create({
      data: { name: TEST_COLLEGE_NAME, abbreviation: "EXTC" },
    });
    const department = await prisma.department.create({
      data: {
        name: "Test Dept For Exam",
        abbreviation: "TDE",
        collegeId: college.id,
      },
    });
    const academicYear = await prisma.academicYear.create({
      data: { year: "2094-2095", collegeId: college.id },
    });
    testSemester = await prisma.semester.create({
      data: {
        semesterNumber: 8,
        semesterType: SemesterType.EVEN,
        departmentId: department.id,
        academicYearId: academicYear.id,
      },
    });
  });

  it("should create a new exam", async () => {
    const response = await request(app)
      .post("/api/v1/exams")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Final Year Examination - May 2095",
        examType: ExamType.FINAL,
        semesterId: testSemester.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.exam.name).toBe(
      "Final Year Examination - May 2095"
    );
    newExamId = response.body.data.exam.id;
  });

  it("should get all exams for a semester", async () => {
    const response = await request(app)
      .get(`/api/v1/exams?semesterId=${testSemester.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBe(1);
  });

  it("should update the exam to be published", async () => {
    const response = await request(app)
      .patch(`/api/v1/exams/${newExamId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ isPublished: true });
    expect(response.status).toBe(200);
    expect(response.body.data.exam.isPublished).toBe(true);
  });

  it("should soft delete the exam", async () => {
    await request(app)
      .delete(`/api/v1/exams/${newExamId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    const getResponse = await request(app)
      .get(`/api/v1/exams/${newExamId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(getResponse.status).toBe(404);
  });

  afterAll(async () => {
    // Cleanup in correct dependency order
    // 1. Delete most dependent records first
    await prisma.result.deleteMany({});
    await prisma.examResult.deleteMany({});

    // 2. Delete exams
    await prisma.exam.deleteMany({
      where: { semesterId: testSemester.id },
    });

    // 3. Delete enrollments, attendance, courses, students
    await prisma.studentEnrollment.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.student.deleteMany({});

    // 4. Delete divisions
    await prisma.division.deleteMany({});

    // 5. Delete semesters
    await prisma.semester.deleteMany({ where: { id: testSemester.id } });

    // 6. Delete subjects and faculty
    await prisma.subject.deleteMany({});
    await prisma.faculty.deleteMany({});

    // 7. Delete departments
    await prisma.department.deleteMany({
      where: { college: { name: TEST_COLLEGE_NAME } },
    });

    // 8. Delete academic years
    await prisma.academicYear.deleteMany({
      where: { college: { name: TEST_COLLEGE_NAME } },
    });

    // 9. Finally delete colleges
    await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });
  });
});
