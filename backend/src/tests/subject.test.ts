/**
 * @file src/tests/subject.test.ts
 * @description Robust, independent integration tests for the Subject CRUD API endpoints.
 */

import app from "../index";
import request from "supertest";
import { prisma } from "../services/prisma.service";
import { SemesterType, SubjectType } from "@prisma/client";

describe("Subject API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let testDepartmentId: string;
    let testAcademicYearId: string;
    let testSemesterId: string;
    let newSubjectId: string;

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
            data: { name: "Subject Test College" },
        });
        testCollegeId = college.id;

        const department = await prisma.department.create({
            data: {
                name: "Test Dept For Sub",
                abbreviation: "TDS",
                collegeId: testCollegeId,
            },
        });
        testDepartmentId = department.id;

        const academicYear = await prisma.academicYear.create({
            data: { year: "2097-2098", collegeId: testCollegeId },
        });
        testAcademicYearId = academicYear.id;

        const semester = await prisma.semester.create({
            data: {
                semesterNumber: 3,
                semesterType: SemesterType.ODD,
                departmentId: testDepartmentId,
                academicYearId: testAcademicYearId,
            },
        });
        testSemesterId = semester.id;
    });

    // -- 2. TEST SUBJECT CREATION --
    it('should create a new subject "Data Structures"', async () => {
        const response = await request(app)
            .post("/api/v1/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Data Structures",
                code: "CE201",
                type: SubjectType.THEORY,
                departmentId: testDepartmentId,
                semesterId: testSemesterId,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.subject.name).toBe("Data Structures");
        newSubjectId = response.body.data.subject.id;
    });

    it("should fail to create a duplicate subject", async () => {
        const response = await request(app)
            .post("/api/v1/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Data Structures Algo", // Different name
                code: "CE201", // Same code
                type: SubjectType.THEORY,
                departmentId: testDepartmentId,
                semesterId: testSemesterId,
            });

        expect(response.status).toBe(409); // Conflict
    });

    // -- 3. TEST GETTING ALL SUBJECTS --
    it("should get all subjects for a semester", async () => {
        // Create a second subject to test the list
        await request(app)
            .post("/api/v1/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Database Management",
                code: "CE202",
                semesterId: testSemesterId,
                departmentId: testDepartmentId,
            });

        const response = await request(app)
            .get(`/api/v1/subjects?semesterId=${testSemesterId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(2);
        const names = response.body.data.subjects.map((s: any) => s.name);
        expect(names).toContain("Data Structures");
        expect(names).toContain("Database Management");
    });

    // -- 4. TEST GETTING ONE SUBJECT BY ID --
    it("should get a single subject by its ID", async () => {
        const response = await request(app)
            .get(`/api/v1/subjects/${newSubjectId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.data.subject.name).toBe("Data Structures");
    });

    // -- 5. TEST UPDATING A SUBJECT --
    it("should update the subject's type", async () => {
        const response = await request(app)
            .patch(`/api/v1/subjects/${newSubjectId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ type: SubjectType.PRACTICAL });
        expect(response.status).toBe(200);
        expect(response.body.data.subject.type).toBe("PRACTICAL");
    });

    // -- 6. TEST DELETING A SUBJECT --
    it("should soft delete the subject", async () => {
        const response = await request(app)
            .delete(`/api/v1/subjects/${newSubjectId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/subjects/${newSubjectId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    // -- 7. CLEANUP --
    afterAll(async () => {
        await prisma.subject.deleteMany({
            where: { semesterId: testSemesterId },
        });
        await prisma.semester.delete({ where: { id: testSemesterId } });
        await prisma.department.delete({ where: { id: testDepartmentId } });
        await prisma.academicYear.delete({ where: { id: testAcademicYearId } });
        await prisma.college.delete({ where: { id: testCollegeId } });
    });
});
