import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createQuickAttendanceEnrollments() {
  try {
    console.log("🎯 Creating quick enrollments for attendance testing...\n");

    // Get first 5 students
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

    console.log(`📚 Found ${students.length} students:`);
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.fullName} (${student.user.email})`);
    });
    console.log("");

    // Get a few courses from different semesters (excluding 6th semester)
    const courses = await prisma.course.findMany({
      where: {
        semester: {
          semesterNumber: {
            in: [1, 2, 3, 4, 5, 7, 8], // All semesters except 6th
          },
        },
      },
      include: {
        subject: true,
        division: true,
        semester: true,
        faculty: true,
      },
      take: 10, // Just take 10 courses for quick testing
    });

    console.log(`📖 Found ${courses.length} courses for enrollment:`);
    courses.forEach((course, index) => {
      console.log(
        `${index + 1}. ${course.subject.name} - Sem ${
          course.semester.semesterNumber
        } (${course.division.name})`
      );
      console.log(`   Faculty: ${course.faculty.fullName}`);
      console.log(`   Course ID: ${course.id}`);
    });
    console.log("");

    // Create enrollments - each student in first 3 courses
    console.log("🔄 Creating enrollments...\n");
    let enrollmentCount = 0;

    for (const student of students) {
      for (let i = 0; i < Math.min(3, courses.length); i++) {
        const course = courses[i];

        try {
          // Check if already enrolled
          const existing = await prisma.studentEnrollment.findUnique({
            where: {
              studentId_courseId: {
                studentId: student.id,
                courseId: course.id,
              },
            },
          });

          if (existing) {
            console.log(
              `   ⚠️  ${student.fullName} already enrolled in ${course.subject.name}`
            );
            continue;
          }

          // Create enrollment
          await prisma.studentEnrollment.create({
            data: {
              studentId: student.id,
              courseId: course.id,
            },
          });

          enrollmentCount++;
          console.log(
            `   ✅ Enrolled ${student.fullName} in ${course.subject.name} (Sem ${course.semester.semesterNumber})`
          );
        } catch (error) {
          console.error(`   ❌ Failed to enroll ${student.fullName}:`, error);
        }
      }
      console.log("");
    }

    console.log(`📋 SUMMARY: Created ${enrollmentCount} enrollments\n`);

    // Show ready courses
    const readyCourses = await prisma.course.findMany({
      where: {
        id: {
          in: courses.slice(0, 3).map((c) => c.id),
        },
      },
      include: {
        subject: true,
        division: true,
        semester: true,
        faculty: true,
        enrollments: {
          include: {
            student: true,
          },
        },
      },
    });

    console.log("🧪 READY FOR TESTING:");
    readyCourses.forEach((course, index) => {
      console.log(
        `\n${index + 1}. ${course.subject.name} - Sem ${
          course.semester.semesterNumber
        }`
      );
      console.log(`   Faculty: ${course.faculty.fullName}`);
      console.log(`   Division: ${course.division.name}`);
      console.log(`   Course ID: ${course.id}`);
      console.log(`   Students enrolled: ${course.enrollments.length}`);

      course.enrollments.forEach((enrollment, i) => {
        console.log(`     ${i + 1}. ${enrollment.student.fullName}`);
      });
    });

    if (readyCourses.length > 0) {
      console.log(`\n🎯 QUICK TEST STEPS:`);
      console.log(`1. Login as faculty: ${readyCourses[0].faculty.fullName}`);
      console.log(`2. Go to /faculty/attendance`);
      console.log(`3. Select: ${readyCourses[0].subject.name}`);
      console.log(`4. Pick today's date`);
      console.log(`5. Click "Mark Attendance"`);
      console.log(`6. Test the attendance functionality!`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createQuickAttendanceEnrollments();
