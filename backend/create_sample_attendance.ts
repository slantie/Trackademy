/**
 * Script to create sample attendance data for testing the StudentAttendanceWidget
 */

import { PrismaClient, AttendanceStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function createSampleAttendanceData() {
  try {
    console.log("📚 Creating sample attendance data for testing...\n");

    // Student ID for 22BECE30091 (Kandarp)
    const studentId = "cmf6ufcej005sl7gom8c5k2l6";

    // Get student's enrollments to create attendance for
    const enrollments = await prisma.studentEnrollment.findMany({
      where: { studentId },
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
          },
        },
      },
    });

    console.log(
      `📋 Found ${enrollments.length} enrollments for student 22BECE30091\n`
    );

    // Create attendance data for the last 10 days
    const dates: Date[] = [];
    for (let i = 9; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    let totalCreated = 0;

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      console.log(
        `📝 Creating attendance for: ${course.subject.name} (${course.semester.semesterNumber}th sem)`
      );

      // Create attendance for some random dates (simulate partial attendance)
      const attendanceToCreate: {
        studentId: string;
        courseId: string;
        date: Date;
        status: AttendanceStatus;
      }[] = [];

      dates.forEach((date, index) => {
        // Create attendance for 70% of dates (simulating some missed classes)
        if (Math.random() > 0.3) {
          // 85% chance of being present
          const status =
            Math.random() > 0.15
              ? AttendanceStatus.PRESENT
              : AttendanceStatus.ABSENT;

          attendanceToCreate.push({
            studentId,
            courseId: course.id,
            date,
            status,
          });
        }
      });

      if (attendanceToCreate.length > 0) {
        await prisma.attendance.createMany({
          data: attendanceToCreate,
          skipDuplicates: true,
        });

        const presentCount = attendanceToCreate.filter(
          (a) => a.status === AttendanceStatus.PRESENT
        ).length;
        const absentCount = attendanceToCreate.filter(
          (a) => a.status === AttendanceStatus.ABSENT
        ).length;
        const percentage = (
          (presentCount / attendanceToCreate.length) *
          100
        ).toFixed(1);

        console.log(
          `   ✅ Created ${attendanceToCreate.length} attendance records`
        );
        console.log(
          `   📊 Present: ${presentCount}, Absent: ${absentCount}, Percentage: ${percentage}%`
        );

        totalCreated += attendanceToCreate.length;
      }
      console.log("");
    }

    console.log(`🎉 Total attendance records created: ${totalCreated}\n`);

    // Verify the data
    console.log("🔍 Verifying created attendance data...\n");

    const attendanceSummary = await prisma.attendance.groupBy({
      by: ["courseId", "status"],
      where: { studentId },
      _count: { status: true },
    });

    const courseAttendance = new Map();

    attendanceSummary.forEach((record) => {
      if (!courseAttendance.has(record.courseId)) {
        courseAttendance.set(record.courseId, { present: 0, absent: 0 });
      }

      const stats = courseAttendance.get(record.courseId);
      if (record.status === AttendanceStatus.PRESENT) {
        stats.present = record._count.status;
      } else if (record.status === AttendanceStatus.ABSENT) {
        stats.absent = record._count.status;
      }
    });

    console.log("📊 Attendance Summary by Course:");
    for (const enrollment of enrollments) {
      const stats = courseAttendance.get(enrollment.course.id) || {
        present: 0,
        absent: 0,
      };
      const total = stats.present + stats.absent;
      const percentage =
        total > 0 ? ((stats.present / total) * 100).toFixed(1) : 0;

      console.log(
        `   ${enrollment.course.subject.name} (${enrollment.course.semester.semesterNumber}th sem):`
      );
      console.log(
        `     Present: ${stats.present}, Absent: ${stats.absent}, Total: ${total}`
      );
      console.log(`     Percentage: ${percentage}%`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the script
createSampleAttendanceData();
