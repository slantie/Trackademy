/**
 * @file src/tests/department.test.ts
 * @description Robust, independent integration tests for the Department CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
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

        // Clean up and create test college
        await prisma.department.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

        const college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "DTC" },
        });
        testCollegeId = college.id;
    });

    describe("Department Creation", () => {
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
            expect(response.body.data.department.abbreviation).toBe("TE");
            newDepartmentId = response.body.data.department.id;
        });

        it("should not create a department with duplicate name in same college", async () => {
            // First, make sure we have a department created (in case tests run in different order)
            await request(app)
                .post("/api/v1/departments")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Unique Department Name",
                    abbreviation: "UDN",
                    collegeId: testCollegeId,
                });

            // Now try to create a department with the same name
            const response = await request(app)
                .post("/api/v1/departments")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Unique Department Name", // Same name as above
                    abbreviation: "UDN2", // Different abbreviation
                    collegeId: testCollegeId,
                });

            expect(response.status).toBe(409);
            // Just check that we get a 409 - the middleware might format errors differently
        });

        it("should validate required fields", async () => {
            const response = await request(app)
                .post("/api/v1/departments")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "",
                    abbreviation: "XX",
                    collegeId: testCollegeId,
                });

            expect(response.status).toBe(400);
        });
    });

    describe("Department Retrieval", () => {
        it("should get all departments for the test college", async () => {
            const response = await request(app)
                .get(`/api/v1/departments?collegeId=${testCollegeId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.results).toBeGreaterThanOrEqual(1);
            expect(response.body.data.departments[0]._count).toBeDefined();
        });

        it("should get all departments across all colleges", async () => {
            const response = await request(app)
                .get("/api/v1/departments")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.results).toBeGreaterThanOrEqual(1);
        });

        it("should get department count for a college", async () => {
            const response = await request(app)
                .get(`/api/v1/departments/count?collegeId=${testCollegeId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.count).toBeGreaterThanOrEqual(1);
        });

        it("should get total department count", async () => {
            const response = await request(app)
                .get("/api/v1/departments/count")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.count).toBeGreaterThanOrEqual(1);
        });

        it("should get a single department by its ID", async () => {
            const response = await request(app)
                .get(`/api/v1/departments/${newDepartmentId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.department.id).toBe(newDepartmentId);
            expect(response.body.data.department.college).toBeDefined();
        });

        it("should get a department with full relations", async () => {
            const response = await request(app)
                .get(`/api/v1/departments/${newDepartmentId}?include=relations`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.department.subjects).toBeDefined();
            expect(response.body.data.department.faculties).toBeDefined();
            expect(response.body.data.department.semesters).toBeDefined();
        });
    });

    describe("Department Search", () => {
        it("should search departments by name", async () => {
            const response = await request(app)
                .get("/api/v1/departments/search?q=Test")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.results).toBeGreaterThanOrEqual(1);
            expect(response.body.data.departments[0].name).toContain("Test");
        });

        it("should search departments by abbreviation", async () => {
            const response = await request(app)
                .get("/api/v1/departments/search?q=TE")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.results).toBeGreaterThanOrEqual(1);
        });

        it("should filter search by college", async () => {
            const response = await request(app)
                .get(
                    `/api/v1/departments/search?q=Test&collegeId=${testCollegeId}`
                )
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(response.body.results).toBe(1);
        });

        it("should require search term", async () => {
            const response = await request(app)
                .get("/api/v1/departments/search")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(400);
        });
    });

    describe("Department Updates", () => {
        it("should update the department's abbreviation", async () => {
            const response = await request(app)
                .patch(`/api/v1/departments/${newDepartmentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ abbreviation: "TES" });

            expect(response.status).toBe(200);
            expect(response.body.data.department.abbreviation).toBe("TES");
        });

        it("should update the department's name", async () => {
            const response = await request(app)
                .patch(`/api/v1/departments/${newDepartmentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Updated Test Engineering" });

            expect(response.status).toBe(200);
            expect(response.body.data.department.name).toBe(
                "Updated Test Engineering"
            );
        });

        it("should not allow updating to a duplicate name in same college", async () => {
            // First create another department
            const dept2 = await request(app)
                .post("/api/v1/departments")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Another Department",
                    abbreviation: "AD",
                    collegeId: testCollegeId,
                });

            // Try to update the first department to have the same name as the second
            const response = await request(app)
                .patch(`/api/v1/departments/${newDepartmentId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Another Department" });

            expect(response.status).toBe(409);

            // Clean up
            await request(app)
                .delete(`/api/v1/departments/${dept2.body.data.department.id}`)
                .set("Authorization", `Bearer ${adminToken}`);
        });
    });

    describe("Department Deletion", () => {
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

        it("should restore a soft-deleted department when creating with same name", async () => {
            // Try to create a department with the same name as the soft-deleted one
            const response = await request(app)
                .post("/api/v1/departments")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Updated Test Engineering",
                    abbreviation: "UTE",
                    collegeId: testCollegeId,
                });

            expect(response.status).toBe(201);
            expect(response.body.data.department.name).toBe(
                "Updated Test Engineering"
            );
            // Should have the same ID as the original (restored)
            expect(response.body.data.department.id).toBe(newDepartmentId);

            // Verify it's now visible
            const getResponse = await request(app)
                .get(`/api/v1/departments/${newDepartmentId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(getResponse.status).toBe(200);
        });
    });

    afterAll(async () => {
        await prisma.department.deleteMany({
            where: { collegeId: testCollegeId },
        });
        await prisma.college.deleteMany({ where: { id: testCollegeId } });
    });
});
