/**
 * @file src/tests/department.test.ts
 * @description Robust, independent integration tests for the Department CRUD API endpoints.
 */

import request from "supertest";
import app from "../app"; // Corrected default import
import { prisma } from "../config/prisma.service";

describe("Department API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let newDepartmentId: string;
    const TEST_COLLEGE_NAME = "Department Test College";

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        await prisma.department.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

        const college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "DTC" },
        });
        testCollegeId = college.id;
    });

    it("should create a new department", async () => {
        const response = await request(app)
            .post("/api/v1/departments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Test Engineering",
                abbreviation: "TE",
                collegeId: testCollegeId,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.department.name).toBe("Test Engineering");
        newDepartmentId = response.body.data.department.id;
    });

    it("should get all departments for the test college", async () => {
        const response = await request(app)
            .get(`/api/v1/departments?collegeId=${testCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
        expect(response.body.data.departments[0].name).toBe("Test Engineering");
    });

    it("should get a single department by its ID", async () => {
        const response = await request(app)
            .get(`/api/v1/departments/${newDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.department.id).toBe(newDepartmentId);
    });

    it("should update the department's abbreviation", async () => {
        const response = await request(app)
            .patch(`/api/v1/departments/${newDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ abbreviation: "TES" });

        expect(response.status).toBe(200);
        expect(response.body.data.department.abbreviation).toBe("TES");
    });

    it("should soft delete the department", async () => {
        const response = await request(app)
            .delete(`/api/v1/departments/${newDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/departments/${newDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(getResponse.status).toBe(404);
    });

    afterAll(async () => {
        await prisma.department.deleteMany({
            where: { collegeId: testCollegeId },
        });
        await prisma.college.deleteMany({ where: { id: testCollegeId } });
    });
});
