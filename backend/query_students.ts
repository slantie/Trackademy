import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findStudentsAndCourses() {
  try {
    console.log("=== CHECKING STUDENTS IN DATABASE ===");

    // First, let's see how many students exist
    const studentCount = await prisma.student.count();
    console.log(`Total students in database: ${studentCount}`);

    if (studentCount > 0) {
      const students = await prisma.student.findMany({
        take: 5,
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      console.log("\nFirst 5 students:");
      students.forEach((student, index) => {
        console.log(
          `${index + 1}. ${student.fullName} (${student.user.email})`
        );
      });
    }

    console.log("\n=== CHECKING ENROLLMENTS ===");
    const enrollmentCount = await prisma.studentEnrollment.count();
    console.log(`Total enrollments: ${enrollmentCount}`);

    if (enrollmentCount > 0) {
      const enrollmentsWithCourses = await prisma.studentEnrollment.findMany({
        take: 10,
        include: {
          student: {
            select: {
              fullName: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          course: {
            include: {
              subject: true,
              faculty: { select: { fullName: true } },
              division: true,
              semester: true,
            },
          },
        },
      });

      console.log("\nFirst 10 enrollments:");
      enrollmentsWithCourses.forEach((enrollment, index) => {
        console.log(`${index + 1}. Student: ${enrollment.student.fullName}`);
        console.log(`   Course: ${enrollment.course.subject.name}`);
        console.log(`   Faculty: ${enrollment.course.faculty.fullName}`);
        console.log(`   Division: ${enrollment.course.division.name}`);
        console.log(`   Course ID: ${enrollment.courseId}`);
        console.log("");
      });
    }

    console.log("\n=== SPECIFIC COURSE CHECK ===");
    const courseId = "cmf6vuyrj01byl7xs7lnbjio8";

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        subject: true,
        faculty: { select: { fullName: true } },
        division: true,
        semester: true,
      },
    });

    if (course) {
      console.log("Course Details:");
      console.log(`- Subject: ${course.subject.name}`);
      console.log(`- Faculty: ${course.faculty.fullName}`);
      console.log(`- Division: ${course.division.name}`);
      console.log(`- Semester: ${course.semester?.semesterNumber || "N/A"}`);
      console.log(`- Course ID: ${course.id}`);
    } else {
      console.log("Course not found!");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

findStudentsAndCourses();
