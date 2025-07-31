/**
 * @file src/tests/faculty.test.ts
 * @description Robust, independent integration tests for the Faculty CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { Designation } from "@prisma/client";

describe("Faculty API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let testDepartmentId: string;
    let newFacultyUserId: string;
    let newFacultyProfileId: string;

    const TEST_FACULTY_EMAIL = "ada.lovelace@test.edu";
    const TEST_COLLEGE_NAME = "Faculty Test College";

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        const oldUser = await prisma.user.findUnique({
            where: { email: TEST_FACULTY_EMAIL },
        });
        if (oldUser) {
            await prisma.faculty.deleteMany({ where: { userId: oldUser.id } });
            await prisma.user.delete({ where: { id: oldUser.id } });
        }
        await prisma.department.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

        const college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "FTC" },
        });
        testCollegeId = college.id;

        const department = await prisma.department.create({
            data: {
                name: "Test Dept For Faculty",
                abbreviation: "TDF",
                collegeId: testCollegeId,
            },
        });
        testDepartmentId = department.id;
    });

    it("should create a new faculty member and their user account", async () => {
        const joiningDate = new Date().toISOString();
        const response = await request(app)
            .post("/api/v1/faculties")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                email: TEST_FACULTY_EMAIL,
                password: "password123",
                fullName: "Dr. Ada Lovelace",
                designation: Designation.PROFESSOR,
                departmentId: testDepartmentId,
                joiningDate: joiningDate,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.faculty.email).toBeUndefined(); // Ensure password is not returned
        expect(response.body.data.faculty.fullName).toBe("Dr. Ada Lovelace");
        expect(
            new Date(response.body.data.faculty.joiningDate).toISOString()
        ).toBe(joiningDate);

        newFacultyProfileId = response.body.data.faculty.id;
        newFacultyUserId = response.body.data.faculty.userId;
    });

    it("should get all faculties for a department", async () => {
        const response = await request(app)
            .get(`/api/v1/faculties?departmentId=${testDepartmentId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
    });

    it("should update the faculty's designation", async () => {
        const response = await request(app)
            .patch(`/api/v1/faculties/${newFacultyProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ designation: Designation.HOD });
        expect(response.status).toBe(200);
        expect(response.body.data.faculty.designation).toBe("HOD");
    });

    it("should soft delete the faculty profile", async () => {
        const response = await request(app)
            .delete(`/api/v1/faculties/${newFacultyProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/faculties/${newFacultyProfileId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    afterAll(async () => {
        if (newFacultyUserId) {
            await prisma.faculty.deleteMany({
                where: { userId: newFacultyUserId },
            });
            await prisma.user.deleteMany({ where: { id: newFacultyUserId } });
        }
        await prisma.department.deleteMany({ where: { id: testDepartmentId } });
        await prisma.college.deleteMany({ where: { id: testCollegeId } });
    });
});
