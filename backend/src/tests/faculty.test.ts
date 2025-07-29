/**
 * @file src/tests/faculty.test.ts
 * @description Robust, independent, and self-contained integration tests for the Faculty API endpoints.
 */

import app from "../index";
import request from "supertest";
import { prisma } from "../services/prisma.service";
import { Designation } from "@prisma/client";

describe("Faculty API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let testDepartmentId: string;
    let newFacultyUserId: string;
    let newFacultyProfileId: string;

    const TEST_FACULTY_EMAIL = "jane.doe@test.edu";
    const TEST_COLLEGE_NAME = "Faculty Integration Test College";

    // -- 1. SETUP: CLEANUP PREVIOUS RUNS AND CREATE PREREQUISITES --
    beforeAll(async () => {
        // Login as admin to get a token for protected routes
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;
        expect(adminToken).toBeDefined();

        // **Robustness Step**: Clean up any leftover data from previous failed test runs
        const oldUser = await prisma.user.findUnique({
            where: { email: TEST_FACULTY_EMAIL },
        });
        if (oldUser) {
            await prisma.faculty.deleteMany({ where: { userId: oldUser.id } });
            await prisma.user.delete({ where: { id: oldUser.id } });
        }
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

        // Create fresh prerequisite data for this test suite
        const college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME },
        });
        testCollegeId = college.id;

        const department = await prisma.department.create({
            data: {
                name: "Test Dept For Faculty",
                abbreviation: "TDF",
                collegeId: testCollegeId,
            },
        });
        testDepartmentId = department.id;
    });

    // -- 2. TEST FACULTY CREATION (via Auth route) --
    it("should register a new faculty member, creating both a User and a Faculty profile", async () => {
        const response = await request(app)
            .post("/api/v1/auth/register/faculty")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                email: TEST_FACULTY_EMAIL,
                password: "password123",
                fullName: "Dr. Jane Doe",
                designation: Designation.PROFESSOR,
                departmentId: testDepartmentId,
            });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.data.user.email).toBe(TEST_FACULTY_EMAIL);

        newFacultyUserId = response.body.data.user.id;
        expect(newFacultyUserId).toBeDefined();
    });

    // -- 3. TEST GETTING ALL FACULTIES --
    it("should get all faculties for a specific department", async () => {
        const response = await request(app)
            .get(`/api/v1/faculties?departmentId=${testDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
        expect(response.body.data.faculties[0].fullName).toBe("Dr. Jane Doe");

        // Store the faculty profile ID for subsequent tests
        newFacultyProfileId = response.body.data.faculties[0].id;
        expect(newFacultyProfileId).toBeDefined();
    });

    // -- 4. TEST GETTING ONE FACULTY BY ID --
    it("should get a single faculty by their profile ID", async () => {
        const response = await request(app)
            .get(`/api/v1/faculties/${newFacultyProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.faculty.id).toBe(newFacultyProfileId);
        expect(response.body.data.faculty.fullName).toBe("Dr. Jane Doe");
    });

    // -- 5. TEST UPDATING A FACULTY --
    it("should update the faculty's designation and abbreviation", async () => {
        const response = await request(app)
            .patch(`/api/v1/faculties/${newFacultyProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                designation: Designation.HOD,
                abbreviation: "JDOE",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.faculty.designation).toBe("HOD");
        expect(response.body.data.faculty.abbreviation).toBe("JDOE");
    });

    // -- 6. TEST DELETING A FACULTY --
    it("should soft delete the faculty profile", async () => {
        const response = await request(app)
            .delete(`/api/v1/faculties/${newFacultyProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(204);

        // Verify the profile is gone by trying to fetch it again
        const getResponse = await request(app)
            .get(`/api/v1/faculties/${newFacultyProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    // -- 7. CLEANUP --
    afterAll(async () => {
        // Clean up all data created during the test in reverse order of dependency
        if (newFacultyUserId) {
            // The Faculty profile is linked to the User, so it must be deleted first.
            await prisma.faculty.deleteMany({
                where: { userId: newFacultyUserId },
            });
            await prisma.user.delete({ where: { id: newFacultyUserId } });
        }

        if (testDepartmentId) {
            await prisma.department.delete({ where: { id: testDepartmentId } });
        }

        if (testCollegeId) {
            await prisma.college.delete({ where: { id: testCollegeId } });
        }
    });
});
