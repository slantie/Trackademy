/**
 * @file src/tests/subject.test.ts
 * @description Comprehensive integration tests for the Subject CRUD API endpoints.
 */

import request from "supertest";
import app from "../app";
import { SubjectType } from "@prisma/client";
import {
  cleanDatabaseAndSeedAdmin,
  getAdminToken,
  createTestDepartment,
  cleanupTestData,
} from "./helpers/testSetup";

describe("Subject API Endpoints", () => {
  let adminToken: string;
  let testDepartment: any;
  let newSubjectId: string;
  const TEST_COLLEGE_NAME = "Subject Test College";
  const TEST_DEPARTMENT_NAME = "Subject Test Department";

  beforeAll(async () => {
    // Clean database and seed admin user for fresh start
    await cleanDatabaseAndSeedAdmin();

    // Get admin token
    adminToken = await getAdminToken(request, app);

    // Create test department (which also creates test college)
    testDepartment = await createTestDepartment(
      TEST_COLLEGE_NAME,
      TEST_DEPARTMENT_NAME
    );
  });

  it("should create a new subject", async () => {
    const response = await request(app)
      .post("/api/v1/subjects")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Data Structures",
        abbreviation: "DS",
        code: "CS201",
        type: SubjectType.MANDATORY,
        semesterNumber: 3,
        departmentId: testDepartment.id,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.data.subject.name).toBe("Data Structures");
    newSubjectId = response.body.data.subject.id;
  });

  it("should get all subjects for the department", async () => {
    const response = await request(app)
      .get(`/api/v1/subjects?departmentId=${testDepartment.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBe(1);
    expect(response.body.data.subjects[0].name).toBe("Data Structures");
  });

  it("should update the subject", async () => {
    const response = await request(app)
      .patch(`/api/v1/subjects/${newSubjectId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Advanced Data Structures",
        type: SubjectType.ELECTIVE,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.subject.name).toBe("Advanced Data Structures");
    expect(response.body.data.subject.type).toBe(SubjectType.ELECTIVE);
  });

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

  afterAll(async () => {
    // Clean up test data created during this test suite
    await cleanupTestData({
      colleges: [TEST_COLLEGE_NAME],
      departments: [TEST_DEPARTMENT_NAME],
      subjects: ["Data Structures", "Advanced Data Structures"],
    });
  });
});
