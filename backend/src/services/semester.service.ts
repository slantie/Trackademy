/**
 * @file src/services/semester.service.ts
 * @description Enhanced service layer for semester-related business logic with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Semester, SemesterType } from "@prisma/client";

interface SemesterCreateData {
    semesterNumber: number;
    semesterType: SemesterType;
    departmentId: string;
    academicYearId: string;
}

type SemesterUpdateData = Partial<
    Omit<SemesterCreateData, "departmentId" | "academicYearId">
>;

interface SemesterQueryOptions {
    page?: number;
    limit?: number;
    departmentId?: string;
    academicYearId?: string;
    semesterNumber?: number;
    semesterType?: SemesterType;
    search?: string;
    includeDeleted?: boolean;
}

class SemesterService {
    public async create(data: SemesterCreateData): Promise<Semester> {
        // Validate department exists
        const department = await prisma.department.findUnique({
            where: { id: data.departmentId, isDeleted: false },
        });
        if (!department) {
            throw new AppError("Department not found.", 400);
        }

        // Validate academic year exists
        const academicYear = await prisma.academicYear.findUnique({
            where: { id: data.academicYearId, isDeleted: false },
        });
        if (!academicYear) {
            throw new AppError("Academic year not found.", 400);
        }

        const existingSemester = await prisma.semester.findUnique({
            where: {
                academicYearId_departmentId_semesterNumber: {
                    academicYearId: data.academicYearId,
                    departmentId: data.departmentId,
                    semesterNumber: data.semesterNumber,
                },
            },
        });

        if (existingSemester) {
            if (!existingSemester.isDeleted) {
                throw new AppError(
                    "This semester instance already exists for the specified department and academic year.",
                    409
                );
            }

            // Restore soft-deleted semester
            return prisma.semester.update({
                where: { id: existingSemester.id },
                data: {
                    isDeleted: false,
                    semesterType: data.semesterType,
                },
                include: {
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
            });
        }

        return prisma.semester.create({
            data,
            include: {
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
        });
    }

    public async getAll(options: SemesterQueryOptions = {}) {
        const {
            departmentId,
            academicYearId,
            semesterNumber,
            semesterType,
            search,
            includeDeleted = false,
        } = options;

        const where: any = {};
        if (!includeDeleted) where.isDeleted = false;
        if (departmentId) where.departmentId = departmentId;
        if (academicYearId) where.academicYearId = academicYearId;
        if (semesterNumber !== undefined) where.semesterNumber = semesterNumber;
        if (semesterType) where.semesterType = semesterType;
        if (search) {
            where.OR = [
                {
                    department: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    academicYear: {
                        year: { contains: search, mode: "insensitive" },
                    },
                },
            ];
        }

        const semesters = await prisma.semester.findMany({
            where,
            include: {
                department: {
                    select: { id: true, name: true, abbreviation: true },
                },
                academicYear: {
                    select: { id: true, year: true, isActive: true },
                },
                _count: {
                    select: {
                        divisions: true,
                        courses: true,
                        students: true,
                        exams: true,
                    },
                },
            },
            orderBy: [
                { academicYear: { year: "desc" } },
                { semesterNumber: "asc" },
            ],
        });

        return { data: semesters };
    }

    public async getCount(
        options: Omit<SemesterQueryOptions, "page" | "limit"> = {}
    ) {
        const {
            departmentId,
            academicYearId,
            semesterNumber,
            semesterType,
            search,
            includeDeleted = false,
        } = options;

        const where: any = {};

        if (!includeDeleted) {
            where.isDeleted = false;
        }

        if (departmentId) {
            where.departmentId = departmentId;
        }

        if (academicYearId) {
            where.academicYearId = academicYearId;
        }

        if (semesterNumber !== undefined) {
            where.semesterNumber = semesterNumber;
        }

        if (semesterType) {
            where.semesterType = semesterType;
        }

        if (search) {
            where.OR = [
                {
                    department: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    academicYear: {
                        year: { contains: search, mode: "insensitive" },
                    },
                },
            ];
        }

        const count = await prisma.semester.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: {
            departmentId?: string;
            academicYearId?: string;
            limit?: number;
        } = {}
    ) {
        const { departmentId, academicYearId, limit = 20 } = options;

        const where: any = {
            isDeleted: false,
            OR: [
                {
                    department: {
                        name: { contains: query, mode: "insensitive" },
                    },
                },
                {
                    academicYear: {
                        year: { contains: query, mode: "insensitive" },
                    },
                },
            ],
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        if (academicYearId) {
            where.academicYearId = academicYearId;
        }

        return prisma.semester.findMany({
            where,
            include: {
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
                _count: {
                    select: {
                        divisions: true,
                        courses: true,
                        students: true,
                        exams: true,
                    },
                },
            },
            orderBy: [
                { academicYear: { year: "desc" } },
                { semesterNumber: "asc" },
            ],
            take: limit,
        });
    }

    public async getBySemesterNumber(
        semesterNumber: number,
        options: { departmentId?: string; academicYearId?: string } = {}
    ) {
        const { departmentId, academicYearId } = options;

        const where: any = {
            semesterNumber,
            isDeleted: false,
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        if (academicYearId) {
            where.academicYearId = academicYearId;
        }

        return prisma.semester.findMany({
            where,
            include: {
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
                _count: {
                    select: {
                        divisions: true,
                        courses: true,
                        students: true,
                        exams: true,
                    },
                },
            },
            orderBy: { academicYear: { year: "desc" } },
        });
    }

    public async getBySemesterType(
        semesterType: SemesterType,
        options: {
            departmentId?: string;
            academicYearId?: string;
            limit?: number;
        } = {}
    ) {
        const { departmentId, academicYearId, limit = 50 } = options;

        const where: any = {
            semesterType,
            isDeleted: false,
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        if (academicYearId) {
            where.academicYearId = academicYearId;
        }

        return prisma.semester.findMany({
            where,
            include: {
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
                _count: {
                    select: {
                        divisions: true,
                        courses: true,
                        students: true,
                        exams: true,
                    },
                },
            },
            orderBy: [
                { academicYear: { year: "desc" } },
                { semesterNumber: "asc" },
            ],
            take: limit,
        });
    }

    public async getByDepartmentAndYear(
        departmentId: string,
        academicYearId: string
    ): Promise<Semester[]> {
        return prisma.semester.findMany({
            where: {
                departmentId,
                academicYearId,
                isDeleted: false,
            },
            include: {
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
                _count: {
                    select: {
                        divisions: true,
                        courses: true,
                        students: true,
                        exams: true,
                    },
                },
            },
            orderBy: { semesterNumber: "asc" },
        });
    }

    public async getById(id: string): Promise<Semester> {
        const semester = await prisma.semester.findUnique({
            where: { id, isDeleted: false },
            include: {
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
                divisions: {
                    select: {
                        id: true,
                        name: true,
                    },
                    orderBy: { name: "asc" },
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
                        divisions: true,
                        courses: true,
                        students: true,
                        exams: true,
                    },
                },
            },
        });

        if (!semester) {
            throw new AppError("Semester not found.", 404);
        }
        return semester;
    }

    public async getByIdWithRelations(id: string) {
        return this.getById(id);
    }

    public async update(
        id: string,
        data: SemesterUpdateData
    ): Promise<Semester> {
        await this.getById(id);

        return prisma.semester.update({
            where: { id },
            data,
            include: {
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
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.semester.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    public async hardDelete(id: string): Promise<void> {
        const semester = await prisma.semester.findUnique({
            where: { id },
            include: {
                divisions: true,
                courses: true,
                students: true,
                exams: true,
            },
        });

        if (!semester) {
            throw new AppError("Semester not found.", 404);
        }

        if (
            semester.divisions.length > 0 ||
            semester.courses.length > 0 ||
            semester.students.length > 0 ||
            semester.exams.length > 0
        ) {
            throw new AppError(
                "Cannot delete semester with associated data (divisions, courses, students, or exams).",
                400
            );
        }

        await prisma.semester.delete({ where: { id } });
    }

    public async restore(id: string): Promise<Semester> {
        const semester = await prisma.semester.findUnique({
            where: { id },
        });

        if (!semester) {
            throw new AppError("Semester not found.", 404);
        }

        if (!semester.isDeleted) {
            throw new AppError("Semester is not deleted.", 400);
        }

        return prisma.semester.update({
            where: { id },
            data: { isDeleted: false },
            include: {
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
        });
    }
}

export const semesterService = new SemesterService();
