/**
 * @file src/tests/assignment.test.ts
 * @description Integration tests for assignment-related API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { Role, LectureType, SubjectType } from "@prisma/client";
import { hashPassword } from "../utils/hash";
import {
  cleanDatabaseAndSeedAdmin,
  getAdminToken,
  cleanupTestData,
} from "./helpers/testSetup";

describe("Assignment API Endpoints", () => {
  let adminToken: string;
  let facultyToken: string;
  let studentToken: string;
  let testCollege: any;
  let testDepartment: any;
  let testAcademicYear: any;
  let testSemester: any;
  let testDivision: any;
  let testSubject: any;
  let testFaculty: any;
  let testStudent: any;
  let testCourse: any;
  let newAssignmentId: string;

  beforeAll(async () => {
    // Clean database and seed admin
    await cleanDatabaseAndSeedAdmin();

    // Get admin token
    adminToken = await getAdminToken(request, app);

    // Create test data directly via Prisma for faster setup
    testCollege = await prisma.college.create({
      data: {
        name: "Assignment Test College",
        abbreviation: "ATC",
      },
    });

    testDepartment = await prisma.department.create({
      data: {
        name: "Assignment Test Department",
        abbreviation: "ATD",
        collegeId: testCollege.id,
      },
    });

    testAcademicYear = await prisma.academicYear.create({
      data: {
        year: "2025-26",
        collegeId: testCollege.id,
        isActive: true,
      },
    });

    testSemester = await prisma.semester.create({
      data: {
        semesterNumber: 7,
        semesterType: "ODD",
        departmentId: testDepartment.id,
        academicYearId: testAcademicYear.id,
      },
    });

    testDivision = await prisma.division.create({
      data: {
        name: "A",
        semesterId: testSemester.id,
      },
    });

    testSubject = await prisma.subject.create({
      data: {
        name: "Assignment Test Subject",
        abbreviation: "ATS",
        code: "ATS101",
        type: SubjectType.MANDATORY,
        semesterNumber: 7,
        departmentId: testDepartment.id,
      },
    });

    // Create test faculty user
    const hashedPassword = await hashPassword("FacultyPass123");
    const facultyUser = await prisma.user.create({
      data: {
        email: "assignment.faculty@test.com",
        password: hashedPassword,
        role: "FACULTY",
      },
    });

    // Create test faculty
    testFaculty = await prisma.faculty.create({
      data: {
        fullName: "Assignment Test Faculty",
        designation: "PROFESSOR",
        userId: facultyUser.id,
        departmentId: testDepartment.id,
      },
    });

    // Login faculty to get token
    const facultyLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        identifier: "assignment.faculty@test.com",
        password: "FacultyPass123",
      });
    facultyToken = facultyLoginResponse.body.token;

    // Create test student user
    const studentHashedPassword = await hashPassword("StudentPass123");
    const studentUser = await prisma.user.create({
      data: {
        email: "assignment.student@test.com",
        password: studentHashedPassword,
        role: "STUDENT",
      },
    });

    // Create test student
    testStudent = await prisma.student.create({
      data: {
        fullName: "Assignment Test Student",
        enrollmentNumber: "ASSIGN001",
        batch: "B1",
        userId: studentUser.id,
        departmentId: testDepartment.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
      },
    });

    // Login student to get token
    const studentLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        identifier: "ASSIGN001", // Use enrollment number for student login
        password: "StudentPass123",
      });
    studentToken = studentLoginResponse.body.token;

    // Create test course
    testCourse = await prisma.course.create({
      data: {
        lectureType: LectureType.THEORY,
        batch: "B1",
        subjectId: testSubject.id,
        facultyId: testFaculty.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
      },
    });
  });

  afterAll(async () => {
    await cleanupTestData({
      colleges: ["Assignment Test College"],
      departments: ["Assignment Test Department"],
      subjects: ["Assignment Test Subject"],
      users: ["assignment.faculty@test.com", "assignment.student@test.com"],
    });
  });

  // Test assignment creation (faculty only)
  it("should create a new assignment (faculty only)", async () => {
    const response = await request(app)
      .post("/api/v1/assignments")
      .set("Authorization", `Bearer ${facultyToken}`)
      .send({
        title: "Test Assignment 1",
        description: "This is a test assignment",
        dueDate: "2025-12-31T23:59:59.000Z",
        totalMarks: 100,
        courseId: testCourse.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.assignment.title).toBe("Test Assignment 1");
    expect(response.body.data.assignment.courseId).toBe(testCourse.id);
    newAssignmentId = response.body.data.assignment.id;
  });

  // Test that students cannot create assignments
  it("should not allow students to create assignments", async () => {
    const response = await request(app)
      .post("/api/v1/assignments")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Student Assignment",
        description: "Students should not be able to create assignments",
        dueDate: "2025-12-31T23:59:59.000Z",
        totalMarks: 100,
        courseId: testCourse.id,
      });

    expect(response.status).toBe(403);
  });

  // Test getting all assignments for faculty
  it("should get all assignments for faculty", async () => {
    const response = await request(app)
      .get("/api/v1/assignments")
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeGreaterThan(0);
    expect(response.body.data.assignments).toBeDefined();
  });

  // Test getting assignments for student (enrolled courses only)
  it("should get assignments for student (enrolled courses only)", async () => {
    const response = await request(app)
      .get("/api/v1/assignments")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.assignments).toBeDefined();
  });

  // Test getting a specific assignment by ID
  it("should get a specific assignment by ID", async () => {
    const response = await request(app)
      .get(`/api/v1/assignments/${newAssignmentId}`)
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.assignment.id).toBe(newAssignmentId);
    expect(response.body.data.assignment.title).toBe("Test Assignment 1");
  });

  // Test updating an assignment (faculty only)
  it("should update an assignment (faculty only)", async () => {
    const response = await request(app)
      .put(`/api/v1/assignments/${newAssignmentId}`)
      .set("Authorization", `Bearer ${facultyToken}`)
      .send({
        title: "Updated Test Assignment 1",
        totalMarks: 120,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.assignment.title).toBe(
      "Updated Test Assignment 1"
    );
    expect(response.body.data.assignment.totalMarks).toBe(120);
  });

  // Test that students cannot update assignments
  it("should not allow students to update assignments", async () => {
    const response = await request(app)
      .put(`/api/v1/assignments/${newAssignmentId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Student Updated Assignment",
      });

    expect(response.status).toBe(403);
  });

  // Test getting assignment statistics (faculty only)
  it("should get assignment statistics (faculty only)", async () => {
    const response = await request(app)
      .get(`/api/v1/assignments/statistics?courseId=${testCourse.id}`)
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.statistics).toBeDefined();
  });

  // Test soft deleting an assignment (faculty only)
  it("should soft delete an assignment (faculty only)", async () => {
    const response = await request(app)
      .delete(`/api/v1/assignments/${newAssignmentId}`)
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(204);

    // Verify it's deleted
    const getResponse = await request(app)
      .get(`/api/v1/assignments/${newAssignmentId}`)
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(getResponse.status).toBe(404);
  });
});
