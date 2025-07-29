/**
 * @file src/services/academicYear.service.ts
 * @description Service layer for academic year-related business logic.
 */

import { prisma } from "./prisma.service";
import AppError from "../utils/appError";
import { AcademicYear } from "@prisma/client";

interface AcademicYearCreateData {
    year: string;
    collegeId: string;
    isActive?: boolean;
}

type AcademicYearUpdateData = Partial<
    Omit<AcademicYearCreateData, "collegeId">
>;

class AcademicYearService {
    /**
     * Creates a new academic year for a specific college.
     * If `isActive` is true, it deactivates all other years for that college within a transaction.
     * @param data - The data for the new academic year.
     * @returns The newly created academic year.
     */
    public async create(data: AcademicYearCreateData): Promise<AcademicYear> {
        // Check if an academic year with this year string already exists
        const existingYear = await prisma.academicYear.findUnique({
            where: { year: data.year },
        });
        if (existingYear) {
            throw new AppError(
                `Academic year '${data.year}' already exists.`,
                409
            );
        }

        if (data.isActive) {
            // Use a transaction to ensure atomicity
            return prisma.$transaction(async (tx) => {
                await tx.academicYear.updateMany({
                    where: { collegeId: data.collegeId, isActive: true },
                    data: { isActive: false },
                });
                const newYear = await tx.academicYear.create({ data });
                return newYear;
            });
        }

        return prisma.academicYear.create({ data });
    }

    /**
     * Retrieves all academic years for a given college.
     * @param collegeId - The CUID of the college.
     * @returns A list of academic years for the college.
     */
    public async getAllByCollege(collegeId: string): Promise<AcademicYear[]> {
        return prisma.academicYear.findMany({
            where: { collegeId, isDeleted: false },
            orderBy: { year: "desc" },
        });
    }

    /**
     * Retrieves the currently active academic year for a specific college.
     * @param collegeId - The CUID of the college.
     * @returns The active academic year or null if none is active.
     */
    public async getActiveByCollege(
        collegeId: string
    ): Promise<AcademicYear | null> {
        return prisma.academicYear.findFirst({
            where: { collegeId, isActive: true, isDeleted: false },
        });
    }

    /**
     * Retrieves a single academic year by its ID.
     * @param id - The CUID of the academic year.
     * @returns The requested academic year.
     */
    public async getById(id: string): Promise<AcademicYear> {
        const academicYear = await prisma.academicYear.findUnique({
            where: { id, isDeleted: false },
        });
        if (!academicYear) {
            throw new AppError("Academic year not found.", 404);
        }
        return academicYear;
    }

    /**
     * Updates an existing academic year.
     * @param id - The CUID of the academic year to update.
     * @param data - The data to update.
     * @returns The updated academic year.
     */
    public async update(
        id: string,
        data: AcademicYearUpdateData
    ): Promise<AcademicYear> {
        const yearToUpdate = await this.getById(id); // Ensures the year exists

        if (data.isActive) {
            return prisma.$transaction(async (tx) => {
                await tx.academicYear.updateMany({
                    where: {
                        collegeId: yearToUpdate.collegeId,
                        isActive: true,
                        id: { not: id },
                    },
                    data: { isActive: false },
                });
                const updatedYear = await tx.academicYear.update({
                    where: { id },
                    data,
                });
                return updatedYear;
            });
        }

        return prisma.academicYear.update({ where: { id }, data });
    }

    /**
     * Soft deletes an academic year.
     * @param id - The CUID of the academic year to delete.
     */
    public async delete(id: string): Promise<void> {
        await this.getById(id); // Ensures the year exists
        await prisma.academicYear.delete({
            where: { id },
        });
    }
}

export const academicYearService = new AcademicYearService();
