/**
 * @file src/tests/department.test.ts
 * @description Integration tests for the Department CRUD API endpoints.
 */

import app from "../index";
import request from "supertest";
import { prisma } from "../services/prisma.service";

describe("Department API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let itDepartmentId: string; // To store the ID of the 'IT' department we create

    // -- 1. SETUP: LOG IN, CREATE A COLLEGE AND A 'CE' DEPARTMENT --
    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        const college = await prisma.college.create({
            data: { name: "Dept Test College" },
        });
        testCollegeId = college.id;

        // Pre-create a 'CE' department to test against
        await prisma.department.create({
            data: {
                name: "Computer Engineering",
                abbreviation: "CE",
                collegeId: testCollegeId,
            },
        });
    });

    // -- 2. TEST DEPARTMENT CREATION --
    it("should create a new department (Information Technology)", async () => {
        const response = await request(app)
            .post("/api/v1/departments")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Information Technology",
                abbreviation: "IT",
                collegeId: testCollegeId,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.department.name).toBe(
            "Information Technology"
        );
        itDepartmentId = response.body.data.department.id;
    });

    // -- 3. TEST GETTING ALL DEPARTMENTS --
    it("should get all departments for the test college", async () => {
        const response = await request(app)
            .get(`/api/v1/departments?collegeId=${testCollegeId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(2);
        const names = response.body.data.departments.map((d: any) => d.name);
        expect(names).toContain("Computer Engineering");
        expect(names).toContain("Information Technology");
    });

    // -- 4. TEST GETTING ONE DEPARTMENT BY ID --
    it("should get a single department by its ID", async () => {
        const response = await request(app)
            .get(`/api/v1/departments/${itDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data.department.name).toBe(
            "Information Technology"
        );
    });

    // -- 5. TEST UPDATING A DEPARTMENT --
    it("should update the department's details", async () => {
        const response = await request(app)
            .patch(`/api/v1/departments/${itDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ abbreviation: "ICT" });
        expect(response.status).toBe(200);
        expect(response.body.data.department.abbreviation).toBe("ICT");
    });

    // -- 6. TEST DELETING A DEPARTMENT --
    it("should soft delete the department", async () => {
        const response = await request(app)
            .delete(`/api/v1/departments/${itDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/departments/${itDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    // -- 7. CLEANUP --
    afterAll(async () => {
        await prisma.department.deleteMany({
            where: { collegeId: testCollegeId },
        });
        await prisma.college.delete({ where: { id: testCollegeId } });
    });
});
