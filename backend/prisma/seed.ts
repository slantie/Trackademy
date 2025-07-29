/**
 * @file prisma/seed.ts
 * @description Seeding script to populate the database with initial data for testing.
 * This script creates a college, academic entities, and the three required user roles.
 * To run: npx ts-node prisma/seed.ts
 */

import { PrismaClient, Role, Designation, SemesterType } from "@prisma/client";
import { hashPassword } from "../src/utils/hash"; // Adjust path if necessary

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting the seeding process...");

    // 1. Clean up existing data in the correct order to avoid constraint violations
    console.log("🧹 Clearing existing data...");
    await prisma.result.deleteMany({});
    await prisma.examSubject.deleteMany({});
    await prisma.exam.deleteMany({});

    // Deleting users will cascade delete students and faculty due to one-to-one relations
    await prisma.student.deleteMany({});
    await prisma.faculty.deleteMany({});
    await prisma.user.deleteMany({});

    await prisma.subject.deleteMany({});
    await prisma.division.deleteMany({});
    await prisma.semester.deleteMany({});
    await prisma.department.deleteMany({});
    await prisma.academicYear.deleteMany({});
    await prisma.college.deleteMany({});
    console.log("✅ Database cleared.");

    // 2. Create core hierarchical data
    console.log("🏢 Creating core institutional data...");

    const college = await prisma.college.create({
        data: {
            name: "LDRP Institute of Technology and Research",
            websiteUrl: "https://ldrp.ac.in/",
        },
    });

    const academicYear = await prisma.academicYear.create({
        data: {
            year: "2025-2026",
            isActive: true,
            collegeId: college.id,
        },
    });

    const department = await prisma.department.create({
        data: {
            name: "Computer Engineering",
            abbreviation: "CE",
            collegeId: college.id,
        },
    });

    const semester = await prisma.semester.create({
        data: {
            semesterNumber: 5,
            semesterType: SemesterType.ODD,
            departmentId: department.id,
            academicYearId: academicYear.id,
        },
    });

    const division = await prisma.division.create({
        data: {
            name: "A",
            semesterId: semester.id,
        },
    });
    console.log("✅ Institutional data created successfully.");

    // 3. Create Users
    console.log("👤 Creating users...");

    // Hash a common password for all dummy users
    const commonPassword = await hashPassword("password123");

    // A. Create Admin User
    const adminUser = await prisma.user.create({
        data: {
            email: "admin_ce@ldrp.ac.in",
            password: commonPassword,
            role: Role.ADMIN,
        },
    });
    console.log(`- Created Admin: ${adminUser.email}`);

    // B. Create Faculty User
    const facultyUser = await prisma.user.create({
        data: {
            email: "faculty_ce@ldrp.ac.in",
            password: commonPassword,
            role: Role.FACULTY,
            faculty: {
                create: {
                    fullName: "Dr. Alex Turing",
                    designation: Designation.ASST_PROFESSOR,
                    departmentId: department.id,
                },
            },
        },
    });
    console.log(`- Created Faculty: ${facultyUser.email}`);

    // C. Create Student User
    const studentUser = await prisma.user.create({
        data: {
            email: "student_ce@ldrp.ac.in",
            password: commonPassword,
            role: Role.STUDENT,
            student: {
                create: {
                    enrollmentNumber: "210280107001",
                    fullName: "Sam Student",
                    batch: "B1",
                    departmentId: department.id,
                    semesterId: semester.id,
                    divisionId: division.id,
                },
            },
        },
    });
    console.log(`- Created Student: ${studentUser.email}`);
    console.log("✅ Users created successfully.");

    console.log("🎉 Seeding finished successfully!");
}

main()
    .catch((e) => {
        console.error("❌ An error occurred during seeding:", e);
        // process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
