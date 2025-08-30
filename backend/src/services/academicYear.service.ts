/**
 * @file src/services/academicYear.service.ts
 * @description Enhanced service layer for academic year-related business logic with comprehensive CRUD operations.
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

interface AcademicYearQueryOptions {
    page?: number;
    limit?: number;
    collegeId?: string;
    isActive?: boolean;
    search?: string;
    includeDeleted?: boolean;
}

class AcademicYearService {
    public async create(data: AcademicYearCreateData): Promise<AcademicYear> {
        // Validate college exists
        const college = await prisma.college.findUnique({
            where: { id: data.collegeId, isDeleted: false },
        });
        if (!college) {
            throw new AppError("College not found.", 400);
        }

        const existingYear = await prisma.academicYear.findUnique({
            where: { year: data.year },
        });

        // If an academic year with this year string exists
        if (existingYear) {
            // If it's not deleted, throw error
            if (!existingYear.isDeleted) {
                throw new AppError(
                    `Academic year '${data.year}' already exists.`,
                    409
                );
            }

            // If it's soft deleted, restore it instead of creating new
            if (data.isActive) {
                return prisma.$transaction(async (tx) => {
                    // Deactivate other active years for this college
                    await tx.academicYear.updateMany({
                        where: { collegeId: data.collegeId, isActive: true },
                        data: { isActive: false },
                    });

                    // Restore the soft-deleted year
                    return tx.academicYear.update({
                        where: { id: existingYear.id },
                        data: {
                            isDeleted: false,
                            isActive: data.isActive,
                            collegeId: data.collegeId,
                        },
                        include: {
                            college: {
                                select: {
                                    id: true,
                                    name: true,
                                    abbreviation: true,
                                },
                            },
                        },
                    });
                });
            }

            // Restore without making it active
            return prisma.academicYear.update({
                where: { id: existingYear.id },
                data: {
                    isDeleted: false,
                    collegeId: data.collegeId,
                },
                include: {
                    college: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true,
                        },
                    },
                },
            });
        }

        // No existing year found, create new one
        if (data.isActive) {
            return prisma.$transaction(async (tx) => {
                await tx.academicYear.updateMany({
                    where: { collegeId: data.collegeId, isActive: true },
                    data: { isActive: false },
                });
                return tx.academicYear.create({
                    data,
                    include: {
                        college: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                });
            });
        }

        return prisma.academicYear.create({
            data,
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
            },
        });
    }

    public async getAll(options: AcademicYearQueryOptions = {}) {
        const { collegeId, isActive, search, includeDeleted = false } = options;

        const where: any = {};

        if (!includeDeleted) {
            where.isDeleted = false;
        }

        if (collegeId) {
            where.collegeId = collegeId;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (search) {
            where.year = { contains: search, mode: "insensitive" };
        }

        const academicYears = await prisma.academicYear.findMany({
            where,
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                _count: {
                    select: {
                        semesters: true,
                    },
                },
            },
            orderBy: { year: "desc" },
        });

        return { data: academicYears };
    }

    public async getCount(
        options: Omit<AcademicYearQueryOptions, "page" | "limit"> = {}
    ) {
        const { collegeId, isActive, search, includeDeleted = false } = options;

        const where: any = {};

        if (!includeDeleted) {
            where.isDeleted = false;
        }

        if (collegeId) {
            where.collegeId = collegeId;
        }

        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        if (search) {
            where.year = { contains: search, mode: "insensitive" };
        }

        const count = await prisma.academicYear.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: { collegeId?: string; limit?: number } = {}
    ) {
        const { collegeId, limit = 20 } = options;

        const where: any = {
            isDeleted: false,
            year: { contains: query, mode: "insensitive" },
        };

        if (collegeId) {
            where.collegeId = collegeId;
        }

        return prisma.academicYear.findMany({
            where,
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                _count: {
                    select: {
                        semesters: true,
                    },
                },
            },
            orderBy: { year: "desc" },
            take: limit,
        });
    }

    public async getActiveYears(collegeId?: string) {
        const where: any = {
            isActive: true,
            isDeleted: false,
        };

        if (collegeId) {
            where.collegeId = collegeId;
        }

        return prisma.academicYear.findMany({
            where,
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                _count: {
                    select: {
                        semesters: true,
                    },
                },
            },
            orderBy: { year: "desc" },
        });
    }

    public async getAllByCollege(collegeId: string): Promise<AcademicYear[]> {
        return prisma.academicYear.findMany({
            where: { collegeId, isDeleted: false },
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                _count: {
                    select: {
                        semesters: true,
                    },
                },
            },
            orderBy: { year: "desc" },
        });
    }

    public async getActiveByCollege(
        collegeId: string
    ): Promise<AcademicYear | null> {
        return prisma.academicYear.findFirst({
            where: { collegeId, isActive: true, isDeleted: false },
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                _count: {
                    select: {
                        semesters: true,
                    },
                },
            },
        });
    }

    public async getById(id: string): Promise<AcademicYear> {
        const academicYear = await prisma.academicYear.findUnique({
            where: { id, isDeleted: false },
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                semesters: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                    },
                    orderBy: { semesterNumber: "asc" },
                },
            },
        });
        if (!academicYear) {
            throw new AppError("Academic year not found.", 404);
        }
        return academicYear;
    }

    public async getByIdWithRelations(id: string) {
        return this.getById(id);
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
                return tx.academicYear.update({
                    where: { id },
                    data,
                    include: {
                        college: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                });
            });
        }

        return prisma.academicYear.update({
            where: { id },
            data,
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
            },
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.academicYear.update({
            where: { id },
            data: { isDeleted: true, isActive: false },
        });
    }

    public async hardDelete(id: string): Promise<void> {
        const academicYear = await prisma.academicYear.findUnique({
            where: { id },
            include: {
                semesters: true,
            },
        });

        if (!academicYear) {
            throw new AppError("Academic year not found.", 404);
        }

        if (academicYear.semesters.length > 0) {
            throw new AppError(
                "Cannot delete academic year with associated semesters.",
                400
            );
        }

        await prisma.academicYear.delete({ where: { id } });
    }

    public async restore(id: string): Promise<AcademicYear> {
        const academicYear = await prisma.academicYear.findUnique({
            where: { id },
        });

        if (!academicYear) {
            throw new AppError("Academic year not found.", 404);
        }

        if (!academicYear.isDeleted) {
            throw new AppError("Academic year is not deleted.", 400);
        }

        return prisma.academicYear.update({
            where: { id },
            data: { isDeleted: false },
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
            },
        });
    }

    public async activate(id: string): Promise<AcademicYear> {
        const academicYear = await this.getById(id);

        return prisma.$transaction(async (tx) => {
            // Deactivate all other academic years for this college
            await tx.academicYear.updateMany({
                where: {
                    collegeId: academicYear.collegeId,
                    isActive: true,
                    id: { not: id },
                },
                data: { isActive: false },
            });

            // Activate the selected academic year
            return tx.academicYear.update({
                where: { id },
                data: { isActive: true },
                include: {
                    college: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true,
                        },
                    },
                },
            });
        });
    }

    public async deactivate(id: string): Promise<AcademicYear> {
        await this.getById(id);

        return prisma.academicYear.update({
            where: { id },
            data: { isActive: false },
            include: {
                college: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
            },
        });
    }
}

export const academicYearService = new AcademicYearService();
