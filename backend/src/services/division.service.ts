/**
 * @file src/services/division.service.ts
 * @description Enhanced service layer for division-related business logic with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Division } from "@prisma/client";

interface DivisionCreateData {
    name: string;
    semesterId: string;
}

type DivisionUpdateData = Partial<Omit<DivisionCreateData, "semesterId">>;

interface DivisionQueryOptions {
    page?: number;
    limit?: number;
    semesterId?: string;
    departmentId?: string;
    academicYearId?: string;
    search?: string;
    includeDeleted?: boolean;
}

class DivisionService {
    public async create(data: DivisionCreateData): Promise<Division> {
        // Validate semester exists
        const semester = await prisma.semester.findUnique({
            where: { id: data.semesterId, isDeleted: false },
        });
        if (!semester) {
            throw new AppError("Semester not found.", 400);
        }

        const existingDivision = await prisma.division.findUnique({
            where: {
                name_semesterId: {
                    name: data.name,
                    semesterId: data.semesterId,
                },
            },
        });

        if (existingDivision) {
            if (!existingDivision.isDeleted) {
                throw new AppError(
                    "A division with this name already exists in this semester.",
                    409
                );
            }

            // Restore soft-deleted division
            return prisma.division.update({
                where: { id: existingDivision.id },
                data: { isDeleted: false },
                include: {
                    semester: {
                        select: {
                            id: true,
                            semesterNumber: true,
                            semesterType: true,
                            department: {
                                select: {
                                    id: true,
                                    name: true,
                                    abbreviation: true,
                                },
                            },
                            academicYear: {
                                select: {
                                    id: true,
                                    year: true,
                                    isActive: true,
                                },
                            },
                        },
                    },
                },
            });
        }

        return prisma.division.create({
            data,
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
    }

    public async getAll(options: DivisionQueryOptions = {}) {
        const {
            semesterId,
            departmentId,
            academicYearId,
            search,
            includeDeleted = false,
        } = options;
        const where: any = {};
        if (!includeDeleted) where.isDeleted = false;
        if (semesterId) where.semesterId = semesterId;
        if (departmentId) where.semester = { departmentId };
        if (academicYearId)
            where.semester = { ...(where.semester || {}), academicYearId };
        if (search) where.name = { contains: search, mode: "insensitive" };

        const divisions = await prisma.division.findMany({
            where,
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: { id: true, year: true, isActive: true },
                        },
                    },
                },
                _count: { select: { students: true, courses: true } },
            },
            orderBy: [
                { semester: { academicYear: { year: "desc" } } },
                { semester: { semesterNumber: "asc" } },
                { name: "asc" },
            ],
        });
        return { data: divisions };
    }

    public async getCount(
        options: Omit<DivisionQueryOptions, "page" | "limit"> = {}
    ) {
        const {
            semesterId,
            departmentId,
            academicYearId,
            search,
            includeDeleted = false,
        } = options;

        const where: any = {};

        if (!includeDeleted) {
            where.isDeleted = false;
        }

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (departmentId) {
            where.semester = {
                departmentId,
            };
        }

        if (academicYearId) {
            where.semester = {
                ...where.semester,
                academicYearId,
            };
        }

        if (search) {
            where.name = { contains: search, mode: "insensitive" };
        }

        const count = await prisma.division.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: {
            semesterId?: string;
            departmentId?: string;
            academicYearId?: string;
            limit?: number;
        } = {}
    ) {
        const {
            semesterId,
            departmentId,
            academicYearId,
            limit = 20,
        } = options;

        const where: any = {
            isDeleted: false,
            name: { contains: query, mode: "insensitive" },
        };

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (departmentId) {
            where.semester = {
                departmentId,
            };
        }

        if (academicYearId) {
            where.semester = {
                ...where.semester,
                academicYearId,
            };
        }

        return prisma.division.findMany({
            where,
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        students: true,
                        courses: true,
                    },
                },
            },
            orderBy: [
                { semester: { academicYear: { year: "desc" } } },
                { semester: { semesterNumber: "asc" } },
                { name: "asc" },
            ],
            take: limit,
        });
    }

    public async getAllBySemester(semesterId: string): Promise<Division[]> {
        return prisma.division.findMany({
            where: {
                semesterId,
                isDeleted: false,
            },
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        students: true,
                        courses: true,
                    },
                },
            },
            orderBy: { name: "asc" },
        });
    }

    public async getByDepartment(
        departmentId: string,
        options: { academicYearId?: string; limit?: number } = {}
    ) {
        const { academicYearId, limit = 50 } = options;

        const where: any = {
            isDeleted: false,
            semester: {
                departmentId,
            },
        };

        if (academicYearId) {
            where.semester.academicYearId = academicYearId;
        }

        return prisma.division.findMany({
            where,
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        students: true,
                        courses: true,
                    },
                },
            },
            orderBy: [
                { semester: { academicYear: { year: "desc" } } },
                { semester: { semesterNumber: "asc" } },
                { name: "asc" },
            ],
            take: limit,
        });
    }

    public async getByAcademicYear(
        academicYearId: string,
        options: { departmentId?: string; limit?: number } = {}
    ) {
        const { departmentId, limit = 50 } = options;

        const where: any = {
            isDeleted: false,
            semester: {
                academicYearId,
            },
        };

        if (departmentId) {
            where.semester.departmentId = departmentId;
        }

        return prisma.division.findMany({
            where,
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        students: true,
                        courses: true,
                    },
                },
            },
            orderBy: [{ semester: { semesterNumber: "asc" } }, { name: "asc" }],
            take: limit,
        });
    }

    public async getById(id: string): Promise<Division> {
        const division = await prisma.division.findUnique({
            where: { id, isDeleted: false },
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                                college: {
                                    select: {
                                        id: true,
                                        name: true,
                                        abbreviation: true,
                                    },
                                },
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                students: {
                    select: {
                        id: true,
                        enrollmentNumber: true,
                        fullName: true,
                        user: {
                            select: {
                                email: true,
                            },
                        },
                    },
                    orderBy: { enrollmentNumber: "asc" },
                },
                courses: {
                    select: {
                        id: true,
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                type: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        students: true,
                        courses: true,
                    },
                },
            },
        });

        if (!division) {
            throw new AppError("Division not found.", 404);
        }
        return division;
    }

    public async getByIdWithRelations(id: string) {
        return this.getById(id);
    }

    public async update(
        id: string,
        data: DivisionUpdateData
    ): Promise<Division> {
        await this.getById(id);

        return prisma.division.update({
            where: { id },
            data,
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.division.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    public async hardDelete(id: string): Promise<void> {
        const division = await prisma.division.findUnique({
            where: { id },
            include: {
                students: true,
                courses: true,
            },
        });

        if (!division) {
            throw new AppError("Division not found.", 404);
        }

        if (division.students.length > 0 || division.courses.length > 0) {
            throw new AppError(
                "Cannot delete division with associated students or courses.",
                400
            );
        }

        await prisma.division.delete({ where: { id } });
    }

    public async restore(id: string): Promise<Division> {
        const division = await prisma.division.findUnique({
            where: { id },
        });

        if (!division) {
            throw new AppError("Division not found.", 404);
        }

        if (!division.isDeleted) {
            throw new AppError("Division is not deleted.", 400);
        }

        return prisma.division.update({
            where: { id },
            data: { isDeleted: false },
            include: {
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });
    }
}

export const divisionService = new DivisionService();
