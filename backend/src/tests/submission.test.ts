/**
 * @file src/tests/submission.test.ts
 * @description Integration tests for submission-related API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { Role, LectureType } from "@prisma/client";
import {
  cleanDatabaseAndSeedAdmin,
  getAdminToken,
  cleanupTestData,
  createTestCollege,
  createTestDepartment,
} from "./helpers/testSetup";

describe("Submission API Endpoints", () => {
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
  let testAssignment: any;
  let newSubmissionId: string;

  beforeAll(async () => {
    // Clean database and seed admin
    await cleanDatabaseAndSeedAdmin();

    // Get admin token
    adminToken = await getAdminToken(request, app);

    // Create test data directly via Prisma for faster and more reliable setup
    testCollege = await prisma.college.create({
      data: {
        name: "Submission Test College",
        abbreviation: "STC",
      },
    });

    testDepartment = await prisma.department.create({
      data: {
        name: "Submission Test Department",
        abbreviation: "STD",
        collegeId: testCollege.id,
      },
    });

    testAcademicYear = await prisma.academicYear.create({
      data: {
        year: "2025-27",
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
        name: "Submission Test Division",
        semesterId: testSemester.id,
      },
    });

    testSubject = await prisma.subject.create({
      data: {
        name: "Submission Test Subject",
        abbreviation: "STS",
        code: "STS101",
        type: "MANDATORY",
        semesterNumber: 7,
        departmentId: testDepartment.id,
      },
    });

    // Create test faculty user and profile
    const facultyUser = await prisma.user.create({
      data: {
        email: "submission.faculty@test.com",
        password: await import("../utils/hash").then((m) =>
          m.hashPassword("FacultyPass123")
        ),
        role: "FACULTY",
      },
    });

    testFaculty = await prisma.faculty.create({
      data: {
        fullName: "Submission Test Faculty",
        designation: "PROFESSOR",
        departmentId: testDepartment.id,
        userId: facultyUser.id,
      },
    });

    // Login faculty to get token
    const facultyLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        identifier: "submission.faculty@test.com",
        password: "FacultyPass123",
      });
    facultyToken = facultyLoginResponse.body.token;

    // Create test student user and profile
    const studentUser = await prisma.user.create({
      data: {
        email: "submission.student@test.com",
        password: await import("../utils/hash").then((m) =>
          m.hashPassword("StudentPass123")
        ),
        role: "STUDENT",
      },
    });

    testStudent = await prisma.student.create({
      data: {
        fullName: "Submission Test Student",
        enrollmentNumber: "SUBMIT001",
        batch: "B1",
        departmentId: testDepartment.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
        userId: studentUser.id,
      },
    });

    // Login student to get token
    const studentLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        identifier: "SUBMIT001", // Use enrollment number for student login
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

    // Enroll student in the course
    await prisma.studentEnrollment.create({
      data: {
        studentId: testStudent.id,
        courseId: testCourse.id,
      },
    });

    // Create test assignment
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7); // 7 days from now

    testAssignment = await prisma.assignment.create({
      data: {
        title: "Test Assignment for Submission",
        description: "This is a test assignment for submission tests",
        dueDate: futureDate,
        totalMarks: 100,
        courseId: testCourse.id,
      },
    });
  });

  it("should create a new submission (student only)", async () => {
    const response = await request(app)
      .post("/api/v1/submissions")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        content: "This is my test submission content.",
        assignmentId: testAssignment.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.submission.content).toBe(
      "This is my test submission content."
    );
    expect(response.body.data.submission.status).toBe("SUBMITTED");
    newSubmissionId = response.body.data.submission.id;
  });

  it("should not allow faculty to create submissions", async () => {
    const response = await request(app)
      .post("/api/v1/submissions")
      .set("Authorization", `Bearer ${facultyToken}`)
      .send({
        content: "Faculty attempting to submit",
        assignmentId: testAssignment.id,
      });

    expect(response.status).toBe(403);
  });

  it("should not allow duplicate submissions from the same student", async () => {
    const response = await request(app)
      .post("/api/v1/submissions")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        content: "Duplicate submission attempt",
        assignmentId: testAssignment.id,
      });

    expect(response.status).toBe(409);
  });

  it("should get submissions for an assignment (faculty view)", async () => {
    const response = await request(app)
      .get(`/api/v1/submissions/assignment/${testAssignment.id}`)
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeGreaterThanOrEqual(1);
    expect(response.body.data.submissions.data.length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("should not allow students to view all submissions for an assignment", async () => {
    const response = await request(app)
      .get(`/api/v1/submissions/assignment/${testAssignment.id}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(403);
  });

  it("should get a specific submission by ID", async () => {
    const response = await request(app)
      .get(`/api/v1/submissions/${newSubmissionId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.submission.id).toBe(newSubmissionId);
    expect(response.body.data.submission.content).toBe(
      "This is my test submission content."
    );
  });

  it("should allow faculty to view student submissions", async () => {
    const response = await request(app)
      .get(`/api/v1/submissions/${newSubmissionId}`)
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.submission.id).toBe(newSubmissionId);
  });

  it("should update a submission (student only, before grading)", async () => {
    const response = await request(app)
      .put(`/api/v1/submissions/${newSubmissionId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        content: "Updated submission content",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.submission.content).toBe(
      "Updated submission content"
    );
  });

  it("should not allow faculty to update submissions", async () => {
    const response = await request(app)
      .put(`/api/v1/submissions/${newSubmissionId}`)
      .set("Authorization", `Bearer ${facultyToken}`)
      .send({
        content: "Faculty trying to update",
      });

    expect(response.status).toBe(403);
  });

  it("should grade a submission (faculty only)", async () => {
    const response = await request(app)
      .post(`/api/v1/submissions/${newSubmissionId}/grade`)
      .set("Authorization", `Bearer ${facultyToken}`)
      .send({
        marksAwarded: 85,
        feedback: "Good work, but could be improved in some areas.",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.submission.marksAwarded).toBe(85);
    expect(response.body.data.submission.feedback).toBe(
      "Good work, but could be improved in some areas."
    );
    expect(response.body.data.submission.status).toBe("GRADED");
  });

  it("should not allow students to grade submissions", async () => {
    const response = await request(app)
      .post(`/api/v1/submissions/${newSubmissionId}/grade`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        marksAwarded: 100,
        feedback: "Self-grading attempt",
      });

    expect(response.status).toBe(403);
  });

  it("should not allow updating graded submissions", async () => {
    const response = await request(app)
      .put(`/api/v1/submissions/${newSubmissionId}`)
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        content: "Trying to update graded submission",
      });

    expect(response.status).toBe(400);
  });

  it("should get submission statistics (faculty only)", async () => {
    const response = await request(app)
      .get(`/api/v1/submissions/assignment/${testAssignment.id}/statistics`)
      .set("Authorization", `Bearer ${facultyToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.statistics).toHaveProperty("totalSubmissions");
    expect(response.body.data.statistics).toHaveProperty("gradedSubmissions");
    expect(response.body.data.statistics).toHaveProperty("averageMarks");
    expect(
      response.body.data.statistics.totalSubmissions
    ).toBeGreaterThanOrEqual(1);
    expect(
      response.body.data.statistics.gradedSubmissions
    ).toBeGreaterThanOrEqual(1);
  });

  it("should not allow deleting graded submissions", async () => {
    const response = await request(app)
      .delete(`/api/v1/submissions/${newSubmissionId}`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(response.status).toBe(400);
  });

  afterAll(async () => {
    await cleanupTestData({
      colleges: ["Submission Test College"],
      users: ["submission.faculty@test.com", "submission.student@test.com"],
      subjects: ["Submission Test Subject"],
    });
  });
});
