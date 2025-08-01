/**
 * @file src/tests/upload.test.ts
 * @description Robust, independent integration tests for the Attendance Upload endpoint.
 */

import request from "supertest";
import app from "../app";
import { prisma } from "../config/prisma.service";
import { Designation, LectureType, Role, SemesterType } from "@prisma/client";
import ExcelJS from "exceljs";
import { hashPassword } from "../utils/hash";

describe("Attendance Upload API Endpoint", () => {
    let adminToken: string;
    let testData: any = {};
    const TEST_COLLEGE_NAME = "Attendance Test College";

    beforeAll(async () => {
        const loginResponse = await request(app)
            .post("/api/v1/auth/login")
            .send({
                identifier: "admin_ce@ldrp.ac.in",
                password: "password123",
            });
        adminToken = loginResponse.body.token;

        // --- Robust Cleanup ---
        await prisma.attendance.deleteMany({});
        await prisma.course.deleteMany({});
        await prisma.student.deleteMany({
            where: { user: { email: { contains: "@attendancetest.edu" } } },
        });
        await prisma.faculty.deleteMany({
            where: { user: { email: { contains: "@attendancetest.edu" } } },
        });
        await prisma.user.deleteMany({
            where: { email: { contains: "@attendancetest.edu" } },
        });
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
        await prisma.subject.deleteMany({
            where: { department: { college: { name: TEST_COLLEGE_NAME } } },
        });
        await prisma.department.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.academicYear.deleteMany({
            where: { college: { name: TEST_COLLEGE_NAME } },
        });
        await prisma.college.deleteMany({ where: { name: TEST_COLLEGE_NAME } });

        // --- Create a full hierarchy of test data ---
        testData.college = await prisma.college.create({
            data: { name: TEST_COLLEGE_NAME, abbreviation: "ATTC" },
        });
        testData.department = await prisma.department.create({
            data: {
                name: "Test Dept For Attend",
                abbreviation: "TDA",
                collegeId: testData.college.id,
            },
        });
        testData.academicYear = await prisma.academicYear.create({
            data: {
                year: "2092-2093",
                collegeId: testData.college.id,
                isActive: true,
            },
        });
        testData.semester = await prisma.semester.create({
            data: {
                semesterNumber: 1,
                semesterType: SemesterType.ODD,
                departmentId: testData.department.id,
                academicYearId: testData.academicYear.id,
            },
        });
        testData.division = await prisma.division.create({
            data: { name: "ATT1", semesterId: testData.semester.id },
        });
        testData.subject = await prisma.subject.create({
            data: {
                name: "Attendance Subject",
                abbreviation: "AS",
                code: "AS101",
                semesterNumber: 1,
                departmentId: testData.department.id,
            },
        });

        // FIX: Use correctly hashed passwords for all created users
        const facultyUser = await prisma.user.create({
            data: {
                email: "attendance.faculty@attendancetest.edu",
                password: await hashPassword("password123"),
                role: Role.FACULTY,
            },
        });
        testData.faculty = await prisma.faculty.create({
            data: {
                fullName: "Prof. Attendance",
                abbreviation: "PA",
                designation: Designation.PROFESSOR,
                userId: facultyUser.id,
                departmentId: testData.department.id,
            },
        });

        testData.theoryCourse = await prisma.course.create({
            data: {
                subjectId: testData.subject.id,
                facultyId: testData.faculty.id,
                semesterId: testData.semester.id,
                divisionId: testData.division.id,
                lectureType: LectureType.THEORY,
            },
        });
        testData.labCourse = await prisma.course.create({
            data: {
                subjectId: testData.subject.id,
                facultyId: testData.faculty.id,
                semesterId: testData.semester.id,
                divisionId: testData.division.id,
                lectureType: LectureType.PRACTICAL,
                batch: "B1",
            },
        });

        const studentUser1 = await prisma.user.create({
            data: {
                email: "student1@attendancetest.edu",
                password: await hashPassword("password123"),
                role: Role.STUDENT,
            },
        });
        testData.student1 = await prisma.student.create({
            data: {
                userId: studentUser1.id,
                fullName: "Student One",
                enrollmentNumber: "ATTEND001",
                batch: "B1",
                departmentId: testData.department.id,
                semesterId: testData.semester.id,
                divisionId: testData.division.id,
            },
        });
        const studentUser2 = await prisma.user.create({
            data: {
                email: "student2@attendancetest.edu",
                password: await hashPassword("password123"),
                role: Role.STUDENT,
            },
        });
        testData.student2 = await prisma.student.create({
            data: {
                userId: studentUser2.id,
                fullName: "Student Two",
                enrollmentNumber: "ATTEND002",
                batch: "B2",
                departmentId: testData.department.id,
                semesterId: testData.semester.id,
                divisionId: testData.division.id,
            },
        });
    });

    it("should successfully upload attendance for a THEORY course", async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Attendance");
        sheet.columns = [
            { header: "Enrollment No.", key: "enrollment" },
            { header: "Student Name", key: "name" },
            { header: "Attendance (1/0)", key: "status" },
        ];
        sheet.addRow({
            enrollment: "ATTEND001",
            name: "Student One",
            status: 1,
        });
        sheet.addRow({
            enrollment: "ATTEND002",
            name: "Student Two",
            status: 0,
        });
        const arrayBuffer = await workbook.xlsx.writeBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const response = await request(app)
            .post("/api/v1/upload/attendance")
            .set("Authorization", `Bearer ${adminToken}`)
            .field("academicYearId", testData.academicYear.id) // FIX: Send the specific academic year ID
            .field("departmentId", testData.department.id)
            .field("semesterNumber", "1")
            .field("divisionId", testData.division.id)
            .field("subjectId", testData.subject.id)
            .field("lectureType", LectureType.THEORY)
            .field("date", "01-08-2025")
            .attach("file", buffer, "attendance.xlsx");

        expect(response.status).toBe(201);
        expect(response.body.data.createdCount).toBe(2);
    });

    it("should correctly upload attendance for a PRACTICAL course, skipping students from other batches", async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Attendance");
        sheet.columns = [
            { header: "Enrollment No.", key: "enrollment" },
            { header: "Student Name", key: "name" },
            { header: "Attendance (1/0)", key: "status" },
        ];
        sheet.addRow({
            enrollment: "ATTEND001",
            name: "Student One",
            status: 1,
        });
        sheet.addRow({
            enrollment: "ATTEND002",
            name: "Student Two",
            status: 1,
        });
        const arrayBuffer = await workbook.xlsx.writeBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const response = await request(app)
            .post("/api/v1/upload/attendance")
            .set("Authorization", `Bearer ${adminToken}`)
            .field("academicYearId", testData.academicYear.id) // FIX: Send the specific academic year ID
            .field("departmentId", testData.department.id)
            .field("semesterNumber", "1")
            .field("divisionId", testData.division.id)
            .field("subjectId", testData.subject.id)
            .field("lectureType", LectureType.PRACTICAL)
            .field("batch", "B1")
            .field("date", "02-08-2025")
            .attach("file", buffer, "attendance_lab.xlsx");

        expect(response.status).toBe(201);
        expect(response.body.data.createdCount).toBe(1);
        expect(response.body.data.skippedCount).toBe(1);
    });

    afterAll(async () => {
        // Cleanup in reverse order of creation
        await prisma.attendance.deleteMany({});
        await prisma.course.deleteMany({});
        await prisma.student.deleteMany({
            where: { user: { email: { contains: "@attendancetest.edu" } } },
        });
        await prisma.faculty.deleteMany({
            where: { departmentId: testData.department.id },
        });
        await prisma.user.deleteMany({
            where: { email: { contains: "@attendancetest.edu" } },
        });
        await prisma.subject.deleteMany({
            where: { departmentId: testData.department.id },
        });
        await prisma.division.deleteMany({
            where: { semesterId: testData.semester.id },
        });
        await prisma.semester.deleteMany({
            where: { id: testData.semester.id },
        });
        await prisma.department.deleteMany({
            where: { id: testData.department.id },
        });
        await prisma.academicYear.deleteMany({
            where: { id: testData.academicYear.id },
        });
        await prisma.college.deleteMany({ where: { id: testData.college.id } });
    });
});
