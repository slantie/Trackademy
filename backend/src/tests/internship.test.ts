/**
 * @file src/tests/internship.test.ts
 * @description Test suite for internship-related API endpoints.
 */

import request from "supertest";
import app from "../app";
import {
  cleanDatabaseAndSeedAdmin,
  getAdminToken,
  cleanupTestData,
} from "./helpers/testSetup";
import {
  PrismaClient,
  Role,
  SemesterType,
  InternshipStatus,
} from "@prisma/client";
import { hashPassword } from "../utils/hash";

const prisma = new PrismaClient();

describe("Internship API Endpoints", () => {
  let adminToken: string;
  let studentToken: string;
  let facultyToken: string;
  let testCollege: any;
  let testDepartment: any;
  let testAcademicYear: any;
  let testSemester: any;
  let testDivision: any;
  let testStudent: any;
  let testFaculty: any;
  let testInternship: any;

  const TEST_COLLEGE_NAME = "Internship Test College";
  const TEST_STUDENT_EMAIL = "internship.student@test.edu";
  const TEST_FACULTY_EMAIL = "internship.faculty@test.edu";
  const OTHER_STUDENT_EMAIL = "other.internship.student@test.edu";

  beforeAll(async () => {
    // Clean database and seed admin
    await cleanDatabaseAndSeedAdmin();

    // Get admin token
    adminToken = await getAdminToken(request, app);

    // Create test data directly via Prisma for reliable setup
    testCollege = await prisma.college.create({
      data: { name: TEST_COLLEGE_NAME, abbreviation: "ITC" },
    });

    testDepartment = await prisma.department.create({
      data: {
        name: "Internship Test Department",
        abbreviation: "ITD",
        collegeId: testCollege.id,
      },
    });

    testAcademicYear = await prisma.academicYear.create({
      data: { year: "2025-2026", collegeId: testCollege.id },
    });

    testSemester = await prisma.semester.create({
      data: {
        semesterNumber: 7,
        semesterType: SemesterType.ODD,
        departmentId: testDepartment.id,
        academicYearId: testAcademicYear.id,
      },
    });

    testDivision = await prisma.division.create({
      data: { name: "I1", semesterId: testSemester.id },
    });

    // Create test student with user
    const studentUser = await prisma.user.create({
      data: {
        email: TEST_STUDENT_EMAIL,
        password: await hashPassword("password123"),
        role: Role.STUDENT,
      },
    });

    testStudent = await prisma.student.create({
      data: {
        fullName: "Internship Test Student",
        enrollmentNumber: "INT001",
        batch: "I1",
        departmentId: testDepartment.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
        userId: studentUser.id,
      },
    });

    // Create another test student for authorization tests
    const otherStudentUser = await prisma.user.create({
      data: {
        email: OTHER_STUDENT_EMAIL,
        password: await hashPassword("password123"),
        role: Role.STUDENT,
      },
    });

    await prisma.student.create({
      data: {
        fullName: "Other Internship Student",
        enrollmentNumber: "INT002",
        batch: "I1",
        departmentId: testDepartment.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
        userId: otherStudentUser.id,
      },
    });

    // Create test faculty with user
    const facultyUser = await prisma.user.create({
      data: {
        email: TEST_FACULTY_EMAIL,
        password: await hashPassword("password123"),
        role: Role.FACULTY,
      },
    });

    testFaculty = await prisma.faculty.create({
      data: {
        fullName: "Internship Test Faculty",
        designation: "PROFESSOR",
        departmentId: testDepartment.id,
        userId: facultyUser.id,
      },
    });

    // Login student
    const studentLogin = await request(app).post("/api/v1/auth/login").send({
      identifier: "INT001",
      password: "password123",
    });
    studentToken = studentLogin.body.token;

    // Login faculty
    const facultyLogin = await request(app).post("/api/v1/auth/login").send({
      identifier: TEST_FACULTY_EMAIL,
      password: "password123",
    });
    facultyToken = facultyLogin.body.token;
  });

  afterAll(async () => {
    await cleanupTestData({
      colleges: [TEST_COLLEGE_NAME],
      users: [TEST_STUDENT_EMAIL, TEST_FACULTY_EMAIL, OTHER_STUDENT_EMAIL],
    });
  });

  describe("POST /api/v1/internships", () => {
    it("should create a new internship for authenticated student", async () => {
      const internshipData = {
        companyName: "Tech Innovations Inc.",
        role: "Software Development Intern",
        description:
          "Full-stack development internship focusing on React and Node.js",
        startDate: "2024-06-01T00:00:00.000Z",
        endDate: "2024-08-31T00:00:00.000Z",
        status: InternshipStatus.APPLIED,
        stipend: 25000,
        location: "Remote",
        offerLetterPath: "https://cloudinary.com/offer-letter-123.pdf",
      };

      const response = await request(app)
        .post("/api/v1/internships")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(internshipData);

      console.log("Response status:", response.status);
      if (response.status !== 201) {
        console.log("Response body:", response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.companyName).toBe(internshipData.companyName);
      expect(response.body.data.role).toBe(internshipData.role);
      expect(response.body.data.stipend).toBe(internshipData.stipend);

      // Store for subsequent tests
      testInternship = response.body.data;
    });

    it("should require authentication", async () => {
      const internshipData = {
        companyName: "Test Company",
        role: "Test Role",
        startDate: "2024-06-01",
      };

      const response = await request(app)
        .post("/api/v1/internships")
        .send(internshipData);

      expect(response.status).toBe(401);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/v1/internships")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it("should validate date format and logic", async () => {
      const internshipData = {
        companyName: "Test Company",
        role: "Test Role",
        startDate: "2024-08-01",
        endDate: "2024-06-01", // End date before start date
      };

      const response = await request(app)
        .post("/api/v1/internships")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(internshipData);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/internships", () => {
    it("should get all internships for authenticated student", async () => {
      const response = await request(app)
        .get("/api/v1/internships")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].companyName).toBeDefined();
    });

    it("should require authentication", async () => {
      const response = await request(app).get("/api/v1/internships");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/v1/internships/:id", () => {
    it("should get a specific internship by ID for the owner", async () => {
      const response = await request(app)
        .get(`/api/v1/internships/${testInternship.id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testInternship.id);
      expect(response.body.data.companyName).toBe("Tech Innovations Inc.");
    });

    it("should allow faculty to view student internships", async () => {
      const response = await request(app)
        .get(`/api/v1/internships/${testInternship.id}`)
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should prevent students from viewing other students' internships", async () => {
      // Login as other student
      const otherStudentLogin = await request(app)
        .post("/api/v1/auth/login")
        .send({
          identifier: "INT002",
          password: "password123",
        });

      const response = await request(app)
        .get(`/api/v1/internships/${testInternship.id}`)
        .set("Authorization", `Bearer ${otherStudentLogin.body.token}`);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent internship", async () => {
      const response = await request(app)
        .get("/api/v1/internships/non-existent-id")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/v1/internships/:id", () => {
    it("should update an internship for the owner", async () => {
      const updateData = {
        status: InternshipStatus.ONGOING,
        nocPath: "https://cloudinary.com/noc-123.pdf",
        description: "Updated description with more details about the role",
      };

      const response = await request(app)
        .patch(`/api/v1/internships/${testInternship.id}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(InternshipStatus.ONGOING);
      expect(response.body.data.nocPath).toBe(updateData.nocPath);
    });

    it("should prevent students from updating other students' internships", async () => {
      // Login as other student
      const otherStudentLogin = await request(app)
        .post("/api/v1/auth/login")
        .send({
          identifier: "INT002",
          password: "password123",
        });

      const response = await request(app)
        .patch(`/api/v1/internships/${testInternship.id}`)
        .set("Authorization", `Bearer ${otherStudentLogin.body.token}`)
        .send({ status: InternshipStatus.COMPLETED });

      expect(response.status).toBe(403);
    });

    it("should validate URL format for document paths", async () => {
      const updateData = {
        completionCertificatePath: "invalid-url",
      };

      const response = await request(app)
        .patch(`/api/v1/internships/${testInternship.id}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send(updateData);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/internships/student/:studentId", () => {
    it("should allow faculty to view specific student's internships", async () => {
      const response = await request(app)
        .get(`/api/v1/internships/student/${testStudent.id}`)
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should allow admin to view specific student's internships", async () => {
      const response = await request(app)
        .get(`/api/v1/internships/student/${testStudent.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should prevent students from viewing other students' internships list", async () => {
      const response = await request(app)
        .get(`/api/v1/internships/student/${testStudent.id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/v1/internships/stats", () => {
    it("should allow faculty to view internship statistics", async () => {
      const response = await request(app)
        .get("/api/v1/internships/stats")
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalInternships).toBeDefined();
      expect(response.body.data.statusBreakdown).toBeDefined();
    });

    it("should allow admin to view internship statistics", async () => {
      const response = await request(app)
        .get("/api/v1/internships/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should prevent students from viewing statistics", async () => {
      const response = await request(app)
        .get("/api/v1/internships/stats")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /api/v1/internships/:id", () => {
    it("should allow student to delete their own internship", async () => {
      const response = await request(app)
        .delete(`/api/v1/internships/${testInternship.id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify internship is soft-deleted
      const deletedInternship = await prisma.internship.findUnique({
        where: { id: testInternship.id },
      });
      expect(deletedInternship?.isDeleted).toBe(true);
    });

    it("should prevent students from deleting other students' internships", async () => {
      // Create another internship first
      const newInternship = await prisma.internship.create({
        data: {
          companyName: "Another Company",
          role: "Another Role",
          startDate: new Date("2024-06-01"),
          studentId: testStudent.id,
        },
      });

      // Login as other student
      const otherStudentLogin = await request(app)
        .post("/api/v1/auth/login")
        .send({
          identifier: "INT002",
          password: "password123",
        });

      const response = await request(app)
        .delete(`/api/v1/internships/${newInternship.id}`)
        .set("Authorization", `Bearer ${otherStudentLogin.body.token}`);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent internship", async () => {
      const response = await request(app)
        .delete("/api/v1/internships/non-existent-id")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
    });
  });
});
