/**
 * Script to check current semester setup and enroll student in 7th semester Cyber Security
 */

import { PrismaClient, LectureType } from "@prisma/client";

const prisma = new PrismaClient();

async function enrollStudentInCurrent7thSemester() {
  try {
    console.log("🔍 Checking available 7th semester setups...\n");

    // Step 1: Find current/recent 7th semester instances
    const seventhSemesters = await prisma.semester.findMany({
      where: {
        semesterNumber: 7,
      },
      include: {
        academicYear: true,
        department: true,
      },
      orderBy: {
        academicYear: {
          year: "desc",
        },
      },
    });

    console.log("📚 Available 7th Semester instances:");
    seventhSemesters.forEach((sem, index) => {
      console.log(
        `   ${index + 1}. ${sem.department.name} - ${
          sem.academicYear.year
        } (Active: ${sem.academicYear.isActive})`
      );
      console.log(`      Semester ID: ${sem.id}`);
    });

    if (seventhSemesters.length === 0) {
      throw new Error("No 7th semester found");
    }

    // Use the most recent 7th semester (first in the ordered list)
    const targetSemester = seventhSemesters[0];
    console.log(
      `\n🎯 Using: ${targetSemester.department.name} 7th Semester ${targetSemester.academicYear.year}\n`
    );

    // Step 2: Check available divisions for this semester
    const divisions = await prisma.division.findMany({
      where: {
        semesterId: targetSemester.id,
      },
    });

    console.log("📝 Available divisions:");
    divisions.forEach((div, index) => {
      console.log(`   ${index + 1}. ${div.name} (ID: ${div.id})`);
    });

    // Use first available division
    const targetDivision = divisions[0];
    if (!targetDivision) {
      throw new Error("No divisions found for this department");
    }

    console.log(`\n🎯 Using Division: ${targetDivision.name}\n`);

    // Step 3: Get student details
    const student = await prisma.student.findUnique({
      where: { id: "cmf6ufcej005sl7gom8c5k2l6" },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // Step 4: Get faculty details
    const faculty = await prisma.faculty.findUnique({
      where: { id: "cmf6ufc7t005pl7goldk4dq60" },
    });

    if (!faculty) {
      throw new Error("Faculty not found");
    }

    // Step 5: Get subject details
    const subject = await prisma.subject.findUnique({
      where: { id: "cmf6uf5l10030l7govydn2yiz" },
    });

    if (!subject) {
      throw new Error("Subject not found");
    }

    console.log("✅ Enrollment Details:");
    console.log(
      `   Student: ${student.fullName} (${student.enrollmentNumber})`
    );
    console.log(`   Subject: ${subject.name} (${subject.code})`);
    console.log(`   Faculty: ${faculty.fullName}`);
    console.log(
      `   Target Semester: ${targetSemester.semesterNumber} (${targetSemester.academicYear.year})`
    );
    console.log(`   Target Division: ${targetDivision.name}\n`);

    // Step 6: Check if course exists, create if not
    let course = await prisma.course.findFirst({
      where: {
        semesterId: targetSemester.id,
        divisionId: targetDivision.id,
        subjectId: subject.id,
        facultyId: faculty.id,
        lectureType: LectureType.THEORY,
      },
    });

    if (!course) {
      console.log("📝 Creating new course...");

      course = await prisma.course.create({
        data: {
          semesterId: targetSemester.id,
          divisionId: targetDivision.id,
          subjectId: subject.id,
          facultyId: faculty.id,
          lectureType: LectureType.THEORY,
          batch: null,
        },
      });

      console.log(`✅ Course created with ID: ${course.id}\n`);
    } else {
      console.log(`✅ Existing course found with ID: ${course.id}\n`);
    }

    // Step 7: Check if already enrolled
    const existingEnrollment = await prisma.studentEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      console.log("⚠️  Student is already enrolled in this course!");
      return;
    }

    // Step 8: Create enrollment
    console.log("📚 Creating enrollment...");

    const enrollment = await prisma.studentEnrollment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    console.log(`✅ Enrollment created with ID: ${enrollment.id}\n`);

    // Step 9: Verify enrollment
    const verifyEnrollment = await prisma.studentEnrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId: course.id,
        },
      },
      include: {
        course: {
          include: {
            subject: true,
            faculty: true,
            semester: {
              include: {
                academicYear: true,
                department: true,
              },
            },
            division: true,
          },
        },
        student: true,
      },
    });

    console.log("🎉 ENROLLMENT SUCCESSFUL!");
    console.log("📋 Final Enrollment Details:");
    console.log(
      `   Student: ${verifyEnrollment?.student.fullName} (${verifyEnrollment?.student.enrollmentNumber})`
    );
    console.log(
      `   Subject: ${verifyEnrollment?.course.subject.name} (${verifyEnrollment?.course.subject.code})`
    );
    console.log(`   Faculty: ${verifyEnrollment?.course.faculty.fullName}`);
    console.log(
      `   Semester: ${verifyEnrollment?.course.semester.semesterNumber}`
    );
    console.log(`   Division: ${verifyEnrollment?.course.division.name}`);
    console.log(`   Lecture Type: ${verifyEnrollment?.course.lectureType}`);
    console.log(
      `   Academic Year: ${verifyEnrollment?.course.semester.academicYear.year}`
    );
    console.log(`   Course ID: ${verifyEnrollment?.course.id}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the enrollment
enrollStudentInCurrent7thSemester();
