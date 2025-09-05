/**
 * Script to enroll missing students in Cyber Security course for attendance testing
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function enrollMissingStudentsInCyberSecurity() {
  try {
    console.log("🎯 Enrolling missing students in Cyber Security course...\n");

    const cyberSecurityCourseId = "cmf76c8u00001l78ot7stv7jq"; // 7th sem Cyber Security with Dharmesh Tank

    // Students to enroll (missing from current enrollment)
    const missingStudents = [
      { enrollmentNumber: "22BECE30448", name: "Harsh Pankajkumar Suthar" },
      { enrollmentNumber: "22BECE30471", name: "Palak Govindbhai Vanpariya" },
      { enrollmentNumber: "22BECE30478", name: "Dhruv Vijaykumar Jain" },
      { enrollmentNumber: "22S3BECE30009", name: "Oum Shyambhai Gadani" },
    ];

    console.log("📚 Students to enroll:");
    missingStudents.forEach((student, index) => {
      console.log(
        `   ${index + 1}. ${student.enrollmentNumber} - ${student.name}`
      );
    });
    console.log("");

    let enrolledCount = 0;
    let skippedCount = 0;

    for (const studentInfo of missingStudents) {
      // Find student in database
      const student = await prisma.student.findUnique({
        where: { enrollmentNumber: studentInfo.enrollmentNumber },
      });

      if (!student) {
        console.log(
          `❌ ${studentInfo.enrollmentNumber}: Student not found in database`
        );
        skippedCount++;
        continue;
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.studentEnrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: student.id,
            courseId: cyberSecurityCourseId,
          },
        },
      });

      if (existingEnrollment) {
        console.log(`⚠️  ${studentInfo.enrollmentNumber}: Already enrolled`);
        skippedCount++;
        continue;
      }

      // Create enrollment
      const enrollment = await prisma.studentEnrollment.create({
        data: {
          studentId: student.id,
          courseId: cyberSecurityCourseId,
        },
      });

      console.log(
        `✅ ${studentInfo.enrollmentNumber}: Enrolled (ID: ${enrollment.id})`
      );
      enrolledCount++;
    }

    console.log(`\n🎉 Enrollment Summary:`);
    console.log(`   ✅ Successfully enrolled: ${enrolledCount} students`);
    console.log(`   ⚠️  Skipped: ${skippedCount} students`);

    // Verify final enrollment count
    const finalEnrollments = await prisma.studentEnrollment.findMany({
      where: { courseId: cyberSecurityCourseId },
      include: { student: true },
    });

    console.log(`\n📋 Final Cyber Security Course Enrollment:`);
    console.log(`   Total Students: ${finalEnrollments.length}`);
    finalEnrollments.forEach((enrollment, index) => {
      console.log(
        `   ${index + 1}. ${enrollment.student.enrollmentNumber} - ${
          enrollment.student.fullName
        }`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the enrollment
enrollMissingStudentsInCyberSecurity();
