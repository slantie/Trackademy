/**
 * @file src/services/exam.service.ts
 * @description Enhanced service layer for exam-related business logic with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Exam, ExamType } from "@prisma/client";

interface ExamCreateData {
    name: string;
    examType: ExamType;
    semesterId: string;
    description?: string;
    maxMarks?: number;
    passMarks?: number;
    examDate?: Date;
    duration?: number;
    isPublished?: boolean;
}

type ExamUpdateData = Partial<Omit<ExamCreateData, "semesterId">>;

interface ExamQueryOptions {
    page?: number;
    limit?: number;
    semesterId?: string;
    departmentId?: string;
    academicYearId?: string;
    examType?: ExamType;
    isPublished?: boolean;
    search?: string;
    includeDeleted?: boolean;
}

class ExamService {
    public async create(data: ExamCreateData): Promise<Exam> {
        // Validate semester exists
        const semester = await prisma.semester.findUnique({
            where: { id: data.semesterId, isDeleted: false },
        });
        if (!semester) {
            throw new AppError("Semester not found.", 400);
        }

        const existingExam = await prisma.exam.findUnique({
            where: {
                semesterId_examType: {
                    semesterId: data.semesterId,
                    examType: data.examType,
                },
            },
        });

        if (existingExam) {
            if (!existingExam.isDeleted) {
                throw new AppError(
                    `An exam of type '${data.examType}' already exists for this semester.`,
                    409
                );
            }

            // Restore soft-deleted exam
            return prisma.exam.update({
                where: { id: existingExam.id },
                data: {
                    ...data,
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
                },
            });
        }

        return prisma.exam.create({
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

    public async getAll(options: ExamQueryOptions = {}) {
        const {
            semesterId,
            departmentId,
            academicYearId,
            examType,
            isPublished,
            search,
            includeDeleted = false,
        } = options;

        const where: any = {};
        if (!includeDeleted) where.isDeleted = false;
        if (semesterId) where.semesterId = semesterId;
        if (departmentId) where.semester = { departmentId };
        if (academicYearId)
            where.semester = { ...(where.semester || {}), academicYearId };
        if (examType) where.examType = examType;
        if (isPublished !== undefined) where.isPublished = isPublished;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const exams = await prisma.exam.findMany({
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
                _count: { select: { examResults: true } },
            },
            orderBy: [
                { semester: { academicYear: { year: "desc" } } },
                { semester: { semesterNumber: "asc" } },
                { name: "asc" },
            ],
        });

        return { data: exams };
    }

    public async getCount(
        options: Omit<ExamQueryOptions, "page" | "limit"> = {}
    ) {
        const {
            semesterId,
            departmentId,
            academicYearId,
            examType,
            isPublished,
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

        if (examType) {
            where.examType = examType;
        }

        if (isPublished !== undefined) {
            where.isPublished = isPublished;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const count = await prisma.exam.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: {
            semesterId?: string;
            departmentId?: string;
            examType?: ExamType;
            limit?: number;
        } = {}
    ) {
        const { semesterId, departmentId, examType, limit = 20 } = options;

        const where: any = {
            isDeleted: false,
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
            ],
        };

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (departmentId) {
            where.semester = {
                departmentId,
            };
        }

        if (examType) {
            where.examType = examType;
        }

        return prisma.exam.findMany({
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
                        examResults: true,
                    },
                },
            },
            orderBy: [
                { semester: { academicYear: { year: "desc" } } },
                { name: "asc" },
            ],
            take: limit,
        });
    }

    public async getByExamType(
        examType: ExamType,
        options: {
            semesterId?: string;
            departmentId?: string;
            limit?: number;
        } = {}
    ) {
        const { semesterId, departmentId, limit = 50 } = options;

        const where: any = {
            examType,
            isDeleted: false,
        };

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (departmentId) {
            where.semester = {
                departmentId,
            };
        }

        return prisma.exam.findMany({
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
                        examResults: true,
                    },
                },
            },
            orderBy: [
                { semester: { academicYear: { year: "desc" } } },
                { name: "asc" },
            ],
            take: limit,
        });
    }

    public async getPublishedExams(
        options: {
            semesterId?: string;
            departmentId?: string;
            limit?: number;
        } = {}
    ) {
        const { semesterId, departmentId, limit = 50 } = options;

        const where: any = {
            isPublished: true,
            isDeleted: false,
        };

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (departmentId) {
            where.semester = {
                departmentId,
            };
        }

        return prisma.exam.findMany({
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
                        examResults: true,
                    },
                },
            },
            orderBy: [{ name: "asc" }],
            take: limit,
        });
    }

    public async getBySemester(semesterId: string): Promise<Exam[]> {
        return prisma.exam.findMany({
            where: { semesterId, isDeleted: false },
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
                        examResults: true,
                    },
                },
            },
            orderBy: [{ name: "asc" }],
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

        return prisma.exam.findMany({
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
                        examResults: true,
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

    public async getById(id: string): Promise<Exam> {
        const exam = await prisma.exam.findUnique({
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
                examResults: {
                    select: {
                        id: true,
                        spi: true,
                        cpi: true,
                        status: true,
                        student: {
                            select: {
                                id: true,
                                enrollmentNumber: true,
                                fullName: true,
                            },
                        },
                    },
                    orderBy: {
                        student: { enrollmentNumber: "asc" },
                    },
                },
                _count: {
                    select: {
                        examResults: true,
                    },
                },
            },
        });
        if (!exam) throw new AppError("Exam not found.", 404);
        return exam;
    }

    public async getByIdWithRelations(id: string) {
        return this.getById(id);
    }

    public async update(id: string, data: ExamUpdateData): Promise<Exam> {
        await this.getById(id);

        return prisma.exam.update({
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

    public async publish(id: string): Promise<Exam> {
        return this.update(id, { isPublished: true });
    }

    public async unpublish(id: string): Promise<Exam> {
        return this.update(id, { isPublished: false });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.exam.update({
            where: { id },
            data: { isDeleted: true, isPublished: false },
        });
    }

    public async hardDelete(id: string): Promise<void> {
        const exam = await prisma.exam.findUnique({
            where: { id },
            include: {
                examResults: true,
            },
        });

        if (!exam) {
            throw new AppError("Exam not found.", 404);
        }

        if (exam.examResults.length > 0) {
            throw new AppError(
                "Cannot delete exam with associated exam results.",
                400
            );
        }

        await prisma.exam.delete({ where: { id } });
    }

    public async restore(id: string): Promise<Exam> {
        const exam = await prisma.exam.findUnique({
            where: { id },
        });

        if (!exam) {
            throw new AppError("Exam not found.", 404);
        }

        if (!exam.isDeleted) {
            throw new AppError("Exam is not deleted.", 400);
        }

        return prisma.exam.update({
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

export const examService = new ExamService();
