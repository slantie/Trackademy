/**
 * @file src/tests/helpers/testSetup.ts
 * @description Centralized test setup and cleanup utilities for consistent test isolation
 */

import { prisma } from "../../config/prisma.service";
import { hashPassword } from "../../utils/hash";

/**
 * Completely clean the database and reseed admin user
 * This ensures a fresh state for each test file
 */
export async function cleanDatabaseAndSeedAdmin(): Promise<void> {
  try {
    // Delete all data in the correct order (children first, then parents)
    // 1. Delete submissions and assignments first
    await prisma.submission.deleteMany({});
    await prisma.assignment.deleteMany({});

    // 2. Delete attendance and exam results
    await prisma.attendance.deleteMany({});
    await prisma.examResult.deleteMany({});

    // 3. Delete student enrollments
    await prisma.studentEnrollment.deleteMany({});

    // 4. Delete courses
    await prisma.course.deleteMany({});

    // 5. Delete students and faculty (they reference users)
    await prisma.student.deleteMany({});
    await prisma.faculty.deleteMany({});

    // 6. Delete exams
    await prisma.exam.deleteMany({});

    // 7. Delete divisions, subjects, semesters
    await prisma.division.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.semester.deleteMany({});

    // 8. Delete academic years
    await prisma.academicYear.deleteMany({});

    // 9. Delete departments
    await prisma.department.deleteMany({});

    // 10. Delete colleges
    await prisma.college.deleteMany({});

    // 11. Delete all users (this will be recreated with admin)
    await prisma.user.deleteMany({});

    // 12. Create fresh admin user
    const hashedPassword = await hashPassword("password123");
    await prisma.user.create({
      data: {
        email: "admin_ce@ldrp.ac.in",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✅ Database cleaned and admin user seeded for test");
  } catch (error) {
    console.error("❌ Error in cleanDatabaseAndSeedAdmin:", error);
    throw error;
  }
}

/**
 * Lightweight cleanup for tests that only create specific entities
 * Use this for tests that don't interfere with each other
 */
export async function cleanupTestData(options: {
  colleges?: string[];
  departments?: string[];
  subjects?: string[];
  users?: string[];
}): Promise<void> {
  try {
    // Clean up in proper dependency order (children first, then parents)

    // Clean up assignments and submissions first
    if (options.subjects?.length) {
      await prisma.assignment.deleteMany({
        where: { course: { subject: { name: { in: options.subjects } } } },
      });
      await prisma.submission.deleteMany({
        where: {
          assignment: {
            course: { subject: { name: { in: options.subjects } } },
          },
        },
      });
    }

    // Clean up courses
    if (options.subjects?.length) {
      await prisma.course.deleteMany({
        where: { subject: { name: { in: options.subjects } } },
      });
    }

    // Clean up students and faculty
    if (options.users?.length) {
      await prisma.student.deleteMany({
        where: { user: { email: { in: options.users } } },
      });
      await prisma.faculty.deleteMany({
        where: { user: { email: { in: options.users } } },
      });
    }

    // Clean up subjects
    if (options.subjects?.length) {
      await prisma.subject.deleteMany({
        where: { name: { in: options.subjects } },
      });
    }

    // Clean up all related entities for departments first
    if (options.departments?.length || options.colleges?.length) {
      // Clean up all dependent entities that might be related to these colleges/departments
      await prisma.division.deleteMany({
        where: {
          OR: [
            options.departments?.length
              ? {
                  semester: {
                    department: { name: { in: options.departments } },
                  },
                }
              : {},
            options.colleges?.length
              ? {
                  semester: {
                    department: { college: { name: { in: options.colleges } } },
                  },
                }
              : {},
          ],
        },
      });

      await prisma.semester.deleteMany({
        where: {
          OR: [
            options.departments?.length
              ? { department: { name: { in: options.departments } } }
              : {},
            options.colleges?.length
              ? { department: { college: { name: { in: options.colleges } } } }
              : {},
          ],
        },
      });

      await prisma.academicYear.deleteMany({
        where: options.colleges?.length
          ? { college: { name: { in: options.colleges } } }
          : {},
      });
    }

    // Clean up departments BEFORE colleges
    if (options.departments?.length) {
      await prisma.department.deleteMany({
        where: { name: { in: options.departments } },
      });
    }

    // Clean up colleges LAST (after all dependencies are gone)
    if (options.colleges?.length) {
      await prisma.college.deleteMany({
        where: { name: { in: options.colleges } },
      });
    }

    // Clean up test users
    if (options.users?.length) {
      await prisma.user.deleteMany({
        where: {
          email: { in: options.users },
          role: { not: "ADMIN" }, // Never delete admin user
        },
      });
    }
  } catch (error) {
    // Log the error but don't throw - tests already passed
    console.warn(
      "⚠️ Warning in cleanupTestData (tests still passed):",
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Get admin token for authentication in tests
 */
export async function getAdminToken(request: any, app: any): Promise<string> {
  const loginResponse = await request(app).post("/api/v1/auth/login").send({
    identifier: "admin_ce@ldrp.ac.in",
    password: "password123",
  });

  if (loginResponse.status !== 200) {
    throw new Error(
      `Admin login failed: ${loginResponse.status} - ${JSON.stringify(
        loginResponse.body
      )}`
    );
  }

  return loginResponse.body.token;
}

/**
 * Create a basic test college for tests that need one
 */
export async function createTestCollege(
  name: string = "Test College"
): Promise<any> {
  return await prisma.college.create({
    data: {
      name,
      abbreviation: name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
    },
  });
}

/**
 * Create a basic test department for tests that need one
 */
export async function createTestDepartment(
  collegeName: string = "Test College",
  departmentName: string = "Test Department"
): Promise<any> {
  const college = await createTestCollege(collegeName);

  return await prisma.department.create({
    data: {
      name: departmentName,
      abbreviation: departmentName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
      collegeId: college.id,
    },
  });
}
