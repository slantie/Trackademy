/**
 * @file src/tests/semester.test.ts
 * @description Robust, independent integration tests for the Semester CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { SemesterType } from "@prisma/client";

describe("Semester API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let testDepartmentId: string;
    let testAcademicYearId: string;
    let newSemesterId: string;
    const TEST_COLLEGE_NAME = "Semester Test College";

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // --- Robust Cleanup ---
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

        // --- Create Prerequisites ---
        const college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "SEMTC" },
        }); // Unique abbreviation
        testCollegeId = college.id;

        const department = await prisma.department.create({
            data: {
                name: "Test Dept For Sem",
                abbreviation: "TDSEM",
                collegeId: testCollegeId,
            },
        });
        testDepartmentId = department.id;

        const academicYear = await prisma.academicYear.create({
            data: { year: "2099-2100", collegeId: testCollegeId },
        });
        testAcademicYearId = academicYear.id;
    });

    it("should create a new semester instance", async () => {
        const response = await request(app)
            .post("/api/v1/semesters")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                semesterNumber: 1,
                semesterType: SemesterType.ODD,
                departmentId: testDepartmentId,
                academicYearId: testAcademicYearId,
            });

        expect(response.status).toBe(201);
        newSemesterId = response.body.data.semester.id;
    });

    // ... other tests remain the same ...
    it("should get all semesters for a department and academic year", async () => {
        const response = await request(app)
            .get(
                `/api/v1/semesters?departmentId=${testDepartmentId}&academicYearId=${testAcademicYearId}`
            )
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
    });

    it("should soft delete the semester", async () => {
        await request(app)
            .delete(`/api/v1/semesters/${newSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        const getResponse = await request(app)
            .get(`/api/v1/semesters/${newSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    afterAll(async () => {
        // Correct cleanup order
        await prisma.semester.deleteMany({
            where: { departmentId: testDepartmentId },
        });
        await prisma.department.deleteMany({ where: { id: testDepartmentId } });
        await prisma.academicYear.deleteMany({
            where: { id: testAcademicYearId },
        });
        await prisma.college.deleteMany({ where: { id: testCollegeId } });
    });
});
