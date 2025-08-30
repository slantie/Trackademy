/**
 * @file src/services/student.service.ts
 * @description Enhanced service layer for managing student profiles and associated user accounts with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Student } from "@prisma/client";
import { hashPassword } from "../utils/hash";

interface StudentCreateData {
    email: string;
    password: string;
    fullName: string;
    enrollmentNumber: string;
    batch: string;
    departmentId: string;
    semesterId: string;
    divisionId: string;
}

type StudentUpdateData = Partial<
    Omit<StudentCreateData, "email" | "password" | "enrollmentNumber">
> & { isDeleted?: boolean };

interface StudentQueryOptions {
    page?: number;
    limit?: number;
    departmentId?: string;
    semesterId?: string;
    divisionId?: string;
    batch?: string;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: "fullName" | "enrollmentNumber" | "batch" | "createdAt";
    sortOrder?: "asc" | "desc";
}

class StudentService {
    public async create(data: StudentCreateData): Promise<Student> {
        // Validate department exists
        const department = await prisma.department.findUnique({
            where: { id: data.departmentId, isDeleted: false },
        });
        if (!department) {
            throw new AppError("Department not found.", 400);
        }

        // Validate semester exists
        const semester = await prisma.semester.findUnique({
            where: { id: data.semesterId, isDeleted: false },
        });
        if (!semester) {
            throw new AppError("Semester not found.", 400);
        }

        // Validate division exists
        const division = await prisma.division.findUnique({
            where: { id: data.divisionId, isDeleted: false },
        });
        if (!division) {
            throw new AppError("Division not found.", 400);
        }

        // Check for existing user with email
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new AppError("A user with this email already exists.", 409);
        }

        // Check for existing student with enrollment number
        const existingStudent = await prisma.student.findUnique({
            where: { enrollmentNumber: data.enrollmentNumber },
        });
        if (existingStudent) {
            throw new AppError(
                "A student with this enrollment number already exists.",
                409
            );
        }

        const hashedPassword = await hashPassword(data.password);

        return prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    role: "STUDENT",
                },
            });

            return tx.student.create({
                data: {
                    userId: newUser.id,
                    fullName: data.fullName,
                    enrollmentNumber: data.enrollmentNumber,
                    batch: data.batch,
                    departmentId: data.departmentId,
                    semesterId: data.semesterId,
                    divisionId: data.divisionId,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
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
                    division: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
        });
    }

    public async getAll(options: StudentQueryOptions = {}) {
        const {
            departmentId,
            semesterId,
            divisionId,
            batch,
            search,
            includeDeleted = false,
            sortBy = "enrollmentNumber",
            sortOrder = "asc",
        } = options;

        const where: any = {};
        if (!includeDeleted) where.isDeleted = false;
        if (departmentId) where.departmentId = departmentId;
        if (semesterId) where.semesterId = semesterId;
        if (divisionId) where.divisionId = divisionId;
        if (batch) where.batch = batch;
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: "insensitive" } },
                { enrollmentNumber: { contains: search, mode: "insensitive" } },
                { user: { email: { contains: search, mode: "insensitive" } } },
                { batch: { contains: search, mode: "insensitive" } },
            ];
        }

        const orderBy: any = {};
        if (
            ["fullName", "enrollmentNumber", "batch", "createdAt"].includes(
                sortBy
            )
        )
            orderBy[sortBy] = sortOrder;
        else orderBy.enrollmentNumber = "asc";

        const students = await prisma.student.findMany({
            where,
            include: {
                user: { select: { id: true, email: true, role: true } },
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
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        ExamResult: true,
                        Attendance: true,
                    },
                },
            },
            orderBy,
        });

        return { data: students };
    }

    public async getCount(
        options: Omit<StudentQueryOptions, "page" | "limit"> = {}
    ) {
        const {
            departmentId,
            semesterId,
            divisionId,
            batch,
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

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (batch) {
            where.batch = batch;
        }

        if (search) {
            where.OR = [
                {
                    fullName: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    enrollmentNumber: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    user: {
                        email: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    batch: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }

        const count = await prisma.student.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: {
            departmentId?: string;
            semesterId?: string;
            divisionId?: string;
            batch?: string;
            limit?: number;
        } = {}
    ) {
        const {
            departmentId,
            semesterId,
            divisionId,
            batch,
            limit = 20,
        } = options;

        const where: any = {
            isDeleted: false,
            OR: [
                {
                    fullName: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    enrollmentNumber: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    user: {
                        email: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    batch: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (batch) {
            where.batch = batch;
        }

        return prisma.student.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                enrollmentNumber: "asc",
            },
            take: limit,
        });
    }

    public async getByDepartment(
        departmentId: string,
        options: {
            semesterId?: string;
            divisionId?: string;
            batch?: string;
            limit?: number;
        } = {}
    ) {
        const { semesterId, divisionId, batch, limit = 100 } = options;

        const where: any = {
            departmentId,
            isDeleted: false,
        };

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (batch) {
            where.batch = batch;
        }

        return prisma.student.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
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
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                enrollmentNumber: "asc",
            },
            take: limit,
        });
    }

    public async getBySemester(
        semesterId: string,
        options: {
            departmentId?: string;
            divisionId?: string;
            batch?: string;
            limit?: number;
        } = {}
    ) {
        const { departmentId, divisionId, batch, limit = 100 } = options;

        const where: any = {
            semesterId,
            isDeleted: false,
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (batch) {
            where.batch = batch;
        }

        return prisma.student.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                enrollmentNumber: "asc",
            },
            take: limit,
        });
    }

    public async getAllByDivision(divisionId: string): Promise<Student[]> {
        return prisma.student.findMany({
            where: { divisionId, isDeleted: false },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                    },
                },
            },
            orderBy: { enrollmentNumber: "asc" },
        });
    }

    public async getByBatch(
        batch: string,
        options: {
            departmentId?: string;
            semesterId?: string;
            divisionId?: string;
            limit?: number;
        } = {}
    ) {
        const { departmentId, semesterId, divisionId, limit = 100 } = options;

        const where: any = {
            batch,
            isDeleted: false,
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        return prisma.student.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                enrollmentNumber: "asc",
            },
            take: limit,
        });
    }

    public async getByEnrollmentNumber(
        enrollmentNumber: string
    ): Promise<Student | null> {
        return prisma.student.findUnique({
            where: { enrollmentNumber },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
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
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        ExamResult: true,
                        Attendance: true,
                    },
                },
            },
        });
    }

    public async getById(id: string): Promise<Student> {
        const student = await prisma.student.findUnique({
            where: { id, isDeleted: false },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
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
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        ExamResult: true,
                        Attendance: true,
                    },
                },
            },
        });

        if (!student) {
            throw new AppError("Student not found.", 404);
        }
        return student;
    }

    public async getByIdWithRelations(id: string) {
        return this.getById(id);
    }

    public async update(id: string, data: StudentUpdateData): Promise<Student> {
        const existingStudent = await prisma.student.findUnique({
            where: { id, isDeleted: false },
        });

        if (!existingStudent) {
            throw new AppError("Student not found.", 404);
        }

        // Validate department if provided
        if (data.departmentId) {
            const department = await prisma.department.findUnique({
                where: { id: data.departmentId, isDeleted: false },
            });
            if (!department) {
                throw new AppError("Department not found.", 400);
            }
        }

        // Validate semester if provided
        if (data.semesterId) {
            const semester = await prisma.semester.findUnique({
                where: { id: data.semesterId, isDeleted: false },
            });
            if (!semester) {
                throw new AppError("Semester not found.", 400);
            }
        }

        // Validate division if provided
        if (data.divisionId) {
            const division = await prisma.division.findUnique({
                where: { id: data.divisionId, isDeleted: false },
            });
            if (!division) {
                throw new AppError("Division not found.", 400);
            }
        }

        return prisma.student.update({
            where: { id },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
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
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    public async delete(id: string): Promise<void> {
        const student = await prisma.student.findUnique({
            where: { id, isDeleted: false },
        });

        if (!student) {
            throw new AppError("Student not found.", 404);
        }

        await prisma.student.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    public async restore(id: string): Promise<Student> {
        const student = await prisma.student.findUnique({
            where: { id },
        });

        if (!student) {
            throw new AppError("Student not found.", 404);
        }

        if (!student.isDeleted) {
            throw new AppError("Student is not deleted.", 400);
        }

        return prisma.student.update({
            where: { id },
            data: { isDeleted: false },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    public async hardDelete(id: string): Promise<void> {
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        ExamResult: true,
                        Attendance: true,
                    },
                },
            },
        });

        if (!student) {
            throw new AppError("Student not found.", 404);
        }

        // Check for dependencies
        if (student._count.ExamResult > 0) {
            throw new AppError(
                `Cannot delete student. Student has ${student._count.ExamResult} exam result(s).`,
                400
            );
        }

        if (student._count.Attendance > 0) {
            throw new AppError(
                `Cannot delete student. Student has ${student._count.Attendance} attendance record(s).`,
                400
            );
        }

        await prisma.$transaction(async (tx) => {
            // Delete the student
            await tx.student.delete({
                where: { id },
            });

            // Delete the associated user
            if (student.userId) {
                await tx.user.delete({
                    where: { id: student.userId },
                });
            }
        });
    }

    public async getStatistics(
        options: {
            departmentId?: string;
            semesterId?: string;
            divisionId?: string;
            batch?: string;
        } = {}
    ) {
        const { departmentId, semesterId, divisionId, batch } = options;

        const where: any = {
            isDeleted: false,
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (batch) {
            where.batch = batch;
        }

        const [
            totalStudents,
            deletedStudents,
            verifiedUsers,
            batchGroups,
            divisionGroups,
        ] = await Promise.all([
            prisma.student.count({ where }),
            prisma.student.count({
                where: {
                    ...where,
                    isDeleted: true,
                },
            }),
            prisma.student.count({
                where: {
                    ...where,
                    user: {},
                },
            }),
            prisma.student.groupBy({
                by: ["batch"],
                where,
                _count: true,
                orderBy: {
                    batch: "asc",
                },
            }),
            prisma.student.groupBy({
                by: ["divisionId"],
                where,
                _count: true,
            }),
        ]);

        return {
            totalStudents,
            deletedStudents,
            verifiedUsers,
            unverifiedUsers: totalStudents - verifiedUsers,
            verificationPercentage:
                totalStudents > 0
                    ? ((verifiedUsers / totalStudents) * 100).toFixed(2)
                    : "0.00",
            batchGroups,
            divisionGroups,
        };
    }
}

export const studentService = new StudentService();
