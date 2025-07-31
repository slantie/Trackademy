/**
 * @file src/tests/division.test.ts
 * @description Robust, independent integration tests for the Division CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { SemesterType } from "@prisma/client";

describe("Division API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let testDepartmentId: string;
    let testAcademicYearId: string;
    let testSemesterId: string;
    let newDivisionId: string;
    const TEST_COLLEGE_NAME = "Division Test College";

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // Cleanup
        await prisma.division.deleteMany({
            where: {
                semester: {
                    academicYear: { college: { name: TEST_COLLEGE_NAME } },
                },
            },
        });
        await prisma.semester.deleteMany({
            where: { academicYear: { college: { name: TEST_COLLEGE_NAME } } },
        });
        await prisma.department.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.academicYear.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

        // Create prerequisites
        const college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "DTC" },
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

    it("should get all divisions for a semester", async () => {
        const response = await request(app)
            .get(`/api/v1/divisions?semesterId=${testSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
        expect(response.body.data.divisions[0].name).toBe("A");
    });

    it("should update the division's name", async () => {
        const response = await request(app)
            .patch(`/api/v1/divisions/${newDivisionId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "A1" });
        expect(response.status).toBe(200);
        expect(response.body.data.division.name).toBe("A1");
    });

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

    afterAll(async () => {
        await prisma.division.deleteMany({
            where: { semesterId: testSemesterId },
        });
        await prisma.semester.deleteMany({ where: { id: testSemesterId } });
        await prisma.department.deleteMany({ where: { id: testDepartmentId } });
        await prisma.academicYear.deleteMany({
            where: { id: testAcademicYearId },
        });
        await prisma.college.deleteMany({ where: { id: testCollegeId } });
    });
});
