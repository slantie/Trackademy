/**
 * @file src/services/faculty.service.ts
 * @description Enhanced service layer for managing faculty profiles with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Faculty, Designation, Role } from "@prisma/client";
import { hashPassword } from "../utils/hash";

interface FacultyCreateData {
    email: string;
    password: string;
    fullName: string;
    designation: Designation;
    abbreviation?: string;
    joiningDate?: string | null;
    departmentId: string;
}

type FacultyUpdateData = Partial<
    Omit<FacultyCreateData, "email" | "password" | "departmentId">
> & { isDeleted?: boolean };

interface FacultyQueryOptions {
    departmentId?: string;
    designation?: Designation;
    search?: string;
    includeDeleted?: boolean;
}

class FacultyService {
    public async create(data: FacultyCreateData): Promise<Faculty> {
        // Validate department exists
        const department = await prisma.department.findUnique({
            where: { id: data.departmentId, isDeleted: false },
        });
        if (!department) {
            throw new AppError("Department not found.", 400);
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new AppError("A user with this email already exists.", 409);
        }

        const hashedPassword = await hashPassword(data.password);

        return prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    role: Role.FACULTY,
                },
            });

            return tx.faculty.create({
                data: {
                    userId: newUser.id,
                    fullName: data.fullName,
                    designation: data.designation,
                    abbreviation: data.abbreviation,
                    joiningDate: data.joiningDate
                        ? new Date(data.joiningDate)
                        : null,
                    departmentId: data.departmentId,
                },
                include: {
                    department: {
                        select: {
                            id: true,
                            name: true,
                            abbreviation: true,
                        },
                    },
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });
        });
    }

    public async getAll(options: FacultyQueryOptions = {}) {
        const {
            departmentId,
            designation,
            search,
            includeDeleted = false,
        } = options;

        const where: any = {};
        if (!includeDeleted) where.isDeleted = false;
        if (departmentId) where.departmentId = departmentId;
        if (designation) where.designation = designation;
        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: "insensitive" } },
                { abbreviation: { contains: search, mode: "insensitive" } },
                { user: { email: { contains: search, mode: "insensitive" } } },
            ];
        }

        const faculties = await prisma.faculty.findMany({
            where,
            include: {
                department: {
                    select: { id: true, name: true, abbreviation: true },
                },
                user: { select: { id: true, email: true, role: true } },
            },
            orderBy: { fullName: "asc" },
        });

        return { data: faculties };
    }

    public async getCount(options: FacultyQueryOptions = {}) {
        const {
            departmentId,
            designation,
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

        if (designation) {
            where.designation = designation;
        }

        if (search) {
            where.OR = [
                { fullName: { contains: search, mode: "insensitive" } },
                { abbreviation: { contains: search, mode: "insensitive" } },
                { user: { email: { contains: search, mode: "insensitive" } } },
            ];
        }

        const count = await prisma.faculty.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: { departmentId?: string; limit?: number } = {}
    ) {
        const { departmentId, limit = 20 } = options;

        const where: any = {
            isDeleted: false,
            OR: [
                { fullName: { contains: query, mode: "insensitive" } },
                { abbreviation: { contains: query, mode: "insensitive" } },
                { user: { email: { contains: query, mode: "insensitive" } } },
            ],
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        return prisma.faculty.findMany({
            where,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { fullName: "asc" },
            take: limit,
        });
    }

    public async getByDesignation(
        designation: Designation,
        options: { departmentId?: string } = {}
    ) {
        const { departmentId } = options;

        const where: any = {
            designation,
            isDeleted: false,
        };

        if (departmentId) {
            where.departmentId = departmentId;
        }

        return prisma.faculty.findMany({
            where,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { fullName: "asc" },
        });
    }

    public async getGroupedByDesignation(departmentId?: string) {
        const where: any = { isDeleted: false };
        if (departmentId) {
            where.departmentId = departmentId;
        }

        const faculties = await prisma.faculty.findMany({
            where,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { fullName: "asc" },
        });

        // Group by designation
        const grouped = faculties.reduce((acc, faculty) => {
            const designation = faculty.designation;
            if (!acc[designation]) {
                acc[designation] = [];
            }
            acc[designation].push(faculty);
            return acc;
        }, {} as Record<Designation, typeof faculties>);

        return grouped;
    }

    public async getAllByDepartment(departmentId: string): Promise<Faculty[]> {
        return prisma.faculty.findMany({
            where: { departmentId, isDeleted: false },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { fullName: "asc" },
        });
    }

    public async getById(id: string): Promise<Faculty> {
        const faculty = await prisma.faculty.findUnique({
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        if (!faculty) throw new AppError("Faculty not found.", 404);
        return faculty;
    }

    public async getByIdWithRelations(id: string) {
        return this.getById(id);
    }

    public async update(id: string, data: FacultyUpdateData): Promise<Faculty> {
        await this.getById(id);
        return prisma.faculty.update({
            where: { id },
            data: {
                ...data,
                joiningDate: data.joiningDate
                    ? new Date(data.joiningDate)
                    : data.joiningDate,
            },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                        abbreviation: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.faculty.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    public async hardDelete(id: string): Promise<void> {
        const faculty = await prisma.faculty.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!faculty) {
            throw new AppError("Faculty not found.", 404);
        }

        await prisma.$transaction(async (tx) => {
            await tx.faculty.delete({ where: { id } });
            if (faculty.userId) {
                await tx.user.delete({ where: { id: faculty.userId } });
            }
        });
    }

    public async restore(id: string): Promise<Faculty> {
        const faculty = await prisma.faculty.findUnique({
            where: { id },
        });

        if (!faculty) {
            throw new AppError("Faculty not found.", 404);
        }

        if (!faculty.isDeleted) {
            throw new AppError("Faculty is not deleted.", 400);
        }

        return prisma.faculty.update({
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
                user: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
}

export const facultyService = new FacultyService();
