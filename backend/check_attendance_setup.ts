import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAttendanceSetup() {
  try {
    console.log("🔍 ATTENDANCE SETUP VERIFICATION");
    console.log("=".repeat(50));

    // Check students
    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
    });

    console.log(`📚 STUDENTS (${students.length} total):`);
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.fullName}`);
      console.log(`   Email: ${student.user.email}`);
      console.log(`   ID: ${student.id}`);
      console.log(`   Enrollment: ${student.enrollmentNumber}`);
    });
    console.log("");

    // Check faculty
    const faculty = await prisma.faculty.findMany({
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
    });

    console.log(`👨‍🏫 FACULTY (${faculty.length} total):`);
    faculty.forEach((fac, index) => {
      console.log(`${index + 1}. ${fac.fullName}`);
      console.log(`   Email: ${fac.user.email}`);
      console.log(`   ID: ${fac.id}`);
    });
    console.log("");

    // Check courses with enrollments
    const coursesWithEnrollments = await prisma.course.findMany({
      include: {
        subject: {
          select: {
            name: true,
            code: true,
          },
        },
        division: {
          select: {
            name: true,
          },
        },
        semester: {
          select: {
            semesterNumber: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
        faculty: {
          select: {
            fullName: true,
          },
        },
        enrollments: {
          include: {
            student: {
              select: {
                fullName: true,
                enrollmentNumber: true,
              },
            },
          },
        },
      },
      orderBy: [
        { semester: { semesterNumber: "asc" } },
        { subject: { name: "asc" } },
      ],
    });

    console.log(`📖 COURSES WITH ENROLLMENTS:`);
    let totalEnrollments = 0;

    coursesWithEnrollments.forEach((course, index) => {
      const enrollmentCount = course.enrollments.length;
      totalEnrollments += enrollmentCount;

      console.log(
        `\n${index + 1}. ${course.subject.name} (${course.subject.code})`
      );
      console.log(`   Semester: ${course.semester.semesterNumber}`);
      console.log(`   Division: ${course.division.name}`);
      console.log(`   Faculty: ${course.faculty.fullName}`);
      console.log(`   Course ID: ${course.id}`);
      console.log(`   Students enrolled: ${enrollmentCount}`);

      if (enrollmentCount > 0) {
        console.log(`   Students:`);
        course.enrollments.forEach((enrollment, i) => {
          console.log(
            `     ${i + 1}. ${enrollment.student.fullName} (${
              enrollment.student.enrollmentNumber
            })`
          );
        });
      }
    });

    console.log(`\n📊 SUMMARY:`);
    console.log(`Total students: ${students.length}`);
    console.log(`Total faculty: ${faculty.length}`);
    console.log(`Total courses: ${coursesWithEnrollments.length}`);
    console.log(`Total enrollments: ${totalEnrollments}`);

    // Check if any courses have students for attendance testing
    const coursesReadyForAttendance = coursesWithEnrollments.filter(
      (course) => course.enrollments.length > 0
    );

    console.log(
      `\n🎯 COURSES READY FOR ATTENDANCE TESTING (${coursesReadyForAttendance.length}):`
    );

    if (coursesReadyForAttendance.length === 0) {
      console.log("❌ No courses have enrolled students!");
      console.log(
        "💡 Run the enrollment script: npm run ts-node create_attendance_enrollments.ts"
      );
    } else {
      coursesReadyForAttendance.forEach((course, index) => {
        console.log(
          `\n${index + 1}. ✅ ${course.subject.name} - Sem ${
            course.semester.semesterNumber
          }`
        );
        console.log(`   Faculty: ${course.faculty.fullName}`);
        console.log(`   Students: ${course.enrollments.length}`);
        console.log(`   Course ID: ${course.id}`);
      });

      console.log(`\n🧪 TESTING INSTRUCTIONS:`);
      console.log(
        `1. Login as faculty: ${coursesReadyForAttendance[0].faculty.fullName}`
      );
      console.log(`2. Navigate to /faculty/attendance`);
      console.log(
        `3. Select course: ${coursesReadyForAttendance[0].subject.name}`
      );
      console.log(`4. Pick any date and mark attendance`);
    }

    // Check existing attendance records
    const existingAttendance = await prisma.attendance.findMany({
      include: {
        student: {
          select: {
            fullName: true,
          },
        },
        course: {
          include: {
            subject: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 10,
    });

    if (existingAttendance.length > 0) {
      console.log(
        `\n📋 RECENT ATTENDANCE RECORDS (${existingAttendance.length}):`
      );
      existingAttendance.forEach((record, index) => {
        console.log(
          `${index + 1}. ${record.student.fullName} - ${
            record.course.subject.name
          }`
        );
        console.log(`   Date: ${record.date.toDateString()}`);
        console.log(`   Status: ${record.status}`);
      });
    } else {
      console.log(`\n📋 No attendance records found yet.`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAttendanceSetup();
