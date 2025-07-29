/**
 * @file src/tests/academicYear.test.ts
 * @description Robust, independent integration tests for the Academic Year CRUD API endpoints.
 */

import app from "../index";
import request from "supertest";
import { prisma } from "../services/prisma.service";

describe("Academic Year API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let newAcademicYearId: string;

    // -- 1. SETUP: LOG IN AND CREATE A TEST COLLEGE --
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // Create a temporary college for this test suite
        const college = await prisma.college.create({
            data: { name: "AY Test College" },
        });
        testCollegeId = college.id;
    });

    // -- 2. TEST ACADEMIC YEAR CREATION --
    it("should create a new academic year (2026-2027)", async () => {
        const response = await request(app)
            .post("/api/v1/academic-years")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                year: "2026-2027",
                collegeId: testCollegeId,
                isActive: false,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.academicYear.year).toBe("2026-2027");

        newAcademicYearId = response.body.data.academicYear.id;
    });

    // -- 3. TEST GETTING ALL ACADEMIC YEARS --
    it("should get all academic years for the test college", async () => {
        // Create a second year to test the list
        await request(app)
            .post("/api/v1/academic-years")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ year: "2027-2028", collegeId: testCollegeId });

        const response = await request(app)
            .get(`/api/v1/academic-years?collegeId=${testCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(2);
        const years = response.body.data.academicYears.map((y: any) => y.year);
        expect(years).toContain("2026-2027");
        expect(years).toContain("2027-2028");
    });

    // -- 4. TEST UPDATING AND GETTING THE ACTIVE YEAR --
    it("should update an academic year to be active and then fetch it", async () => {
        const patchResponse = await request(app)
            .patch(`/api/v1/academic-years/${newAcademicYearId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ isActive: true });
        expect(patchResponse.status).toBe(200);

        const getActiveResponse = await request(app)
            .get(`/api/v1/academic-years/active?collegeId=${testCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getActiveResponse.status).toBe(200);
        expect(getActiveResponse.body.data.academicYear.id).toBe(
            newAcademicYearId
        );
    });

    // -- 5. TEST DELETING AN ACADEMIC YEAR --
    it("should soft delete the academic year", async () => {
        const response = await request(app)
            .delete(`/api/v1/academic-years/${newAcademicYearId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/academic-years/${newAcademicYearId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    // -- 6. CLEANUP --
    afterAll(async () => {
        // Clean up all data created during the test
        await prisma.academicYear.deleteMany({
            where: { collegeId: testCollegeId },
        });
        await prisma.college.delete({ where: { id: testCollegeId } });
    });
});
