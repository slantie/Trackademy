import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createTestEnrollments() {
  try {
    const courseId = "cmf6vuyrj01byl7xs7lnbjio8";

    // Get the first 3 students to enroll in this course
    const students = await prisma.student.findMany({
      take: 3,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (students.length === 0) {
      console.log("No students found to enroll");
      return;
    }

    console.log(`Found ${students.length} students to enroll:`);

    for (const student of students) {
      try {
        // Check if already enrolled
        const existingEnrollment = await prisma.studentEnrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: student.id,
              courseId: courseId,
            },
          },
        });

        if (existingEnrollment) {
          console.log(`${student.fullName} is already enrolled`);
          continue;
        }

        // Create enrollment
        const enrollment = await prisma.studentEnrollment.create({
          data: {
            studentId: student.id,
            courseId: courseId,
          },
        });

        console.log(`✅ Enrolled ${student.fullName} (${student.user.email})`);
        console.log(`   Student ID: ${student.id}`);
        console.log(`   User ID: ${student.userId}`);
        console.log(`   Enrollment ID: ${enrollment.id}`);
        console.log("");
      } catch (error) {
        console.error(`Failed to enroll ${student.fullName}:`, error);
      }
    }

    // Verify enrollments
    console.log("\n=== VERIFICATION ===");
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        courseId: courseId,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    console.log(`Total enrollments for this course: ${enrollments.length}`);
    enrollments.forEach((enrollment, index) => {
      console.log(
        `${index + 1}. ${enrollment.student.fullName} (${
          enrollment.student.user.email
        })`
      );
      console.log(`   Student ID: ${enrollment.student.id}`);
      console.log(`   User ID: ${enrollment.student.userId}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestEnrollments();
