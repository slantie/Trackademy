/**
 * @file src/tests/semester.test.ts
 * @description Robust, independent integration tests for the Semester CRUD API endpoints.
 */

import app from "../index";
import request from "supertest";
import { prisma } from "../services/prisma.service";
import { SemesterType } from "@prisma/client";

describe("Semester API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let testDepartmentId: string;
    let testAcademicYearId: string;
    let newSemesterId: string;

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

        // Create a temporary college, department, and academic year for this test suite
        const college = await prisma.college.create({
            data: { name: "Semester Test College" },
        });
        testCollegeId = college.id;

        const department = await prisma.department.create({
            data: {
                name: "Test Dept For Sem",
                abbreviation: "TDS",
                collegeId: testCollegeId,
            },
        });
        testDepartmentId = department.id;

        const academicYear = await prisma.academicYear.create({
            data: { year: "2099-2100", collegeId: testCollegeId },
        });
        testAcademicYearId = academicYear.id;
    });

    // -- 2. TEST SEMESTER CREATION --
    it("should create a new semester", async () => {
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
        expect(response.body.data.semester.semesterNumber).toBe(1);
        expect(response.body.data.semester.semesterType).toBe("ODD");
        newSemesterId = response.body.data.semester.id;
    });

    it("should fail to create a duplicate semester", async () => {
        const response = await request(app)
            .post("/api/v1/semesters")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                semesterNumber: 1,
                semesterType: SemesterType.ODD, // This field is not part of the unique constraint
                departmentId: testDepartmentId,
                academicYearId: testAcademicYearId,
            });

        expect(response.status).toBe(409); // Conflict
    });

    // -- 3. TEST GETTING ALL SEMESTERS --
    it("should get all semesters for a department", async () => {
        // Create a second semester to test the list
        await request(app)
            .post("/api/v1/semesters")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                semesterNumber: 2,
                semesterType: SemesterType.EVEN,
                departmentId: testDepartmentId,
                academicYearId: testAcademicYearId,
            });

        const response = await request(app)
            .get(`/api/v1/semesters?departmentId=${testDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(2);
    });

    // -- 4. TEST GETTING ONE SEMESTER BY ID --
    it("should get a single semester by its ID", async () => {
        const response = await request(app)
            .get(`/api/v1/semesters/${newSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data.semester.semesterNumber).toBe(1);
    });

    // -- 5. TEST UPDATING A SEMESTER --
    it("should update the semester's type", async () => {
        const response = await request(app)
            .patch(`/api/v1/semesters/${newSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ semesterType: SemesterType.EVEN });
        expect(response.status).toBe(200);
        expect(response.body.data.semester.semesterType).toBe("EVEN");
    });

    // -- 6. TEST DELETING A SEMESTER --
    it("should soft delete the semester", async () => {
        const response = await request(app)
            .delete(`/api/v1/semesters/${newSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/semesters/${newSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    // -- 7. CLEANUP --
    afterAll(async () => {
        // Clean up all data created during the test in reverse order of creation
        await prisma.semester.deleteMany({
            where: { departmentId: testDepartmentId },
        });
        await prisma.department.delete({ where: { id: testDepartmentId } });
        await prisma.academicYear.delete({ where: { id: testAcademicYearId } });
        await prisma.college.delete({ where: { id: testCollegeId } });
    });
});
