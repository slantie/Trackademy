/**
 * @file src/tests/college.test.ts
 * @description Robust, independent integration tests for the College CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";

describe("College API Endpoints", () => {
    let adminToken: string;
    let newCollegeId: string;
    const TEST_COLLEGE_NAME = "Integration Test College";

    // -- 1. SETUP: CLEANUP AND LOGIN --
    beforeAll(async () => {
        // Login as admin
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // Clean up any potential leftovers from previous failed test runs
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });
    });

    // -- 2. TEST COLLEGE CREATION --
    it("should create a new college", async () => {
        const response = await request(app)
            .post("/api/v1/colleges")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: TEST_COLLEGE_NAME,
                abbreviation: "ITC",
            });

        expect(response.status).toBe(201);
        expect(response.body.data.college.name).toBe(TEST_COLLEGE_NAME);
        expect(response.body.data.college.abbreviation).toBe("ITC");

        newCollegeId = response.body.data.college.id;
    });

    // -- 2B. TEST COLLEGE CREATION WITH ALL FIELDS --
    it("should create a college with contact information", async () => {
        const collegeData = {
            name: "Test College with Contact",
            abbreviation: "TCWC",
            website: "https://testcollege.edu",
            address:
                "123 Education Street, Learning City, Knowledge State 12345",
            contactNumber: "+91-9876543210",
        };

        const response = await request(app)
            .post("/api/v1/colleges")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(collegeData);

        expect(response.status).toBe(201);
        expect(response.body.data.college.name).toBe(collegeData.name);
        expect(response.body.data.college.website).toBe(collegeData.website);
        expect(response.body.data.college.address).toBe(collegeData.address);
        expect(response.body.data.college.contactNumber).toBe(
            collegeData.contactNumber
        );

        // Cleanup this test college
        await prisma.college.deleteMany({ where: { abbreviation: "TCWC" } });
    });

    // -- 3. TEST GETTING ALL COLLEGES --
    it("should get all colleges, including the newly created one", async () => {
        const response = await request(app)
            .get("/api/v1/colleges")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBeGreaterThanOrEqual(1);
        const names = response.body.data.colleges.map((c: any) => c.name);
        expect(names).toContain(TEST_COLLEGE_NAME);
    });

    // -- 4. TEST GETTING ONE COLLEGE BY ID --
    it("should get a single college by its ID", async () => {
        const response = await request(app)
            .get(`/api/v1/colleges/${newCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data.college.id).toBe(newCollegeId);
    });

    // -- 5. TEST UPDATING A COLLEGE --
    it("should update the college's abbreviation", async () => {
        const response = await request(app)
            .patch(`/api/v1/colleges/${newCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ abbreviation: "ITCE" });

        expect(response.status).toBe(200);
        expect(response.body.data.college.abbreviation).toBe("ITCE");
    });

    // -- 5B. TEST UPDATING COLLEGE CONTACT INFORMATION --
    it("should update the college's contact information", async () => {
        const updateData = {
            website: "https://updated-college.edu",
            address: "456 New Address Lane, Updated City, Modern State 67890",
            contactNumber: "+91-8765432109",
        };

        const response = await request(app)
            .patch(`/api/v1/colleges/${newCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.data.college.website).toBe(updateData.website);
        expect(response.body.data.college.address).toBe(updateData.address);
        expect(response.body.data.college.contactNumber).toBe(
            updateData.contactNumber
        );
    });

    // -- 5C. TEST CLEARING OPTIONAL FIELDS WITH EMPTY STRINGS --
    it("should handle empty strings for optional fields by setting them to null", async () => {
        const response = await request(app)
            .patch(`/api/v1/colleges/${newCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                website: "",
                address: "",
                contactNumber: "",
            });

        expect(response.status).toBe(200);
        expect(response.body.data.college.website).toBeNull();
        expect(response.body.data.college.address).toBeNull();
        expect(response.body.data.college.contactNumber).toBeNull();
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
            // Use deleteMany to avoid errors if the record was already deleted
            await prisma.college.deleteMany({ where: { id: newCollegeId } });
        }
    });
});
