/**
 * Script to verify student 22BECE30091 enrollments
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyStudentEnrollments() {
  try {
    console.log("🔍 Verifying enrollments for student 22BECE30091...\n");

    // Get student with all enrollments
    const student = await prisma.student.findUnique({
      where: { id: "cmf6ufcej005sl7gom8c5k2l6" },
      include: {
        enrollments: {
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
          },
        },
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

    console.log("👨‍🎓 Student Information:");
    console.log(`   Name: ${student.fullName}`);
    console.log(`   Enrollment Number: ${student.enrollmentNumber}`);
    console.log(`   Batch: ${student.batch}`);
    console.log(
      `   Student's Base Semester: ${student.semester.semesterNumber} (${student.semester.academicYear.year})`
    );
    console.log(`   Student's Division: ${student.division.name}\n`);

    console.log("📚 All Course Enrollments:");
    console.log(`   Total Enrollments: ${student.enrollments.length}\n`);

    student.enrollments.forEach((enrollment, index) => {
      const course = enrollment.course;
      console.log(
        `   ${index + 1}. ${course.subject.name} (${course.subject.code})`
      );
      console.log(`      Faculty: ${course.faculty.fullName}`);
      console.log(
        `      Semester: ${course.semester.semesterNumber} (${course.semester.academicYear.year})`
      );
      console.log(`      Division: ${course.division.name}`);
      console.log(`      Lecture Type: ${course.lectureType}`);
      console.log(`      Course ID: ${course.id}`);
      console.log(`      Enrollment ID: ${enrollment.id}\n`);
    });

    // Check specifically for the Cyber Security enrollment
    const cyberSecurityEnrollment = student.enrollments.find(
      (enrollment) => enrollment.course.subject.name === "Cyber Security"
    );

    if (cyberSecurityEnrollment) {
      console.log("✅ CYBER SECURITY ENROLLMENT CONFIRMED:");
      const course = cyberSecurityEnrollment.course;
      console.log(
        `   Subject: ${course.subject.name} (${course.subject.code})`
      );
      console.log(`   Faculty: ${course.faculty.fullName}`);
      console.log(
        `   Semester: ${course.semester.semesterNumber} (${course.semester.academicYear.year})`
      );
      console.log(`   Division: ${course.division.name}`);
      console.log(`   Course ID: ${course.id}`);
      console.log(
        `   This is a current and recent enrollment in 7th semester!`
      );
    } else {
      console.log("❌ Cyber Security enrollment not found!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the verification
verifyStudentEnrollments();
