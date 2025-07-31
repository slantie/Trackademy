/**
 * @file src/tests/student.test.ts
 * @description Robust, independent integration tests for the Student CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { SemesterType } from "@prisma/client";

describe("Student API Endpoints", () => {
    let adminToken: string;
    let testCollege: any,
        testDepartment: any,
        testAcademicYear: any,
        testSemester: any,
        testDivision: any;
    let newStudentUserId: string;
    let newStudentProfileId: string;

    const TEST_STUDENT_EMAIL = "john.doe@test.edu";
    const TEST_COLLEGE_NAME = "Student Test College";

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // --- Robust Cleanup ---
        const oldUser = await prisma.user.findUnique({
            where: { email: TEST_STUDENT_EMAIL },
        });
        if (oldUser) {
            await prisma.student.deleteMany({ where: { userId: oldUser.id } });
            await prisma.user.delete({ where: { id: oldUser.id } });
        }
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

        // --- Create Prerequisites ---
        testCollege = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "STUDTC" },
        }); // Unique abbreviation
        testDepartment = await prisma.department.create({
            data: {
                name: "Test Dept For Student",
                abbreviation: "TDSTUD",
                collegeId: testCollege.id,
            },
        });
        testAcademicYear = await prisma.academicYear.create({
            data: { year: "2096-2097", collegeId: testCollege.id },
        });
        testSemester = await prisma.semester.create({
            data: {
                semesterNumber: 1,
                semesterType: SemesterType.ODD,
                departmentId: testDepartment.id,
                academicYearId: testAcademicYear.id,
            },
        });
        testDivision = await prisma.division.create({
            data: { name: "S1", semesterId: testSemester.id },
        });
    });

    it("should create a new student and a corresponding user account", async () => {
        const response = await request(app)
            .post("/api/v1/students")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                email: TEST_STUDENT_EMAIL,
                password: "password123",
                fullName: "John Doe",
                enrollmentNumber: "TEST001",
                batch: "T1",
                departmentId: testDepartment.id,
                semesterId: testSemester.id,
                divisionId: testDivision.id,
            });

        expect(response.status).toBe(201);
        newStudentProfileId = response.body.data.student.id;
        newStudentUserId = response.body.data.student.userId;
    });

    // ... other tests remain the same ...
    it("should get all students for a specific division", async () => {
        const response = await request(app)
            .get(`/api/v1/students?divisionId=${testDivision.id}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
    });

    it("should update the student's batch", async () => {
        const response = await request(app)
            .patch(`/api/v1/students/${newStudentProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ batch: "T2" });
        expect(response.status).toBe(200);
        expect(response.body.data.student.batch).toBe("T2");
    });

    it("should soft delete the student profile", async () => {
        await request(app)
            .delete(`/api/v1/students/${newStudentProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        const getResponse = await request(app)
            .get(`/api/v1/students/${newStudentProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    afterAll(async () => {
        // Correct cleanup order
        if (newStudentUserId) {
            await prisma.student.deleteMany({
                where: { userId: newStudentUserId },
            });
            await prisma.user.deleteMany({ where: { id: newStudentUserId } });
        }
        await prisma.division.deleteMany({ where: { id: testDivision.id } });
        await prisma.semester.deleteMany({ where: { id: testSemester.id } });
        await prisma.department.deleteMany({
            where: { id: testDepartment.id },
        });
        await prisma.academicYear.deleteMany({
            where: { id: testAcademicYear.id },
        });
        await prisma.college.deleteMany({ where: { id: testCollege.id } });
    });
});
