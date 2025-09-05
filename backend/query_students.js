import { prisma } from "./src/config/prisma.service.js";

async function findStudentsForCourse() {
  try {
    const courseId = "cmf6vuyrj01byl7xs7lnbjio8";

    // First, let's verify the course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        subject: true,
        faculty: { select: { fullName: true } },
        division: true,
        semester: true,
      },
    });

    if (!course) {
      console.log("Course not found");
      return;
    }

    console.log("Course Details:");
    console.log(`- Subject: ${course.subject.name}`);
    console.log(`- Faculty: ${course.faculty.fullName}`);
    console.log(`- Division: ${course.division.name}`);
    console.log(`- Semester: ${course.semester.number}`);
    console.log("");

    // Find all enrollments for this course
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId: courseId,
        isDeleted: false,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    console.log(
      `Found ${enrollments.length} students enrolled in this course:`
    );
    console.log("");

    enrollments.forEach((enrollment, index) => {
      const student = enrollment.student;
      const user = student.user;
      console.log(`${index + 1}. Student ID: ${student.id}`);
      console.log(`   User ID: ${student.userId}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Enrollment ID: ${enrollment.id}`);
      console.log("");
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

findStudentsForCourse();
