/**
 * @file src/tests/academicYear.test.ts
 * @description Robust, independent integration tests for the Academic Year CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";

describe("Academic Year API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let newAcademicYearId: string;
    const TEST_COLLEGE_NAME = "AY Test College";

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        await prisma.academicYear.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

        const college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "AYTC" },
        });
        testCollegeId = college.id;
    });

    it("should create a new academic year", async () => {
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

    it("should get all academic years for the test college", async () => {
        const response = await request(app)
            .get(`/api/v1/academic-years?collegeId=${testCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
        expect(response.body.data.academicYears[0].year).toBe("2026-2027");
    });

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

    it("should restore a soft-deleted academic year when creating with the same year", async () => {
        // First, verify the year is soft-deleted
        const checkResponse = await request(app)
            .get(`/api/v1/academic-years?collegeId=${testCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(checkResponse.body.results).toBe(0); // Should be 0 since it's soft-deleted

        // Try to create a new academic year with the same year
        const createResponse = await request(app)
            .post("/api/v1/academic-years")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                year: "2026-2027", // Same year as the soft-deleted one
                collegeId: testCollegeId,
                isActive: true,
            });

        expect(createResponse.status).toBe(201);
        expect(createResponse.body.data.academicYear.year).toBe("2026-2027");
        expect(createResponse.body.data.academicYear.isActive).toBe(true);
        expect(createResponse.body.data.academicYear.isDeleted).toBe(false);

        // The ID should be the same as the original (restored, not newly created)
        expect(createResponse.body.data.academicYear.id).toBe(
            newAcademicYearId
        );

        // Verify it's now visible in the list
        const getAllResponse = await request(app)
            .get(`/api/v1/academic-years?collegeId=${testCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getAllResponse.body.results).toBe(1);
        expect(getAllResponse.body.data.academicYears[0].id).toBe(
            newAcademicYearId
        );
    });

    afterAll(async () => {
        await prisma.academicYear.deleteMany({
            where: { collegeId: testCollegeId },
        });
        await prisma.college.deleteMany({ where: { id: testCollegeId } });
    });
});
