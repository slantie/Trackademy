/**
 * @file src/tests/certificate.test.ts
 * @description Comprehensive integration tests for Certificate API endpoints
 */

import request from "supertest";
import app from "../app";
import {
  cleanDatabaseAndSeedAdmin,
  cleanupTestData,
  getAdminToken,
} from "./helpers/testSetup";
import { PrismaClient, Role, SemesterType } from "@prisma/client";
import { hashPassword } from "../utils/hash";

const prisma = new PrismaClient();

describe("Certificate API Endpoints", () => {
  let adminToken: string;
  let facultyToken: string;
  let studentToken: string;
  let otherStudentToken: string;

  // Test data
  let testCollege: any;
  let testDepartment: any;
  let testAcademicYear: any;
  let testSemester: any;
  let testDivision: any;
  let testStudent: any;
  let otherTestStudent: any;
  let testFaculty: any;
  let certificateId: string;

  const TEST_COLLEGE_NAME = "Certificate Test College";
  const TEST_STUDENT_EMAIL = "cert.student1@test.edu";
  const OTHER_STUDENT_EMAIL = "cert.student2@test.edu";
  const TEST_FACULTY_EMAIL = "cert.faculty@test.edu";

  beforeAll(async () => {
    // Clean database and get admin token
    await cleanDatabaseAndSeedAdmin();
    adminToken = await getAdminToken(request, app);

    // Create test data directly via Prisma for reliable setup
    testCollege = await prisma.college.create({
      data: {
        name: TEST_COLLEGE_NAME,
        abbreviation: "CTC",
        website: "https://testcollege.edu",
        address: "123 Test Street",
      },
    });

    testDepartment = await prisma.department.create({
      data: {
        name: "Certificate Test Department",
        abbreviation: "CTD",
        collegeId: testCollege.id,
      },
    });

    testAcademicYear = await prisma.academicYear.create({
      data: {
        year: "2024-25",
        collegeId: testCollege.id,
      },
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
      data: {
        name: "A",
        semesterId: testSemester.id,
      },
    });

    // Create faculty user and profile
    const facultyUser = await prisma.user.create({
      data: {
        email: TEST_FACULTY_EMAIL,
        password: await hashPassword("password123"),
        role: Role.FACULTY,
      },
    });

    testFaculty = await prisma.faculty.create({
      data: {
        fullName: "Test Faculty Certificate",
        designation: "PROFESSOR",
        departmentId: testDepartment.id,
        userId: facultyUser.id,
      },
    });

    // Login faculty to get token
    const facultyLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        identifier: TEST_FACULTY_EMAIL,
        password: "password123",
      });
    facultyToken = facultyLoginResponse.body.token;

    // Create first student user and profile
    const studentUser = await prisma.user.create({
      data: {
        email: TEST_STUDENT_EMAIL,
        password: await hashPassword("password123"),
        role: Role.STUDENT,
      },
    });

    testStudent = await prisma.student.create({
      data: {
        fullName: "Test Student Certificate 1",
        enrollmentNumber: "CERT001",
        batch: "B1",
        departmentId: testDepartment.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
        userId: studentUser.id,
      },
    });

    // Login first student to get token
    const studentLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        identifier: TEST_STUDENT_EMAIL,
        password: "password123",
      });
    studentToken = studentLoginResponse.body.token;

    // Create second student user and profile for security tests
    const otherStudentUser = await prisma.user.create({
      data: {
        email: OTHER_STUDENT_EMAIL,
        password: await hashPassword("password123"),
        role: Role.STUDENT,
      },
    });

    otherTestStudent = await prisma.student.create({
      data: {
        fullName: "Test Student Certificate 2",
        enrollmentNumber: "CERT002",
        batch: "B1",
        departmentId: testDepartment.id,
        semesterId: testSemester.id,
        divisionId: testDivision.id,
        userId: otherStudentUser.id,
      },
    });

    // Login second student to get token
    const otherStudentLoginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        identifier: OTHER_STUDENT_EMAIL,
        password: "password123",
      });
    otherStudentToken = otherStudentLoginResponse.body.token;
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData({
      colleges: [TEST_COLLEGE_NAME],
      departments: ["Certificate Test Department"],
      users: [TEST_FACULTY_EMAIL, TEST_STUDENT_EMAIL, OTHER_STUDENT_EMAIL],
    });
  });

  describe("POST /api/v1/certificates", () => {
    it("should create a new certificate for authenticated student", async () => {
      const certificateData = {
        title: "Full Stack Web Development",
        issuingOrganization: "Tech Academy",
        issueDate: "2024-08-15",
        description:
          "Comprehensive full stack development course covering React, Node.js, and databases",
        certificatePath: "https://res.cloudinary.com/test/certificate1.pdf",
      };

      const response = await request(app)
        .post("/api/v1/certificates")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(certificateData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Certificate created successfully");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.title).toBe(certificateData.title);
      expect(response.body.data.issuingOrganization).toBe(
        certificateData.issuingOrganization
      );
      expect(response.body.data.student).toHaveProperty(
        "enrollmentNumber",
        "CERT001"
      );

      // Store certificate ID for later tests
      certificateId = response.body.data.id;
    });

    it("should require authentication", async () => {
      const certificateData = {
        title: "Python Programming",
        issuingOrganization: "Code Academy",
        issueDate: "2024-07-20",
        certificatePath: "https://res.cloudinary.com/test/certificate2.pdf",
      };

      const response = await request(app)
        .post("/api/v1/certificates")
        .send(certificateData);

      expect(response.status).toBe(401);
    });

    it("should validate required fields", async () => {
      const invalidData = {
        title: "", // Empty title
        issuingOrganization: "Test Org",
        // Missing issueDate and certificatePath
      };

      const response = await request(app)
        .post("/api/v1/certificates")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should validate certificate path URL", async () => {
      const invalidData = {
        title: "Invalid Certificate",
        issuingOrganization: "Test Org",
        issueDate: "2024-08-15",
        certificatePath: "not-a-valid-url",
      };

      const response = await request(app)
        .post("/api/v1/certificates")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it("should prevent faculty from creating certificates", async () => {
      const certificateData = {
        title: "Unauthorized Certificate",
        issuingOrganization: "Test Org",
        issueDate: "2024-08-15",
        certificatePath: "https://res.cloudinary.com/test/certificate3.pdf",
      };

      const response = await request(app)
        .post("/api/v1/certificates")
        .set("Authorization", `Bearer ${facultyToken}`)
        .send(certificateData);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/v1/certificates/me", () => {
    it("should get all certificates for authenticated student", async () => {
      const response = await request(app)
        .get("/api/v1/certificates/me")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Certificates retrieved successfully");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.count).toBe(response.body.data.length);
    });

    it("should require authentication", async () => {
      const response = await request(app).get("/api/v1/certificates/me");

      expect(response.status).toBe(401);
    });

    it("should prevent faculty from accessing /me endpoint", async () => {
      const response = await request(app)
        .get("/api/v1/certificates/me")
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/v1/certificates/student/:studentId", () => {
    it("should allow faculty to view student certificates", async () => {
      const response = await request(app)
        .get(`/api/v1/certificates/student/${testStudent.id}`)
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Student certificates retrieved successfully"
      );
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should allow admin to view student certificates", async () => {
      const response = await request(app)
        .get(`/api/v1/certificates/student/${testStudent.id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should prevent students from viewing other students' certificates", async () => {
      const response = await request(app)
        .get(`/api/v1/certificates/student/${otherTestStudent.id}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/v1/certificates/:id", () => {
    it("should get a specific certificate by ID for the owner", async () => {
      const response = await request(app)
        .get(`/api/v1/certificates/${certificateId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Certificate retrieved successfully");
      expect(response.body.data.id).toBe(certificateId);
    });

    it("should allow faculty to view student certificates", async () => {
      const response = await request(app)
        .get(`/api/v1/certificates/${certificateId}`)
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should prevent students from viewing other students' certificates", async () => {
      const response = await request(app)
        .get(`/api/v1/certificates/${certificateId}`)
        .set("Authorization", `Bearer ${otherStudentToken}`);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent certificate", async () => {
      const response = await request(app)
        .get("/api/v1/certificates/c123456789012345678901234")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/v1/certificates/:id", () => {
    it("should update a certificate for the owner", async () => {
      const updateData = {
        title: "Advanced Full Stack Web Development",
        description: "Updated description with advanced topics",
      };

      const response = await request(app)
        .patch(`/api/v1/certificates/${certificateId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Certificate updated successfully");
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
    });

    it("should prevent students from updating other students' certificates", async () => {
      const updateData = {
        title: "Unauthorized Update",
      };

      const response = await request(app)
        .patch(`/api/v1/certificates/${certificateId}`)
        .set("Authorization", `Bearer ${otherStudentToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });

    it("should validate URL format for certificate path", async () => {
      const invalidData = {
        certificatePath: "not-a-valid-url",
      };

      const response = await request(app)
        .patch(`/api/v1/certificates/${certificateId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/certificates/stats", () => {
    it("should allow faculty to view certificate statistics", async () => {
      const response = await request(app)
        .get("/api/v1/certificates/stats")
        .set("Authorization", `Bearer ${facultyToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Certificate statistics retrieved successfully"
      );
      expect(response.body.data).toHaveProperty("totalCertificates");
      expect(response.body.data).toHaveProperty("certificatesThisMonth");
      expect(response.body.data).toHaveProperty("topIssuingOrganizations");
      expect(response.body.data).toHaveProperty("studentsWithCertificates");
    });

    it("should allow admin to view certificate statistics", async () => {
      const response = await request(app)
        .get("/api/v1/certificates/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should prevent students from viewing statistics", async () => {
      const response = await request(app)
        .get("/api/v1/certificates/stats")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /api/v1/certificates/:id", () => {
    it("should allow student to delete their own certificate", async () => {
      const response = await request(app)
        .delete(`/api/v1/certificates/${certificateId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Certificate deleted successfully");
    });

    it("should prevent students from deleting other students' certificates", async () => {
      // First create a certificate for the other student
      const newCertResponse = await request(app)
        .post("/api/v1/certificates")
        .set("Authorization", `Bearer ${otherStudentToken}`)
        .send({
          title: "Test Certificate for Deletion",
          issuingOrganization: "Test Org",
          issueDate: "2024-08-01",
          certificatePath: "https://res.cloudinary.com/test/cert-delete.pdf",
        });

      const newCertId = newCertResponse.body.data.id;

      // Try to delete with wrong student token
      const response = await request(app)
        .delete(`/api/v1/certificates/${newCertId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent certificate", async () => {
      const response = await request(app)
        .delete("/api/v1/certificates/c123456789012345678901234")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
    });

    it("should not allow access to deleted certificate", async () => {
      // Verify the deleted certificate is no longer accessible
      const response = await request(app)
        .get(`/api/v1/certificates/${certificateId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(response.status).toBe(404);
    });
  });
});
