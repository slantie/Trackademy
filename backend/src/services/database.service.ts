/**
 * @file src/services/database.service.ts
 * @description Service layer for administrative database operations.
 */

import { prisma } from "./prisma.service";
import AppError from "../utils/appError";

class DatabaseService {
    /**
     * Cleans all transactional and structural data from the database,
     * preserving the User table.
     */
    public async cleanDatabase(): Promise<void> {
        try {
            // The order of deletion is crucial to avoid foreign key constraint violations.
            // We delete from the "many" side of relationships first, moving up the hierarchy.
            await prisma.$transaction([
                // 1. Start with models that have the most dependencies
                prisma.result.deleteMany(),

                // 2. Models that depend on Subject and Exam
                prisma.examSubject.deleteMany(),

                // 3. Models that depend on Student/Faculty and other entities
                // Note: Deleting Student/Faculty profiles does NOT delete the associated User
                prisma.student.deleteMany(),
                prisma.faculty.deleteMany(),

                // 4. Core entities
                prisma.subject.deleteMany(),
                prisma.exam.deleteMany(),
                prisma.division.deleteMany(),
                prisma.semester.deleteMany(),
                prisma.department.deleteMany(),
                prisma.academicYear.deleteMany(),
                prisma.college.deleteMany(),
            ]);

            console.log("🗑️ Database cleaned successfully (Users preserved).");
        } catch (error: any) {
            console.error("Error during database cleaning:", error);
            throw new AppError("Failed to clean the database.", 500);
        }
    }
}

export const databaseService = new DatabaseService();
