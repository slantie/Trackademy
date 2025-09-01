/**
 * @file src/tests/attendance.test.ts
 * @description Robust, independent integration tests for the Attendance CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import {
  Designation,
  LectureType,
  Role,
  SemesterType,
  AttendanceStatus,
} from "@prisma/client";
import { hashPassword } from "../utils/hash";

describe("Attendance CRUD API Endpoints", () => {
  let adminToken: string, facultyToken: string, studentToken: string;
  let testData: any = {};
  const TEST_COLLEGE_NAME = "Attendance CRUD Test College";

  beforeAll(async () => {
    const adminLogin = await request(app).post("/api/v1/auth/login").send({
      identifier: "admin_ce@ldrp.ac.in",
      password: "password123",
    });
    adminToken = adminLogin.body.token;

    // --- Robust Cleanup (correct dependency order) ---
    // 1. Delete most dependent records first
    await prisma.attendance.deleteMany({});
    await prisma.studentEnrollment.deleteMany({});

    // 2. Delete courses
    await prisma.course.deleteMany({});

    // 3. Delete students and their users
    await prisma.student.deleteMany({
      where: { user: { email: { contains: "@attendcrud.edu" } } },
    });

    // 4. Delete faculty and their users
    await prisma.faculty.deleteMany({
      where: { user: { email: { contains: "@attendcrud.edu" } } },
    });

    // 5. Delete users
    await prisma.user.deleteMany({
      where: { email: { contains: "@attendcrud.edu" } },
    });

    // 6. Delete divisions
    await prisma.division.deleteMany({
      where: {
        semester: {
          academicYear: { college: { name: TEST_COLLEGE_NAME } },
        },
      },
    });

    // 7. Delete semesters
    await prisma.semester.deleteMany({
      where: { academicYear: { college: { name: TEST_COLLEGE_NAME } } },
    });

    // 8. Delete subjects
    await prisma.subject.deleteMany({
      where: { department: { college: { name: TEST_COLLEGE_NAME } } },
    });

    // 9. Delete departments
    await prisma.department.deleteMany({
      where: { college: { name: TEST_COLLEGE_NAME } },
    });

    // 10. Delete academic years
    await prisma.academicYear.deleteMany({
      where: { college: { name: TEST_COLLEGE_NAME } },
    });

    // 11. Finally delete colleges
    await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

    // --- Create a full hierarchy of test data ---
    testData.college = await prisma.college.create({
      data: { name: TEST_COLLEGE_NAME, abbreviation: "ACTC" },
    });
    testData.department = await prisma.department.create({
      data: {
        name: "Test Dept For Attend CRUD",
        abbreviation: "TDAC",
        collegeId: testData.college.id,
      },
    });
    testData.academicYear = await prisma.academicYear.create({
      data: {
        year: "2091-2092",
        collegeId: testData.college.id,
        isActive: true,
      },
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
      data: { name: "AC1", semesterId: testData.semester.id },
    });
    testData.subject = await prisma.subject.create({
      data: {
        name: "Attendance CRUD Subject",
        abbreviation: "ACS",
        code: "AC101",
        semesterNumber: 1,
        departmentId: testData.department.id,
      },
    });

    const facultyUser = await prisma.user.create({
      data: {
        email: "attendance.faculty@attendcrud.edu",
        password: await hashPassword("password123"),
        role: Role.FACULTY,
      },
    });
    testData.faculty = await prisma.faculty.create({
      data: {
        fullName: "Prof. Attend CRUD",
        abbreviation: "PAC",
        designation: Designation.PROFESSOR,
        userId: facultyUser.id,
        departmentId: testData.department.id,
      },
    });
    const facultyLogin = await request(app).post("/api/v1/auth/login").send({
      identifier: "attendance.faculty@attendcrud.edu",
      password: "password123",
    });
    facultyToken = facultyLogin.body.token;

    testData.course = await prisma.course.create({
      data: {
        subjectId: testData.subject.id,
        facultyId: testData.faculty.id,
        semesterId: testData.semester.id,
        divisionId: testData.division.id,
        lectureType: LectureType.THEORY,
      },
    });

    const studentUser = await prisma.user.create({
      data: {
        email: "attendance.student@attendcrud.edu",
        password: await hashPassword("password123"),
        role: Role.STUDENT,
      },
    });
    testData.student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        fullName: "Student Attend",
        enrollmentNumber: "ATTENDCRUD01",
        batch: "B1",
        departmentId: testData.department.id,
        semesterId: testData.semester.id,
        divisionId: testData.division.id,
      },
    });
    const studentLogin = await request(app)
      .post("/api/v1/auth/login")
      .send({ identifier: "ATTENDCRUD01", password: "password123" });
    studentToken = studentLogin.body.token;

    // Create an attendance record to test with
    testData.attendanceRecord = await prisma.attendance.create({
      data: {
        date: new Date("2025-08-01T00:00:00.000Z"),
        status: AttendanceStatus.PRESENT,
        courseId: testData.course.id,
        studentId: testData.student.id,
      },
    });
  });

  it("Faculty should be able to get attendance for their course on a specific date", async () => {
    const response = await request(app)
      .get(
        `/api/v1/attendance?courseId=${testData.course.id}&date=${new Date(
          "2025-08-01T00:00:00.000Z"
        ).toISOString()}`
      )
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBe(1);
    expect(response.body.data.attendance[0].status).toBe("PRESENT");
  });

  it("Student should be able to get their attendance summary for a semester", async () => {
    const response = await request(app)
      .get(`/api/v1/attendance?semesterId=${testData.semester.id}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBe(1);
    expect(response.body.data.attendance[0].presentCount).toBe(1);
    expect(response.body.data.attendance[0].percentage).toBe(100);
  });

  it("Faculty should be able to update an attendance record", async () => {
    const response = await request(app)
      .patch(`/api/v1/attendance/${testData.attendanceRecord.id}`)
      .set("Authorization", `Bearer ${facultyToken}`)
      .send({ status: AttendanceStatus.ABSENT });

    expect(response.status).toBe(200);
    expect(response.body.data.attendance.status).toBe("ABSENT");
  });

  it("Student should be blocked from updating an attendance record", async () => {
    const response = await request(app)
      .patch(`/api/v1/attendance/${testData.attendanceRecord.id}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ status: AttendanceStatus.PRESENT });

    expect(response.status).toBe(403); // Forbidden
  });

  afterAll(async () => {
    // Cleanup in correct dependency order (most dependent to least dependent)
    // 1. Delete most dependent records first
    await prisma.attendance.deleteMany({});
    await prisma.studentEnrollment.deleteMany({});

    // 2. Delete courses
    await prisma.course.deleteMany({});

    // 3. Delete students and their users
    await prisma.student.deleteMany({
      where: { user: { email: { contains: "@attendcrud.edu" } } },
    });

    // 4. Delete faculty and their users
    await prisma.faculty.deleteMany({
      where: { departmentId: testData.department?.id },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: "@attendcrud.edu" } },
    });

    // 5. Delete subjects
    await prisma.subject.deleteMany({
      where: { departmentId: testData.department?.id },
    });

    // 6. Delete divisions
    await prisma.division.deleteMany({
      where: { semesterId: testData.semester?.id },
    });

    // 7. Delete semesters
    await prisma.semester.deleteMany({
      where: { id: testData.semester?.id },
    });

    // 8. Delete departments
    await prisma.department.deleteMany({
      where: { id: testData.department?.id },
    });

    // 9. Delete academic years
    await prisma.academicYear.deleteMany({
      where: { id: testData.academicYear?.id },
    });

    // 10. Finally delete colleges
    await prisma.college.deleteMany({ where: { id: testData.college?.id } });
  });
});
