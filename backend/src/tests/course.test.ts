/**
 * @file src/tests/course.test.ts
 * @description Robust, independent integration tests for the Course (Offering) CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import {
    Designation,
    LectureType,
    Role,
    SemesterType,
    SubjectType,
} from "@prisma/client";

describe("Course API Endpoints", () => {
    let adminToken: string;
    let testCollege: any,
        testDepartment: any,
        testAcademicYear: any,
        testSemester: any,
        testDivision: any,
        testSubject: any,
        testFaculty: any;
    let newCourseId: string;

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // --- Create all prerequisite master and instance data ---
        testCollege = await prisma.college.create({
            data: { name: "Course Test College", abbreviation: "CTC" },
        });
        testDepartment = await prisma.department.create({
            data: {
                name: "Test Dept For Course",
                abbreviation: "TDC",
                collegeId: testCollege.id,
            },
        });
        testAcademicYear = await prisma.academicYear.create({
            data: { year: "2095-2096", collegeId: testCollege.id },
        });
        testSemester = await prisma.semester.create({
            data: {
                semesterNumber: 7,
                semesterType: SemesterType.ODD,
                departmentId: testDepartment.id,
                academicYearId: testAcademicYear.id,
            },
        });
        testDivision = await prisma.division.create({
            data: { name: "C1", semesterId: testSemester.id },
        });
        testSubject = await prisma.subject.create({
            data: {
                name: "Cloud Computing",
                abbreviation: "CC",
                code: "TC701",
                semesterNumber: 7,
                departmentId: testDepartment.id,
            },
        });

        const facultyUser = await prisma.user.create({
            data: {
                email: "course.faculty@test.edu",
                password: "123",
                role: Role.FACULTY,
            },
        });
        testFaculty = await prisma.faculty.create({
            data: {
                fullName: "Prof. Course Test",
                designation: Designation.PROFESSOR,
                userId: facultyUser.id,
                departmentId: testDepartment.id,
            },
        });
    });

    it("should create a new course offering (allocation)", async () => {
        const response = await request(app)
            .post("/api/v1/courses")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                subjectId: testSubject.id,
                facultyId: testFaculty.id,
                semesterId: testSemester.id,
                divisionId: testDivision.id,
                lectureType: LectureType.THEORY,
                batch: null,
            });

        expect(response.status).toBe(201);
        expect(response.body.data.course.subjectId).toBe(testSubject.id);
        newCourseId = response.body.data.course.id;
    });

    it("should get all course offerings for a division", async () => {
        const response = await request(app)
            .get(`/api/v1/courses?divisionId=${testDivision.id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.results).toBe(1);
        expect(response.body.data.courses[0].subject.name).toBe(
            "Cloud Computing"
        );
        expect(response.body.data.courses[0].faculty.fullName).toBe(
            "Prof. Course Test"
        );
    });

    it("should soft delete the course offering", async () => {
        const response = await request(app)
            .delete(`/api/v1/courses/${newCourseId}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(response.status).toBe(204);

        const getResponse = await request(app)
            .get(`/api/v1/courses?divisionId=${testDivision.id}`)
            .set("Authorization", `Bearer ${adminToken}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body.results).toBe(0);
    });

    afterAll(async () => {
        // Cleanup in reverse order of creation and dependency
        await prisma.course.deleteMany({
            where: { semesterId: testSemester.id },
        });
        await prisma.division.deleteMany({
            where: { semesterId: testSemester.id },
        });
        await prisma.semester.deleteMany({ where: { id: testSemester.id } });
        await prisma.academicYear.deleteMany({
            where: { id: testAcademicYear.id },
        });
        await prisma.subject.deleteMany({
            where: { departmentId: testDepartment.id },
        });
        await prisma.faculty.deleteMany({
            where: { departmentId: testDepartment.id },
        });
        await prisma.user.deleteMany({
            where: { email: "course.faculty@test.edu" },
        });
        await prisma.department.deleteMany({
            where: { id: testDepartment.id },
        });
        await prisma.college.deleteMany({ where: { id: testCollege.id } });
    });
});
