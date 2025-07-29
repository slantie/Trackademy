/**
 * @file src/tests/division.test.ts
 * @description Robust, independent integration tests for the Division CRUD API endpoints.
 */

import app from "../index";
import request from "supertest";
import { prisma } from "../services/prisma.service";
import { SemesterType } from "@prisma/client";

describe("Division API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let testDepartmentId: string;
    let testAcademicYearId: string;
    let testSemesterId: string;
    let newDivisionId: string;

    // -- 1. SETUP: CREATE ALL PREREQUISITE DATA --
    beforeAll(async () => {
        // Login as admin
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // Create a temporary college, department, academic year, and semester
        const college = await prisma.college.create({
            data: { name: "Division Test College" },
        });
        testCollegeId = college.id;

        const department = await prisma.department.create({
            data: {
                name: "Test Dept For Div",
                abbreviation: "TDD",
                collegeId: testCollegeId,
            },
        });
        testDepartmentId = department.id;

        const academicYear = await prisma.academicYear.create({
            data: { year: "2098-2099", collegeId: testCollegeId },
        });
        testAcademicYearId = academicYear.id;

        const semester = await prisma.semester.create({
            data: {
                semesterNumber: 5,
                semesterType: SemesterType.ODD,
                departmentId: testDepartmentId,
                academicYearId: testAcademicYearId,
            },
        });
        testSemesterId = semester.id;
    });

    // -- 2. TEST DIVISION CREATION --
    it('should create a new division "A"', async () => {
        const response = await request(app)
            .post("/api/v1/divisions")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "A",
                semesterId: testSemesterId,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.division.name).toBe("A");
        newDivisionId = response.body.data.division.id;
    });

    it("should fail to create a duplicate division", async () => {
        const response = await request(app)
            .post("/api/v1/divisions")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "A",
                semesterId: testSemesterId,
            });

        expect(response.status).toBe(409); // Conflict
    });

    // -- 3. TEST GETTING ALL DIVISIONS --
    it("should get all divisions for a semester", async () => {
        // Create a second division to test the list
        await request(app)
            .post("/api/v1/divisions")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "B", semesterId: testSemesterId });

        const response = await request(app)
            .get(`/api/v1/divisions?semesterId=${testSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(2);
        const names = response.body.data.divisions.map((d: any) => d.name);
        expect(names).toContain("A");
        expect(names).toContain("B");
    });

    // -- 4. TEST GETTING ONE DIVISION BY ID --
    it("should get a single division by its ID", async () => {
        const response = await request(app)
            .get(`/api/v1/divisions/${newDivisionId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data.division.name).toBe("A");
    });

    // -- 5. TEST UPDATING A DIVISION --
    it("should update the division's name", async () => {
        const response = await request(app)
            .patch(`/api/v1/divisions/${newDivisionId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "A1" });
        expect(response.status).toBe(200);
        expect(response.body.data.division.name).toBe("A1");
    });

    // -- 6. TEST DELETING A DIVISION --
    it("should soft delete the division", async () => {
        const response = await request(app)
            .delete(`/api/v1/divisions/${newDivisionId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/divisions/${newDivisionId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    // -- 7. CLEANUP --
    afterAll(async () => {
        // Clean up all data created during the test in reverse order of creation
        await prisma.division.deleteMany({
            where: { semesterId: testSemesterId },
        });
        await prisma.semester.delete({ where: { id: testSemesterId } });
        await prisma.department.delete({ where: { id: testDepartmentId } });
        await prisma.academicYear.delete({ where: { id: testAcademicYearId } });
        await prisma.college.delete({ where: { id: testCollegeId } });
    });
});
