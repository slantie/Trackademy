import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAssignment() {
  try {
    const courseId = "cmf6vuyrj01byl7xs7lnbjio8";

    // Find assignments for this course
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: courseId,
        isDeleted: false,
      },
      include: {
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

    console.log(`Found ${assignments.length} assignments for this course:`);
    console.log("");

    assignments.forEach((assignment, index) => {
      console.log(`${index + 1}. Assignment: ${assignment.title}`);
      console.log(`   ID: ${assignment.id}`);
      console.log(
        `   Description: ${assignment.description || "No description"}`
      );
      console.log(`   Due Date: ${assignment.dueDate}`);
      console.log(`   Total Marks: ${assignment.totalMarks}`);
      console.log(`   Course: ${assignment.course.subject.name}`);
      console.log(`   Faculty: ${assignment.course.faculty.fullName}`);
      console.log("");
    });

    if (assignments.length > 0) {
      console.log("=== SUMMARY FOR TESTING ===");
      console.log(`Course ID: ${courseId}`);
      console.log(`Assignment ID: ${assignments[0].id}`);
      console.log(`Assignment Title: ${assignments[0].title}`);
      console.log("");
      console.log("Students who can submit:");
      console.log("1. Kandarp Dipakkumar Gajjar (slantiehacks@gmail.com)");
      console.log("   - Student ID: cmf6ufcej005sl7gom8c5k2l6");
      console.log("   - User ID: cmf6ufcbq005ql7goecfaj503");
      console.log("2. Harsh Pankajkumar Suthar (slantie.hack@gmail.com)");
      console.log("   - Student ID: cmf6ufcvg0065l7gooes4xq70");
      console.log("   - User ID: cmf6ufcvf0063l7goe66zj76h");
      console.log("3. Dhruv Vijaykumar Jain (slantiehacks2@gmail.com)");
      console.log("   - Student ID: cmf6ufdc2006fl7go33pabtri");
      console.log("   - User ID: cmf6ufd99006dl7go24m3wnif");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAssignment();
