// /**
//  * @file src/tests/subject.test.ts
//  * @description Comprehensive integration tests for the Subject CRUD API endpoints.
//  */

// import {
//     describe,
//     beforeAll,
//     afterAll,
//     beforeEach,
//     test,
//     expect,
//     jest,
// } from "@jest/globals";
// import request from "supertest";
// import app from "../app";
// import { prisma } from "../config/prisma.service";
// import { Role, SubjectType } from "@prisma/client";

// describe("Subject API", () => {
//     let adminToken: string;
//     let facultyToken: string;
//     let collegeId: string;
//     let departmentId: string;
//     let subjectId: string;

//     beforeAll(async () => {
//         // Create test college
//         const college = await prisma.college.create({
//             data: {
//                 name: "Test College",
//                 abbreviation: "TC001",
//                 address: "123 Test Street",
//                 contactNumber: "+1234567890",
//                 website: "https://testcollege.edu",
//             },
//         });
//         collegeId = college.id;

//         // Create test department
//         const department = await prisma.department.create({
//             data: {
//                 name: "Test Department",
//                 abbreviation: "TD001",
//                 collegeId,
//             },
//         });
//         departmentId = department.id;

//         // Create admin user
//         const admin = await prisma.user.create({
//             data: {
//                 email: "admin@test.com",
//                 password: "hashed_password",
//                 role: Role.ADMIN,
//             },
//         });

//         // Create faculty user
//         const faculty = await prisma.user.create({
//             data: {
//                 email: "faculty@test.com",
//                 password: "hashed_password",
//                 role: Role.FACULTY,
//             },
//         });

//         // Generate auth tokens (mocked for testing)
//         adminToken = "mock-admin-token";
//         facultyToken = "mock-faculty-token";
//     });

//     afterAll(async () => {
//         // Clean up test data
//         await prisma.subject.deleteMany();
//         await prisma.department.deleteMany();
//         await prisma.college.deleteMany();
//         await prisma.user.deleteMany();
//         await prisma.$disconnect();
//     });

//     beforeEach(async () => {
//         // Clean up subjects before each test
//         await prisma.subject.deleteMany();
//     });

//     describe("POST /api/v1/subjects", () => {
//         test("should create a new subject with valid data", async () => {
//             const subjectData = {
//                 name: "Data Structures",
//                 code: "CS201",
//                 abbreviation: "DS",
//                 type: SubjectType.MANDATORY,
//                 semesterNumber: 3,
//                 departmentId,
//             };

//             const response = await request(app)
//                 .post("/api/v1/subjects")
//                 .set("Authorization", `Bearer ${adminToken}`)
//                 .send(subjectData);

//             expect(response.status).toBe(201);
//             expect(response.body.success).toBe(true);
//             expect(response.body.data.name).toBe(subjectData.name);
//             expect(response.body.data.code).toBe(subjectData.code);
//             expect(response.body.data.type).toBe(subjectData.type);

//             subjectId = response.body.data.id;
//         });

//         test("should fail to create subject with duplicate code", async () => {
//             // Create first subject
//             await prisma.subject.create({
//                 data: {
//                     name: "First Subject",
//                     code: "DUP001",
//                     abbreviation: "FS",
//                     credits: 3,
//                     type: SubjectType.MANDATORY,
//                     semester: 1,
//                     departmentId,
//                 },
//             });

//             const duplicateData = {
//                 name: "Second Subject",
//                 code: "DUP001", // Same code
//                 abbreviation: "SS",
//                 credits: 3,
//                 type: SubjectType.ELECTIVE,
//                 semester: 2,
//                 departmentId,
//             };

//             const response = await request(app)
//                 .post("/api/v1/subjects")
//                 .set("Authorization", `Bearer ${adminToken}`)
//                 .send(duplicateData);

//             expect(response.status).toBe(400);
//             expect(response.body.success).toBe(false);
//         });

