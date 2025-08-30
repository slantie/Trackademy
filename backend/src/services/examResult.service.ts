/**
 * @file src/services/examResult.service.ts
 * @description Enhanced service layer for exam result-related business logic with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { ExamResult, ResultStatus } from "@prisma/client";

interface ExamResultCreateData {
    studentEnrollmentNumber: string;
    spi: number;
    cpi: number;
    status: ResultStatus;
    studentId?: string;
    examId: string;
}

type ExamResultUpdateData = Partial<
    Omit<ExamResultCreateData, "examId" | "studentEnrollmentNumber">
>;

interface ExamResultQueryOptions {
    page?: number;
    limit?: number;
    examId?: string;
    studentId?: string;
    studentEnrollmentNumber?: string;
    status?: ResultStatus;
    semesterId?: string;
    departmentId?: string;
    academicYearId?: string;
    search?: string;
    minSpi?: number;
    maxSpi?: number;
    minCpi?: number;
    maxCpi?: number;
}

class ExamResultService {
    public async create(data: ExamResultCreateData): Promise<ExamResult> {
        // Validate exam exists
        const exam = await prisma.exam.findUnique({
            where: { id: data.examId },
        });
        if (!exam) {
            throw new AppError("Exam not found.", 400);
        }

        // Validate student if studentId provided
        if (data.studentId) {
            const student = await prisma.student.findUnique({
                where: { id: data.studentId, isDeleted: false },
            });
            if (!student) {
                throw new AppError("Student not found.", 400);
            }

            // Ensure enrollment numbers match
            if (student.enrollmentNumber !== data.studentEnrollmentNumber) {
                throw new AppError("Student enrollment number mismatch.", 400);
            }
        }

        // Check for existing result
        const existingResult = await prisma.examResult.findFirst({
            where: {
                examId: data.examId,
                studentEnrollmentNumber: data.studentEnrollmentNumber,
            },
        });

        if (existingResult) {
            throw new AppError(
                `Exam result already exists for student ${data.studentEnrollmentNumber} in this exam.`,
                409
            );
        }

        return prisma.examResult.create({
            data,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
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
                },
                results: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
            },
        });
    }

    public async getAll(options: ExamResultQueryOptions = {}) {
        const {
            examId,
            studentId,
            studentEnrollmentNumber,
            status,
            semesterId,
            departmentId,
            academicYearId,
            search,
            minSpi,
            maxSpi,
            minCpi,
            maxCpi,
        } = options;

        const where: any = {};
        if (examId) where.examId = examId;
        if (studentId) where.studentId = studentId;
        if (studentEnrollmentNumber)
            where.studentEnrollmentNumber = studentEnrollmentNumber;
        if (status) where.status = status;
        if (semesterId) where.exam = { semesterId };
        if (departmentId)
            where.exam = { ...(where.exam || {}), semester: { departmentId } };
        if (academicYearId)
            where.exam = {
                ...(where.exam || {}),
                semester: { ...(where.exam?.semester || {}), academicYearId },
            };
        if (search) {
            where.OR = [
                {
                    studentEnrollmentNumber: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    student: {
                        fullName: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    student: {
                        email: { contains: search, mode: "insensitive" },
                    },
                },
            ];
        }
        if (minSpi !== undefined)
            where.spi = { ...(where.spi || {}), gte: minSpi };
        if (maxSpi !== undefined)
            where.spi = { ...(where.spi || {}), lte: maxSpi };
        if (minCpi !== undefined)
            where.cpi = { ...(where.cpi || {}), gte: minCpi };
        if (maxCpi !== undefined)
            where.cpi = { ...(where.cpi || {}), lte: maxCpi };

        const examResults = await prisma.examResult.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
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
                },
                _count: { select: { results: true } },
            },
            orderBy: [
                { exam: { semester: { academicYear: { year: "desc" } } } },
                { exam: { semester: { semesterNumber: "asc" } } },
                { studentEnrollmentNumber: "asc" },
            ],
        });

        return { data: examResults };
    }

    public async getCount(
        options: Omit<ExamResultQueryOptions, "page" | "limit"> = {}
    ) {
        const {
            examId,
            studentId,
            studentEnrollmentNumber,
            status,
            semesterId,
            departmentId,
            academicYearId,
            search,
            minSpi,
            maxSpi,
            minCpi,
            maxCpi,
        } = options;

        const where: any = {};

        if (examId) {
            where.examId = examId;
        }

        if (studentId) {
            where.studentId = studentId;
        }

        if (studentEnrollmentNumber) {
            where.studentEnrollmentNumber = studentEnrollmentNumber;
        }

        if (status) {
            where.status = status;
        }

        if (semesterId) {
            where.exam = {
                semesterId,
            };
        }

        if (departmentId) {
            where.exam = {
                ...where.exam,
                semester: {
                    departmentId,
                },
            };
        }

        if (academicYearId) {
            where.exam = {
                ...where.exam,
                semester: {
                    ...where.exam?.semester,
                    academicYearId,
                },
            };
        }

        if (search) {
            where.OR = [
                {
                    studentEnrollmentNumber: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    student: {
                        fullName: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    student: {
                        email: { contains: search, mode: "insensitive" },
                    },
                },
            ];
        }

        if (minSpi !== undefined) {
            where.spi = { ...where.spi, gte: minSpi };
        }

        if (maxSpi !== undefined) {
            where.spi = { ...where.spi, lte: maxSpi };
        }

        if (minCpi !== undefined) {
            where.cpi = { ...where.cpi, gte: minCpi };
        }

        if (maxCpi !== undefined) {
            where.cpi = { ...where.cpi, lte: maxCpi };
        }

        const count = await prisma.examResult.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: {
            examId?: string;
            semesterId?: string;
            departmentId?: string;
            status?: ResultStatus;
            limit?: number;
        } = {}
    ) {
        const {
            examId,
            semesterId,
            departmentId,
            status,
            limit = 20,
        } = options;

        const where: any = {
            OR: [
                {
                    studentEnrollmentNumber: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    student: {
                        fullName: { contains: query, mode: "insensitive" },
                    },
                },
                {
                    student: {
                        email: { contains: query, mode: "insensitive" },
                    },
                },
            ],
        };

        if (examId) {
            where.examId = examId;
        }

        if (semesterId) {
            where.exam = {
                semesterId,
            };
        }

        if (departmentId) {
            where.exam = {
                ...where.exam,
                semester: {
                    departmentId,
                },
            };
        }

        if (status) {
            where.status = status;
        }

        return prisma.examResult.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
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
                },
                _count: {
                    select: {
                        results: true,
                    },
                },
            },
            orderBy: [
                { exam: { semester: { academicYear: { year: "desc" } } } },
                { studentEnrollmentNumber: "asc" },
            ],
            take: limit,
        });
    }

    public async getByStatus(
        status: ResultStatus,
        options: {
            examId?: string;
            semesterId?: string;
            departmentId?: string;
            limit?: number;
        } = {}
    ) {
        const { examId, semesterId, departmentId, limit = 50 } = options;

        const where: any = {
            status,
        };

        if (examId) {
            where.examId = examId;
        }

        if (semesterId) {
            where.exam = {
                semesterId,
            };
        }

        if (departmentId) {
            where.exam = {
                ...where.exam,
                semester: {
                    departmentId,
                },
            };
        }

        return prisma.examResult.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
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
                },
                _count: {
                    select: {
                        results: true,
                    },
                },
            },
            orderBy: [
                { exam: { semester: { academicYear: { year: "desc" } } } },
                { studentEnrollmentNumber: "asc" },
            ],
            take: limit,
        });
    }

    public async getTopPerformers(
        options: {
            examId?: string;
            semesterId?: string;
            departmentId?: string;
            limit?: number;
            byField?: "spi" | "cpi";
        } = {}
    ) {
        const {
            examId,
            semesterId,
            departmentId,
            limit = 10,
            byField = "spi",
        } = options;

        const where: any = {};

        if (examId) {
            where.examId = examId;
        }

        if (semesterId) {
            where.exam = {
                semesterId,
            };
        }

        if (departmentId) {
            where.exam = {
                ...where.exam,
                semester: {
                    departmentId,
                },
            };
        }

        return prisma.examResult.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
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
                },
            },
            orderBy: [
                { [byField]: "desc" },
                { studentEnrollmentNumber: "asc" },
            ],
            take: limit,
        });
    }

    /**
     * Retrieves all exam results for a specific exam.
     * Includes individual subject results and student details.
     * @param examId - The CUID of the exam.
     * @returns A list of all student results for that exam.
     */
    public async getByExam(examId: string): Promise<ExamResult[]> {
        return prisma.examResult.findMany({
            where: { examId },
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
                    },
                },
                results: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                abbreviation: true,
                            },
                        },
                    },
                    orderBy: {
                        subject: {
                            code: "asc",
                        },
                    },
                },
            },
            orderBy: {
                studentEnrollmentNumber: "asc",
            },
        });
    }

    /**
     * Retrieves all exam results for a specific student.
     * @param studentId - The CUID of the student.
     * @returns A list of the student's exam results over time.
     */
    public async getByStudent(studentId: string): Promise<ExamResult[]> {
        return prisma.examResult.findMany({
            where: { studentId },
            include: {
                exam: {
                    include: {
                        semester: {
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
                        },
                    },
                },
                results: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                abbreviation: true,
                            },
                        },
                    },
                    orderBy: {
                        subject: {
                            code: "asc",
                        },
                    },
                },
            },
            orderBy: {
                exam: {
                    semester: {
                        academicYear: {
                            year: "desc",
                        },
                    },
                },
            },
        });
    }

    public async getByStudentEnrollment(enrollmentNumber: string) {
        return prisma.examResult.findMany({
            where: { studentEnrollmentNumber: enrollmentNumber },
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    include: {
                        semester: {
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
                        },
                    },
                },
                results: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                abbreviation: true,
                            },
                        },
                    },
                    orderBy: {
                        subject: {
                            code: "asc",
                        },
                    },
                },
            },
            orderBy: {
                exam: {
                    semester: {
                        academicYear: {
                            year: "desc",
                        },
                    },
                },
            },
        });
    }

    public async getBySemester(
        semesterId: string,
        options: {
            departmentId?: string;
            status?: ResultStatus;
            limit?: number;
        } = {}
    ) {
        const { departmentId, status, limit = 100 } = options;

        const where: any = {
            exam: {
                semesterId,
            },
        };

        if (departmentId) {
            where.exam.semester = {
                departmentId,
            };
        }

        if (status) {
            where.status = status;
        }

        return prisma.examResult.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
                    },
                },
                _count: {
                    select: {
                        results: true,
                    },
                },
            },
            orderBy: [
                { exam: { name: "asc" } },
                { studentEnrollmentNumber: "asc" },
            ],
            take: limit,
        });
    }

    public async getByDepartment(
        departmentId: string,
        options: {
            academicYearId?: string;
            semesterId?: string;
            status?: ResultStatus;
            limit?: number;
        } = {}
    ) {
        const { academicYearId, semesterId, status, limit = 100 } = options;

        const where: any = {
            exam: {
                semester: {
                    departmentId,
                },
            },
        };

        if (academicYearId) {
            where.exam.semester.academicYearId = academicYearId;
        }

        if (semesterId) {
            where.exam.semesterId = semesterId;
        }

        if (status) {
            where.status = status;
        }

        return prisma.examResult.findMany({
            where,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
                        semester: {
                            select: {
                                id: true,
                                semesterNumber: true,
                                semesterType: true,
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
                },
                _count: {
                    select: {
                        results: true,
                    },
                },
            },
            orderBy: [
                { exam: { semester: { academicYear: { year: "desc" } } } },
                { exam: { semester: { semesterNumber: "asc" } } },
                { exam: { name: "asc" } },
                { studentEnrollmentNumber: "asc" },
            ],
            take: limit,
        });
    }

    /**
     * Retrieves a single, detailed exam result by its ID.
     * @param id - The CUID of the ExamResult record.
     * @returns The detailed exam result.
     */
    public async getById(id: string): Promise<ExamResult> {
        const examResult = await prisma.examResult.findUnique({
            where: { id },
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    include: {
                        semester: {
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
                            },
                        },
                    },
                },
                results: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                abbreviation: true,
                            },
                        },
                    },
                    orderBy: {
                        subject: {
                            code: "asc",
                        },
                    },
                },
            },
        });

        if (!examResult) {
            throw new AppError("Exam result not found.", 404);
        }
        return examResult;
    }

    public async getByIdWithRelations(id: string) {
        return this.getById(id);
    }

    public async update(
        id: string,
        data: ExamResultUpdateData
    ): Promise<ExamResult> {
        const existingResult = await prisma.examResult.findUnique({
            where: { id },
        });

        if (!existingResult) {
            throw new AppError("Exam result not found.", 404);
        }

        // Validate student if studentId provided
        if (data.studentId) {
            const student = await prisma.student.findUnique({
                where: { id: data.studentId, isDeleted: false },
            });
            if (!student) {
                throw new AppError("Student not found.", 400);
            }
        }

        return prisma.examResult.update({
            where: { id },
            data,
            include: {
                student: {
                    select: {
                        id: true,
                        fullName: true,
                        enrollmentNumber: true,
                    },
                },
                exam: {
                    select: {
                        id: true,
                        name: true,
                        examType: true,
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
                },
                results: {
                    include: {
                        subject: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
            },
        });
    }

    public async delete(id: string): Promise<void> {
        const examResult = await prisma.examResult.findUnique({
            where: { id },
            include: {
                results: true,
            },
        });

        if (!examResult) {
            throw new AppError("Exam result not found.", 404);
        }

        // Delete related results first
        await prisma.result.deleteMany({
            where: { examResultId: id },
        });

        // Delete the exam result
        await prisma.examResult.delete({
            where: { id },
        });
    }

    public async getStatistics(
        options: {
            examId?: string;
            semesterId?: string;
            departmentId?: string;
            academicYearId?: string;
        } = {}
    ) {
        const { examId, semesterId, departmentId, academicYearId } = options;

        const where: any = {};

        if (examId) {
            where.examId = examId;
        }

        if (semesterId) {
            where.exam = {
                semesterId,
            };
        }

        if (departmentId) {
            where.exam = {
                ...where.exam,
                semester: {
                    departmentId,
                },
            };
        }

        if (academicYearId) {
            where.exam = {
                ...where.exam,
                semester: {
                    ...where.exam?.semester,
                    academicYearId,
                },
            };
        }

        const [
            totalResults,
            passCount,
            failCount,
            avgSpi,
            avgCpi,
            topSpiResult,
            topCpiResult,
        ] = await Promise.all([
            prisma.examResult.count({ where }),
            prisma.examResult.count({
                where: { ...where, status: ResultStatus.PASS },
            }),
            prisma.examResult.count({
                where: { ...where, status: ResultStatus.FAIL },
            }),
            prisma.examResult.aggregate({
                where,
                _avg: {
                    spi: true,
                },
            }),
            prisma.examResult.aggregate({
                where,
                _avg: {
                    cpi: true,
                },
            }),
            prisma.examResult.findFirst({
                where,
                orderBy: { spi: "desc" },
                include: {
                    student: {
                        select: {
                            id: true,
                            fullName: true,
                            enrollmentNumber: true,
                        },
                    },
                },
            }),
            prisma.examResult.findFirst({
                where,
                orderBy: { cpi: "desc" },
                include: {
                    student: {
                        select: {
                            id: true,
                            fullName: true,
                            enrollmentNumber: true,
                        },
                    },
                },
            }),
        ]);

        return {
            totalResults,
            passCount,
            failCount,
            passPercentage:
                totalResults > 0
                    ? ((passCount / totalResults) * 100).toFixed(2)
                    : "0.00",
            failPercentage:
                totalResults > 0
                    ? ((failCount / totalResults) * 100).toFixed(2)
                    : "0.00",
            averageSpi: avgSpi._avg.spi
                ? parseFloat(avgSpi._avg.spi.toFixed(2))
                : 0,
            averageCpi: avgCpi._avg.cpi
                ? parseFloat(avgCpi._avg.cpi.toFixed(2))
                : 0,
            topSpiResult,
            topCpiResult,
        };
    }
}

export const examResultService = new ExamResultService();
