/**
 * Script to debug attendance upload issue - check which students are enrolled in which courses
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function debugAttendanceUpload() {
  try {
    console.log("🔍 Debugging attendance upload issues...\n");

    // Check the students mentioned in the error
    const errorStudents = [
      "22BECE30091",
      "22BECE30448",
      "22BECE30471",
      "22BECE30478",
      "22S3BECE30009",
    ];

    console.log("📋 Checking students from your Excel file:\n");

    for (const enrollmentNumber of errorStudents) {
      const student = await prisma.student.findUnique({
        where: { enrollmentNumber },
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
                    },
                  },
                  division: true,
                },
              },
            },
          },
        },
      });

      if (!student) {
        console.log(`❌ ${enrollmentNumber}: Student not found in database`);
        continue;
      }

      console.log(`✅ ${enrollmentNumber}: ${student.fullName}`);
      console.log(`   Total Enrollments: ${student.enrollments.length}`);

      if (student.enrollments.length === 0) {
        console.log(`   ⚠️  No course enrollments found`);
      } else {
        student.enrollments.forEach((enrollment, index) => {
          const course = enrollment.course;
          console.log(
            `   ${index + 1}. ${course.subject.name} (${
              course.semester.semesterNumber
            }th sem, ${course.semester.academicYear.year})`
          );
          console.log(`      Faculty: ${course.faculty.fullName}`);
          console.log(`      Division: ${course.division.name}`);
          console.log(`      Course ID: ${course.id}`);
        });
      }
      console.log("");
    }

    // Check all courses with Dharmesh Tank as faculty (likely what you're trying to upload to)
    console.log("🧑‍🏫 Courses taught by Dharmesh Tank:\n");

    const dharmeshCourses = await prisma.course.findMany({
      where: {
        faculty: {
          fullName: "Dharmesh Tank",
        },
      },
      include: {
        subject: true,
        faculty: true,
        semester: {
          include: {
            academicYear: true,
          },
        },
        division: true,
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });

    dharmeshCourses.forEach((course, index) => {
      console.log(
        `${index + 1}. ${course.subject.name} (${
          course.semester.semesterNumber
        }th sem, ${course.semester.academicYear.year})`
      );
      console.log(`   Division: ${course.division.name}`);
      console.log(`   Course ID: ${course.id}`);
      console.log(`   Enrolled Students: ${course.enrollments.length}`);

      if (course.enrollments.length > 0) {
        console.log(`   Students:`);
        course.enrollments.forEach((enrollment, studentIndex) => {
          console.log(
            `     ${studentIndex + 1}. ${
              enrollment.student.enrollmentNumber
            } - ${enrollment.student.fullName}`
          );
        });
      }
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the debug
debugAttendanceUpload();