//         test("should fail to create subject with invalid department", async () => {
//             const subjectData = {
//                 name: "Invalid Subject",
//                 code: "INV001",
//                 abbreviation: "IS",
//                 credits: 3,
//                 type: SubjectType.MANDATORY,
//                 semester: 1,
//                 departmentId: "invalid-department-id",
//             };

//             const response = await request(app)
//                 .post("/api/v1/subjects")
//                 .set("Authorization", `Bearer ${adminToken}`)
//                 .send(subjectData);

//             expect(response.status).toBe(400);
//             expect(response.body.success).toBe(false);
//         });

//         test("should require admin role", async () => {
//             const subjectData = {
//                 name: "Unauthorized Subject",
//                 code: "UN001",
//                 abbreviation: "US",
//                 credits: 3,
//                 type: SubjectType.MANDATORY,
//                 semester: 1,
//                 departmentId,
//             };

//             const response = await request(app)
//                 .post("/api/v1/subjects")
//                 .set("Authorization", `Bearer ${facultyToken}`)
//                 .send(subjectData);

//             expect(response.status).toBe(403);
//             expect(response.body.success).toBe(false);
//         });
//     });

//     describe("GET /api/v1/subjects", () => {
//         beforeEach(async () => {
//             // Create test subjects
//             await prisma.subject.createMany({
//                 data: [
//                     {
//                         name: "Mathematics I",
//                         code: "MATH101",
//                         abbreviation: "M1",
//                         credits: 4,
//                         type: SubjectType.MANDATORY,
//                         semester: 1,
//                         departmentId,
//                     },
//                     {
//                         name: "Physics I",
//                         code: "PHY101",
//                         abbreviation: "P1",
//                         credits: 3,
//                         type: SubjectType.MANDATORY,
//                         semester: 1,
//                         departmentId,
//                     },
//                     {
//                         name: "Elective Course",
//                         code: "ELEC201",
//                         abbreviation: "EC",
//                         credits: 2,
//                         type: SubjectType.ELECTIVE,
//                         semester: 3,
//                         departmentId,
//                     },
//                 ],
//             });
//         });

//         test("should get all subjects", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);
//             expect(response.body.data).toHaveLength(3);
//             expect(response.body.pagination.total).toBe(3);
//         });

//         test("should support pagination", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects?page=1&limit=2")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.data).toHaveLength(2);
//             expect(response.body.pagination.page).toBe(1);
//             expect(response.body.pagination.limit).toBe(2);
//             expect(response.body.pagination.total).toBe(3);
//         });

//         test("should support semester filtering", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects?semester=1")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.data).toHaveLength(2);
//             expect(response.body.data.every((s: any) => s.semester === 1)).toBe(
//                 true
//             );
//         });

//         test("should support department filtering", async () => {
//             const response = await request(app)
//                 .get(`/api/v1/subjects?departmentId=${departmentId}`)
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.data).toHaveLength(3);
//             expect(
//                 response.body.data.every(
//                     (s: any) => s.departmentId === departmentId
//                 )
//             ).toBe(true);
//         });
//     });

//     describe("GET /api/v1/subjects/count", () => {
//         beforeEach(async () => {
//             await prisma.subject.createMany({
//                 data: [
//                     {
//                         name: "Subject 1",
//                         code: "SUB001",
//                         abbreviation: "S1",
//                         credits: 3,
//                         type: SubjectType.MANDATORY,
//                         semester: 1,
//                         departmentId,
//                     },
//                     {
//                         name: "Subject 2",
//                         code: "SUB002",
//                         abbreviation: "S2",
//                         credits: 4,
//                         type: SubjectType.ELECTIVE,
//                         semester: 2,
//                         departmentId,
//                     },
//                 ],
//             });
//         });

//         test("should get total count", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects/count")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);
//             expect(response.body.data.count).toBe(2);
//         });

