/**
 * @file src/services/database.service.ts
 * @description Service layer for administrative database operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";

class DatabaseService {
    /**
     * Wipes all data from all tables in the database.
     * The order of deletion is crucial to respect foreign key constraints.
     */
    public async cleanDatabase(): Promise<void> {
        try {
            console.log("🗑️ Starting database cleaning process...");
            await prisma.$transaction([
                // Start from the most dependent models and work upwards.
                prisma.studentEnrollment.deleteMany(),
                prisma.course.deleteMany(),
                prisma.student.deleteMany(),
                prisma.faculty.deleteMany(),
                prisma.user.deleteMany(), // Now deleting users as well
                prisma.subject.deleteMany(),
                prisma.division.deleteMany(),
                prisma.semester.deleteMany(),
                prisma.academicYear.deleteMany(),
                prisma.department.deleteMany(),
                prisma.college.deleteMany(),
            ]);

            console.log(
                "✅ Database cleaned successfully. All tables are empty."
            );
        } catch (error: any) {
            console.error("Error during database cleaning:", error);
            throw new AppError("Failed to clean the database.", 500);
        }
    }
}

export const databaseService = new DatabaseService();
