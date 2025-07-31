/**
 * @file src/services/academicYear.service.ts
 * @description Service layer for academic year-related business logic.
 */

import { prisma } from "../config/prisma.service";
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
    public async create(data: AcademicYearCreateData): Promise<AcademicYear> {
        const existingYear = await prisma.academicYear.findUnique({
            where: { year: data.year },
        });
        if (existingYear && !existingYear.isDeleted) {
            throw new AppError(
                `Academic year '${data.year}' already exists.`,
                409
            );
        }

        if (data.isActive) {
            return prisma.$transaction(async (tx) => {
                await tx.academicYear.updateMany({
                    where: { collegeId: data.collegeId, isActive: true },
                    data: { isActive: false },
                });
                return tx.academicYear.create({ data });
            });
        }

        return prisma.academicYear.create({ data });
    }

    public async getAllByCollege(collegeId: string): Promise<AcademicYear[]> {
        return prisma.academicYear.findMany({
            where: { collegeId, isDeleted: false },
            orderBy: { year: "desc" },
        });
    }

    public async getActiveByCollege(
        collegeId: string
    ): Promise<AcademicYear | null> {
        return prisma.academicYear.findFirst({
            where: { collegeId, isActive: true, isDeleted: false },
        });
    }

    public async getById(id: string): Promise<AcademicYear> {
        const academicYear = await prisma.academicYear.findUnique({
            where: { id, isDeleted: false },
        });
        if (!academicYear) {
            throw new AppError("Academic year not found.", 404);
        }
        return academicYear;
    }

    public async update(
        id: string,
        data: AcademicYearUpdateData
    ): Promise<AcademicYear> {
        const yearToUpdate = await this.getById(id);

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
                return tx.academicYear.update({ where: { id }, data });
            });
        }

        return prisma.academicYear.update({ where: { id }, data });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.academicYear.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const academicYearService = new AcademicYearService();
