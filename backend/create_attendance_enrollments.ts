import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAttendanceEnrollments() {
  try {
    console.log("🎯 Creating enrollments for attendance testing...\n");

    // Get all students (they are from 6th semester)
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

    if (students.length === 0) {
      console.log("❌ No students found in database");
      return;
    }

    console.log(`📚 Found ${students.length} students:`);
    students.forEach((student, index) => {
      console.log(`${index + 1}. ${student.fullName} (${student.user.email})`);
    });
    console.log("");

    // Get courses from different semesters
    const courses = await prisma.course.findMany({
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
      },
      orderBy: [
        { semester: { semesterNumber: "asc" } },
        { subject: { name: "asc" } },
      ],
    });

    if (courses.length === 0) {
      console.log("❌ No courses found in database");
      return;
    }

    console.log(
      `📖 Found ${courses.length} courses across different semesters:`
    );
    courses.forEach((course, index) => {
      console.log(
        `${index + 1}. ${course.subject.name} (${course.subject.code}) - Sem ${
          course.semester.semesterNumber
        }`
      );
      console.log(`   Division: ${course.division.name}`);
      console.log(`   Faculty: ${course.faculty.fullName}`);
      console.log(`   Course ID: ${course.id}`);
      console.log("");
    });

    // Create strategic enrollments
    console.log(
      "🔄 Creating strategic enrollments for attendance testing...\n"
    );

    let enrollmentCount = 0;
    const enrollmentResults: any[] = [];

    // Enroll students in courses from different semesters (not just 6th)
    for (const student of students) {
      // Enroll each student in 2-3 courses from different semesters
      const selectedCourses = courses
        .filter(
          (course) => course.semester.semesterNumber !== 6 // Avoid their original semester
        )
        .slice(0, 3); // Take first 3 courses

      for (const course of selectedCourses) {
        try {
          // Check if already enrolled
          const existingEnrollment = await prisma.studentEnrollment.findUnique({
            where: {
              studentId_courseId: {
                studentId: student.id,
                courseId: course.id,
              },
            },
          });

          if (existingEnrollment) {
            console.log(
              `   ⚠️  ${student.fullName} already enrolled in ${course.subject.name}`
            );
            continue;
          }

          // Create enrollment
          const enrollment = await prisma.studentEnrollment.create({
            data: {
              studentId: student.id,
              courseId: course.id,
            },
          });

          enrollmentCount++;
          enrollmentResults.push({
            studentName: student.fullName,
            studentEmail: student.user.email,
            studentId: student.id,
            courseName: course.subject.name,
            courseCode: course.subject.code,
            courseId: course.id,
            semester: course.semester.semesterNumber,
            division: course.division.name,
            faculty: course.faculty.fullName,
            enrollmentId: enrollment.id,
          });

          console.log(
            `   ✅ Enrolled ${student.fullName} in ${course.subject.name} (Sem ${course.semester.semesterNumber})`
          );
        } catch (error) {
          console.error(
            `   ❌ Failed to enroll ${student.fullName} in ${course.subject.name}:`,
            error
          );
        }
      }
      console.log("");
    }

    // Summary for attendance testing
    console.log("📋 ATTENDANCE TESTING SUMMARY");
    console.log("=".repeat(50));
    console.log(`Total enrollments created: ${enrollmentCount}`);
    console.log("");

    // Group by semester for easy testing
    const bySemester = enrollmentResults.reduce((acc: any, enrollment: any) => {
      const sem = enrollment.semester;
      if (!acc[sem]) acc[sem] = [];
      acc[sem].push(enrollment);
      return acc;
    }, {});

    Object.keys(bySemester)
      .sort()
      .forEach((semester) => {
        console.log(`📚 SEMESTER ${semester} COURSES:`);
        const semesterEnrollments = bySemester[semester];

        // Group by course
        const byCourse = semesterEnrollments.reduce(
          (acc: any, enrollment: any) => {
            const courseKey = `${enrollment.courseName} (${enrollment.division})`;
            if (!acc[courseKey])
              acc[courseKey] = {
                courseInfo: enrollment,
                students: [],
              };
            acc[courseKey].students.push(enrollment);
            return acc;
          },
          {}
        );

        Object.keys(byCourse).forEach((courseKey) => {
          const courseData = byCourse[courseKey];
          console.log(`\n   📖 ${courseKey}`);
          console.log(`      Course ID: ${courseData.courseInfo.courseId}`);
          console.log(`      Faculty: ${courseData.courseInfo.faculty}`);
          console.log(
            `      Students enrolled (${courseData.students.length}):`
          );

          courseData.students.forEach((student: any, index: number) => {
            console.log(
              `         ${index + 1}. ${student.studentName} (${
                student.studentEmail
              })`
            );
            console.log(`            Student ID: ${student.studentId}`);
          });
        });
        console.log("");
      });

    // Quick test recommendations
    console.log("🧪 QUICK TESTING RECOMMENDATIONS:");
    console.log("=".repeat(50));
    console.log("1. Login as a faculty member");
    console.log("2. Go to /faculty/attendance");
    console.log("3. Select any of the courses above");
    console.log("4. Pick today's date or any recent date");
    console.log("5. Use 'Mark Attendance' to test manual entry");
    console.log("6. Test Excel upload functionality");
    console.log("");

    if (enrollmentResults.length > 0) {
      const firstCourse = enrollmentResults[0];
      console.log("🎯 QUICK START EXAMPLE:");
      console.log(
        `   Course: ${firstCourse.courseName} (${firstCourse.courseCode})`
      );
      console.log(`   Course ID: ${firstCourse.courseId}`);
      console.log(`   Faculty: ${firstCourse.faculty}`);
      console.log(
        `   Students: ${
          bySemester[firstCourse.semester].filter(
            (e: any) => e.courseId === firstCourse.courseId
          ).length
        } enrolled`
      );
      console.log("");
    }

    console.log("✅ Attendance enrollments created successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAttendanceEnrollments();
