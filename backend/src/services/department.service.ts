/**
 * @file src/services/department.service.ts
 * @description Enhanced service layer for department-related business logic with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Department } from "@prisma/client";

interface DepartmentCreateData {
    name: string;
    abbreviation: string;
    collegeId: string;
}

type DepartmentUpdateData = Partial<Omit<DepartmentCreateData, "collegeId">> & {
    isDeleted?: boolean;
};

interface DepartmentQueryOptions {
    collegeId?: string;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: "name" | "abbreviation" | "createdAt";
    sortOrder?: "asc" | "desc";
}

interface DepartmentWithRelations extends Department {
    college?: any;
    subjects?: any[];
    faculties?: any[];
    semesters?: any[];
    students?: any[];
    _count?: {
        subjects: number;
        faculties: number;
        semesters: number;
        students: number;
    };
}

class DepartmentService {
    /**
     * Creates a new department.
     * @param data - The data for the new department.
     * @returns The newly created department.
     */
    public async create(data: DepartmentCreateData): Promise<Department> {
        // Check if college exists
        const college = await prisma.college.findUnique({
            where: { id: data.collegeId, isDeleted: false },
        });
        if (!college) {
            throw new AppError("College not found.", 404);
        }

        const existingDepartment = await prisma.department.findUnique({
            where: {
                collegeId_name: {
                    collegeId: data.collegeId,
                    name: data.name,
                },
            },
        });

        if (existingDepartment && !existingDepartment.isDeleted) {
            throw new AppError(
                "A department with this name already exists in this college.",
                409
            );
        }

        // If there's a soft-deleted department with the same name, restore it
        if (existingDepartment && existingDepartment.isDeleted) {
            return prisma.department.update({
                where: { id: existingDepartment.id },
                data: {
                    ...data,
                    isDeleted: false,
                },
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
                            subjects: { where: { isDeleted: false } },
                            faculties: { where: { isDeleted: false } },
                            semesters: { where: { isDeleted: false } },
                            students: { where: { isDeleted: false } },
                        },
                    },
                },
            });
        }

        return prisma.department.create({
            data,
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
                        subjects: { where: { isDeleted: false } },
                        faculties: { where: { isDeleted: false } },
                        semesters: { where: { isDeleted: false } },
                        students: { where: { isDeleted: false } },
                    },
                },
            },
        });
    }

    public async getAll(options: DepartmentQueryOptions = {}) {
        const {
            collegeId,
            search,
            includeDeleted = false,
            sortBy = "name",
            sortOrder = "asc",
        } = options;

        const where: any = {};

        if (!includeDeleted) {
            where.isDeleted = false;
        }

        if (collegeId) {
            where.collegeId = collegeId;
        }

        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    abbreviation: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    college: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ];
        }

        const orderBy: any = {};
        if (
            sortBy === "name" ||
            sortBy === "abbreviation" ||
            sortBy === "createdAt"
        ) {
            orderBy[sortBy] = sortOrder;
        } else {
            orderBy.name = "asc";
        }

        const departments = await prisma.department.findMany({
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
                        subjects: { where: { isDeleted: false } },
                        faculties: { where: { isDeleted: false } },
                        semesters: { where: { isDeleted: false } },
                        students: { where: { isDeleted: false } },
                    },
                },
            },
            orderBy,
        });

        return { data: departments };
    }

    public async getCount(options: DepartmentQueryOptions = {}) {
        const { collegeId, search, includeDeleted = false } = options;

        const where: any = {};

        if (!includeDeleted) {
            where.isDeleted = false;
        }

        if (collegeId) {
            where.collegeId = collegeId;
        }

        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    abbreviation: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    college: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ];
        }

        const count = await prisma.department.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: {
            collegeId?: string;
            limit?: number;
        } = {}
    ) {
        const { collegeId, limit = 20 } = options;

        const where: any = {
            isDeleted: false,
            OR: [
                {
                    name: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    abbreviation: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    college: {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        };

        if (collegeId) {
            where.collegeId = collegeId;
        }

        return prisma.department.findMany({
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
                        subjects: { where: { isDeleted: false } },
                        faculties: { where: { isDeleted: false } },
                        semesters: { where: { isDeleted: false } },
                        students: { where: { isDeleted: false } },
                    },
                },
            },
            orderBy: { name: "asc" },
            take: limit,
        });
    }

    /**
     * Retrieves all departments for a specific college.
     * @param collegeId - The ID of the college.
     * @returns A list of departments for the college.
     */
    public async getAllByCollege(collegeId: string): Promise<Department[]> {
        return prisma.department.findMany({
            where: { collegeId, isDeleted: false },
            include: {
                college: true,
                _count: {
                    select: {
                        subjects: { where: { isDeleted: false } },
                        faculties: { where: { isDeleted: false } },
                        semesters: { where: { isDeleted: false } },
                        students: { where: { isDeleted: false } },
                    },
                },
            },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Retrieves a count of departments for a specific college.
     * @param collegeId - The ID of the college.
     * @returns The count of departments.
     */
    public async getCountByCollege(collegeId: string): Promise<number> {
        return prisma.department.count({
            where: { collegeId, isDeleted: false },
        });
    }

    /**
     * Retrieves the total count of all departments.
     * @returns The total count of departments.
     */
    public async getTotalCount(): Promise<number> {
        return prisma.department.count({
            where: { isDeleted: false },
        });
    }

    /**
     * Retrieves a single department by its ID.
     * @param id - The ID of the department to retrieve.
     * @returns The requested department.
     */
    public async getById(id: string): Promise<DepartmentWithRelations> {
        const department = await prisma.department.findUnique({
            where: { id, isDeleted: false },
            include: {
                college: true,
                _count: {
                    select: {
                        subjects: { where: { isDeleted: false } },
                        faculties: { where: { isDeleted: false } },
                        semesters: { where: { isDeleted: false } },
                        students: { where: { isDeleted: false } },
                    },
                },
            },
        });

        if (!department) {
            throw new AppError("Department not found.", 404);
        }
        return department;
    }

    /**
     * Retrieves a department with all its related data.
     * @param id - The ID of the department.
     * @returns The department with full relations.
     */
    public async getByIdWithRelations(
        id: string
    ): Promise<DepartmentWithRelations> {
        const department = await prisma.department.findUnique({
            where: { id, isDeleted: false },
            include: {
                college: true,
                subjects: {
                    where: { isDeleted: false },
                    orderBy: { name: "asc" },
                },
                faculties: {
                    where: { isDeleted: false },
                    orderBy: { fullName: "asc" },
                },
                semesters: {
                    where: { isDeleted: false },
                    include: {
                        academicYear: true,
                    },
                    orderBy: [
                        { academicYear: { year: "desc" } },
                        { semesterNumber: "asc" },
                    ],
                },
                students: {
                    where: { isDeleted: false },
                    take: 10, // Limit to avoid too much data
                    orderBy: { fullName: "asc" },
                },
                _count: {
                    select: {
                        subjects: { where: { isDeleted: false } },
                        faculties: { where: { isDeleted: false } },
                        semesters: { where: { isDeleted: false } },
                        students: { where: { isDeleted: false } },
                    },
                },
            },
        });

        if (!department) {
            throw new AppError("Department not found.", 404);
        }
        return department;
    }

    /**
     * Updates an existing department.
     * @param id - The ID of the department to update.
     * @param data - The data to update the department with.
     * @returns The updated department.
     */
    public async update(
        id: string,
        data: DepartmentUpdateData
    ): Promise<Department> {
        await this.getById(id);

        // If updating name, check for conflicts
        if (data.name) {
            const department = await prisma.department.findUnique({
                where: { id },
            });

            const existingDepartment = await prisma.department.findUnique({
                where: {
                    collegeId_name: {
                        collegeId: department!.collegeId,
                        name: data.name,
                    },
                },
            });

            if (
                existingDepartment &&
                existingDepartment.id !== id &&
                !existingDepartment.isDeleted
            ) {
                throw new AppError(
                    "A department with this name already exists in this college.",
                    409
                );
            }
        }

        return prisma.department.update({
            where: { id },
            data,
        });
    }

    /**
     * Soft deletes a department by setting its `isDeleted` flag to true.
     * @param id - The ID of the department to delete.
     */
    public async delete(id: string): Promise<void> {
        const department = await this.getById(id);

        // Check if department has related data
        const relatedCount = await prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        subjects: { where: { isDeleted: false } },
                        faculties: { where: { isDeleted: false } },
                        semesters: { where: { isDeleted: false } },
                        students: { where: { isDeleted: false } },
                    },
                },
            },
        });

        const totalRelated =
            relatedCount!._count.subjects +
            relatedCount!._count.faculties +
            relatedCount!._count.semesters +
            relatedCount!._count.students;

        if (totalRelated > 0) {
            throw new AppError(
                "Cannot delete department. It has associated subjects, faculties, semesters, or students. Please remove or transfer them first.",
                400
            );
        }

        await prisma.department.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    /**
     * Permanently deletes a department and all its related data.
     * @param id - The ID of the department to hard delete.
     */
    public async hardDelete(id: string): Promise<void> {
        await this.getById(id);

        // Delete in correct order due to foreign key constraints
        await prisma.$transaction(async (tx) => {
            // Delete students first
            await tx.student.deleteMany({
                where: { departmentId: id },
            });

            // Delete faculties
            await tx.faculty.deleteMany({
                where: { departmentId: id },
            });

            // Delete semesters
            await tx.semester.deleteMany({
                where: { departmentId: id },
            });

            // Delete subjects
            await tx.subject.deleteMany({
                where: { departmentId: id },
            });

            // Finally delete the department
            await tx.department.delete({
                where: { id },
            });
        });
    }
}

export const departmentService = new DepartmentService();
