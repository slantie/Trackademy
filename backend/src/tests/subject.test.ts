/**
 * @file src/tests/subject.test.ts
 * @description Robust, independent integration tests for the Subject CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { SubjectType } from "@prisma/client";

describe("Subject API Endpoints", () => {
    let adminToken: string;
    let testCollegeId: string;
    let testDepartmentId: string;
    let newSubjectId: string;
    const TEST_COLLEGE_NAME = "Subject Test College";

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // --- Robust Cleanup ---
        // Delete in reverse order of dependency
        await prisma.subject.deleteMany({
            where: { department: { college: { name: TEST_COLLEGE_NAME } } },
        });
        await prisma.department.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

        // --- Create Prerequisites ---
        const college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "SUBTC" }, // Unique abbreviation
        });
        testCollegeId = college.id;

        const department = await prisma.department.create({
            data: {
                name: "Test Dept For Subject",
                abbreviation: "TDSUB",
                collegeId: testCollegeId,
            },
        });
        testDepartmentId = department.id;
    });

    it("should create a new master subject", async () => {
        const response = await request(app)
            .post("/api/v1/subjects")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Advanced Programming",
                abbreviation: "AP",
                code: "TS301",
                type: SubjectType.MANDATORY,
                semesterNumber: 3,
                departmentId: testDepartmentId,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.subject.name).toBe("Advanced Programming");
        newSubjectId = response.body.data.subject.id;
    });

    // ... other tests remain the same ...
    it("should get all subjects for a specific department and semester number", async () => {
        const response = await request(app)
            .get(
                `/api/v1/subjects?departmentId=${testDepartmentId}&semesterNumber=3`
            )
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
    });

    it("should update the subject's type", async () => {
        const response = await request(app)
            .patch(`/api/v1/subjects/${newSubjectId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ type: SubjectType.ELECTIVE });
        expect(response.status).toBe(200);
        expect(response.body.data.subject.type).toBe("ELECTIVE");
    });

    it("should soft delete the subject", async () => {
        await request(app)
            .delete(`/api/v1/subjects/${newSubjectId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        const getResponse = await request(app)
            .get(`/api/v1/subjects/${newSubjectId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(404);
    });

    afterAll(async () => {
        // Correct cleanup order
        await prisma.subject.deleteMany({
            where: { departmentId: testDepartmentId },
        });
        await prisma.department.deleteMany({ where: { id: testDepartmentId } });
        await prisma.college.deleteMany({ where: { id: testCollegeId } });
    });
});