//         test("should support filtering in count", async () => {
//             const response = await request(app)
//                 .get(
//                     `/api/v1/subjects/count?departmentId=${departmentId}&semester=1`
//                 )
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.data.count).toBe(1);
//         });
//     });

//     describe("GET /api/v1/subjects/search", () => {
//         beforeEach(async () => {
//             await prisma.subject.createMany({
//                 data: [
//                     {
//                         name: "Data Structures and Algorithms",
//                         code: "CS301",
//                         abbreviation: "DSA",
//                         credits: 4,
//                         type: SubjectType.MANDATORY,
//                         semester: 3,
//                         departmentId,
//                     },
//                     {
//                         name: "Database Management",
//                         code: "CS302",
//                         abbreviation: "DBM",
//                         credits: 3,
//                         type: SubjectType.MANDATORY,
//                         semester: 3,
//                         departmentId,
//                     },
//                     {
//                         name: "Web Development",
//                         code: "CS303",
//                         abbreviation: "WD",
//                         credits: 3,
//                         type: SubjectType.ELECTIVE,
//                         semester: 4,
//                         departmentId,
//                     },
//                 ],
//             });
//         });

//         test("should search subjects by name", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects/search?q=Data")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);
//             expect(response.body.data).toHaveLength(2);
//             expect(
//                 response.body.data.every((s: any) =>
//                     s.name.toLowerCase().includes("data")
//                 )
//             ).toBe(true);
//         });

//         test("should search subjects by code", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects/search?q=CS301")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.data).toHaveLength(1);
//             expect(response.body.data[0].code).toBe("CS301");
//         });

//         test("should return empty results for no matches", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects/search?q=NonExistent")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.data).toHaveLength(0);
//         });
//     });

//     describe("GET /api/v1/subjects/type/:type", () => {
//         beforeEach(async () => {
//             await prisma.subject.createMany({
//                 data: [
//                     {
//                         name: "Mandatory Subject 1",
//                         code: "MAN001",
//                         abbreviation: "M1",
//                         credits: 4,
//                         type: SubjectType.MANDATORY,
//                         semester: 1,
//                         departmentId,
//                     },
//                     {
//                         name: "Mandatory Subject 2",
//                         code: "MAN002",
//                         abbreviation: "M2",
//                         credits: 3,
//                         type: SubjectType.MANDATORY,
//                         semester: 2,
//                         departmentId,
//                     },
//                     {
//                         name: "Elective Subject 1",
//                         code: "ELEC001",
//                         abbreviation: "E1",
//                         credits: 2,
//                         type: SubjectType.ELECTIVE,
//                         semester: 3,
//                         departmentId,
//                     },
//                 ],
//             });
//         });

//         test("should get mandatory subjects only", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects/type/MANDATORY")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);
//             expect(response.body.data).toHaveLength(2);
//             expect(
//                 response.body.data.every(
//                     (s: any) => s.type === SubjectType.MANDATORY
//                 )
//             ).toBe(true);
//         });

//         test("should get elective subjects only", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects/type/ELECTIVE")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.data).toHaveLength(1);
//             expect(response.body.data[0].type).toBe(SubjectType.ELECTIVE);
//         });

//         test("should handle invalid subject type", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects/type/INVALID")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(400);
//             expect(response.body.success).toBe(false);
//         });
//     });

//     describe("GET /api/v1/subjects/:id", () => {
//         beforeEach(async () => {
//             const subject = await prisma.subject.create({
//                 data: {
//                     name: "Test Subject",
//                     code: "TEST001",
//                     abbreviation: "TS",
//                     credits: 3,
//                     type: SubjectType.MANDATORY,
//                     semester: 2,
//                     departmentId,
//                 },
//             });
//             subjectId = subject.id;
//         });

//         test("should get subject by ID", async () => {
//             const response = await request(app)
//                 .get(`/api/v1/subjects/${subjectId}`)
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);
//             expect(response.body.data.id).toBe(subjectId);
//             expect(response.body.data.name).toBe("Test Subject");
//             expect(response.body.data.department).toBeDefined();
//         });

