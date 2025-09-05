/**
 * Script to enroll student 22BECE30091 in Cyber Security course with Dharmesh Tank
 */

import { PrismaClient, LectureType } from "@prisma/client";

const prisma = new PrismaClient();

async function enrollStudentInCyberSecurity() {
  try {
    console.log("🎯 Starting enrollment for student 22BECE30091...\n");

    // Step 1: Verify the student exists
    const student = await prisma.student.findUnique({
      where: { id: "cmf6ufcej005sl7gom8c5k2l6" },
      include: {
        semester: {
          include: {
            academicYear: true,
            department: true,
          },
        },
        division: true,
      },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    console.log("✅ Student found:");
    console.log(`   Name: ${student.fullName}`);
    console.log(`   Enrollment: ${student.enrollmentNumber}`);
    console.log(`   Semester: ${student.semester.semesterNumber}`);
    console.log(`   Department: ${student.semester.department.name}`);
    console.log(`   Division: ${student.division.name}`);
    console.log(`   Batch: ${student.batch}\n`);

    // Step 2: Verify the faculty exists
    const faculty = await prisma.faculty.findUnique({
      where: { id: "cmf6ufc7t005pl7goldk4dq60" },
    });

    if (!faculty) {
      throw new Error("Faculty not found");
    }

    console.log("✅ Faculty found:");
    console.log(`   Name: ${faculty.fullName}`);
    console.log(`   Department: ${faculty.departmentId}\n`);

    // Step 3: Verify the subject exists
    const subject = await prisma.subject.findUnique({
      where: { id: "cmf6uf5l10030l7govydn2yiz" },
    });

    if (!subject) {
      throw new Error("Subject not found");
    }

    console.log("✅ Subject found:");
    console.log(`   Name: ${subject.name}`);
    console.log(`   Code: ${subject.code}`);
    console.log(`   Semester: ${subject.semesterNumber}\n`);

    // Step 4: Check if there's an existing course for this combination
    let course = await prisma.course.findFirst({
      where: {
        semesterId: student.semesterId,
        divisionId: student.divisionId,
        subjectId: subject.id,
        facultyId: faculty.id,
        lectureType: LectureType.THEORY, // Default to theory
      },
    });

    if (!course) {
      console.log("📝 Creating new course...");

      // Create the course
      course = await prisma.course.create({
        data: {
          semesterId: student.semesterId,
          divisionId: student.divisionId,
          subjectId: subject.id,
          facultyId: faculty.id,
          lectureType: LectureType.THEORY,
          batch: null, // Theory courses don't have specific batches
        },
      });

      console.log(`✅ Course created with ID: ${course.id}\n`);
    } else {
      console.log(`✅ Existing course found with ID: ${course.id}\n`);
    }

    // Step 5: Check if student is already enrolled
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

    // Step 6: Enroll the student
    console.log("📚 Enrolling student in course...");

    const enrollment = await prisma.studentEnrollment.create({
      data: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    console.log(`✅ Enrollment created with ID: ${enrollment.id}\n`);

    // Step 7: Verify the enrollment
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
    console.log("📋 Enrollment Details:");
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
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the enrollment
enrollStudentInCyberSecurity();
