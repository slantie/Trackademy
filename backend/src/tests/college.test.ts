/**
 * @file src/tests/college.test.ts
 * @description Robust, independent integration tests for the College CRUD API endpoints.
 */

import app from "../index";
import request from "supertest";
import { prisma } from "../services/prisma.service";

describe("College API Endpoints", () => {
    let adminToken: string;
    let newCollegeId: string;

    // -- 1. SETUP: LOG IN AS ADMIN --
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });

        adminToken = loginResponse.body.token;
        expect(adminToken).toBeDefined();
    });

    // -- 2. TEST COLLEGE CREATION --
    it("should create a new college", async () => {
        const response = await request(app)
            .post("/api/v1/colleges")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Test College of Engineering",
                websiteUrl: "https://test-college.edu",
            });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.data.college.name).toBe(
            "Test College of Engineering"
        );

        newCollegeId = response.body.data.college.id;
        expect(newCollegeId).toBeDefined();
    });

    // -- 3. TEST GETTING ALL COLLEGES --
    it("should get all colleges, including the newly created one", async () => {
        const response = await request(app)
            .get("/api/v1/colleges")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBeGreaterThanOrEqual(1);

        const names = response.body.data.colleges.map((c: any) => c.name);
        // This test is now robust: it only checks for the college it created itself.
        expect(names).toContain("Test College of Engineering");
    });

    // -- 4. TEST GETTING ONE COLLEGE BY ID --
    it("should get a single college by its ID", async () => {
        const response = await request(app)
            .get(`/api/v1/colleges/${newCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.college.id).toBe(newCollegeId);
        expect(response.body.data.college.name).toBe(
            "Test College of Engineering"
        );
    });

    // -- 5. TEST UPDATING A COLLEGE --
    it("should update the college's details", async () => {
        const response = await request(app)
            .patch(`/api/v1/colleges/${newCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                address: "123 Test Street, Test City",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.college.address).toBe(
            "123 Test Street, Test City"
        );
    });

    // -- 6. TEST DELETING A COLLEGE --
    it("should soft delete the college", async () => {
        const response = await request(app)
            .delete(`/api/v1/colleges/${newCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/colleges/${newCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(getResponse.status).toBe(404);
    });

    // -- 7. CLEANUP --
    afterAll(async () => {
        if (newCollegeId) {
            try {
                await prisma.college.delete({ where: { id: newCollegeId } });
            } catch (error) {
                // Ignore errors if already deleted
            }
        }
    });
});