//         test("should return 404 for non-existent subject", async () => {
//             const response = await request(app)
//                 .get("/api/v1/subjects/non-existent-id")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(404);
//             expect(response.body.success).toBe(false);
//         });
//     });

//     describe("PATCH /api/v1/subjects/:id", () => {
//         beforeEach(async () => {
//             const subject = await prisma.subject.create({
//                 data: {
//                     name: "Original Subject",
//                     code: "ORIG001",
//                     abbreviation: "OS",
//                     credits: 3,
//                     type: SubjectType.MANDATORY,
//                     semester: 1,
//                     departmentId,
//                 },
//             });
//             subjectId = subject.id;
//         });

//         test("should update subject", async () => {
//             const updateData = {
//                 name: "Updated Subject",
//                 credits: 4,
//                 type: SubjectType.ELECTIVE,
//             };

//             const response = await request(app)
//                 .patch(`/api/v1/subjects/${subjectId}`)
//                 .set("Authorization", `Bearer ${adminToken}`)
//                 .send(updateData);

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);
//             expect(response.body.data.name).toBe(updateData.name);
//             expect(response.body.data.credits).toBe(updateData.credits);
//             expect(response.body.data.type).toBe(updateData.type);
//         });

//         test("should require admin role for update", async () => {
//             const response = await request(app)
//                 .patch(`/api/v1/subjects/${subjectId}`)
//                 .set("Authorization", `Bearer ${facultyToken}`)
//                 .send({ name: "Unauthorized Update" });

//             expect(response.status).toBe(403);
//             expect(response.body.success).toBe(false);
//         });

//         test("should return 404 for non-existent subject", async () => {
//             const response = await request(app)
//                 .patch("/api/v1/subjects/non-existent-id")
//                 .set("Authorization", `Bearer ${adminToken}`)
//                 .send({ name: "Update Non-existent" });

//             expect(response.status).toBe(404);
//             expect(response.body.success).toBe(false);
//         });
//     });

//     describe("DELETE /api/v1/subjects/:id", () => {
//         beforeEach(async () => {
//             const subject = await prisma.subject.create({
//                 data: {
//                     name: "Subject to Delete",
//                     code: "DEL001",
//                     abbreviation: "STD",
//                     credits: 3,
//                     type: SubjectType.MANDATORY,
//                     semester: 1,
//                     departmentId,
//                 },
//             });
//             subjectId = subject.id;
//         });

//         test("should soft delete subject by default", async () => {
//             const response = await request(app)
//                 .delete(`/api/v1/subjects/${subjectId}`)
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);

//             // Verify soft delete
//             const deletedSubject = await prisma.subject.findUnique({
//                 where: { id: subjectId },
//             });
//             expect(deletedSubject?.deletedAt).not.toBeNull();
//         });

//         test("should hard delete when specified", async () => {
//             const response = await request(app)
//                 .delete(`/api/v1/subjects/${subjectId}?hard=true`)
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(200);
//             expect(response.body.success).toBe(true);

//             // Verify hard delete
//             const deletedSubject = await prisma.subject.findUnique({
//                 where: { id: subjectId },
//             });
//             expect(deletedSubject).toBeNull();
//         });

//         test("should require admin role for deletion", async () => {
//             const response = await request(app)
//                 .delete(`/api/v1/subjects/${subjectId}`)
//                 .set("Authorization", `Bearer ${facultyToken}`);

//             expect(response.status).toBe(403);
//             expect(response.body.success).toBe(false);
//         });

//         test("should return 404 for non-existent subject", async () => {
//             const response = await request(app)
//                 .delete("/api/v1/subjects/non-existent-id")
//                 .set("Authorization", `Bearer ${adminToken}`);

//             expect(response.status).toBe(404);
//             expect(response.body.success).toBe(false);
//         });
//     });
// });
