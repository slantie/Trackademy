/**
 * @file src/services/subject.service.ts
 * @description Service layer for subject-related business logic.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Subject, SubjectType } from "@prisma/client";

interface SubjectCreateData {
    name: string;
    abbreviation: string;
    code: string;
    type: SubjectType;
    semesterNumber: number;
    departmentId: string;
}

type SubjectUpdateData = Partial<Omit<SubjectCreateData, "departmentId">> & {
    isDeleted?: boolean;
};

interface SubjectWithRelations extends Subject {
    department?: any;
    courses?: any[];
    Result?: any[];
    _count?: {
        courses: number;
        Result: number;
    };
}

class SubjectService {
    /**
     * Creates a new subject.
     * @param data - The data for the new subject.
     * @returns The newly created subject.
     */
    public async create(data: SubjectCreateData): Promise<Subject> {
        // Check if department exists
        const department = await prisma.department.findUnique({
            where: { id: data.departmentId, isDeleted: false },
        });
        if (!department) {
            throw new AppError("Department not found.", 404);
        }

        const existingSubject = await prisma.subject.findUnique({
            where: {
                code_departmentId: {
                    code: data.code,
                    departmentId: data.departmentId,
                },
            },
        });

        if (existingSubject && !existingSubject.isDeleted) {
            throw new AppError(
                "A subject with this code already exists for this department.",
                409
            );
        }

        // If there's a soft-deleted subject with the same code, restore it
        if (existingSubject && existingSubject.isDeleted) {
            return prisma.subject.update({
                where: { id: existingSubject.id },
                data: {
                    ...data,
                    isDeleted: false,
                },
            });
        }

        return prisma.subject.create({ data });
    }

    /**
     * Retrieves all subjects for a specific department.
     * @param departmentId - The ID of the department.
     * @returns A list of subjects for the department.
     */
    public async getAllByDepartment(departmentId: string): Promise<Subject[]> {
        return prisma.subject.findMany({
            where: { departmentId, isDeleted: false },
            include: {
                department: true,
                _count: {
                    select: {
                        courses: { where: { isDeleted: false } },
                        Result: true,
                    },
                },
            },
            orderBy: [{ semesterNumber: "asc" }, { name: "asc" }],
        });
    }

    /**
     * Retrieves subjects by department and semester.
     * @param departmentId - The ID of the department.
     * @param semesterNumber - The semester number.
     * @returns A list of subjects for the department and semester.
     */
    public async getByDepartmentAndSemester(
        departmentId: string,
        semesterNumber: number
    ): Promise<Subject[]> {
        return prisma.subject.findMany({
            where: {
                departmentId,
                semesterNumber,
                isDeleted: false,
            },
            include: {
                department: true,
                _count: {
                    select: {
                        courses: { where: { isDeleted: false } },
                        Result: true,
                    },
                },
            },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Retrieves all subjects across all departments.
     * @returns A list of all subjects.
     */
    public async getAll(): Promise<Subject[]> {
        return prisma.subject.findMany({
            where: { isDeleted: false },
            include: {
                department: {
                    include: {
                        college: true,
                    },
                },
                _count: {
                    select: {
                        courses: { where: { isDeleted: false } },
                        Result: true,
                    },
                },
            },
            orderBy: [
                { department: { college: { name: "asc" } } },
                { department: { name: "asc" } },
                { semesterNumber: "asc" },
                { name: "asc" },
            ],
        });
    }

    /**
     * Retrieves subjects by type.
     * @param type - The subject type (MANDATORY or ELECTIVE).
     * @param departmentId - Optional department ID to filter by.
     * @returns A list of subjects of the specified type.
     */
    public async getByType(
        type: SubjectType,
        departmentId?: string
    ): Promise<Subject[]> {
        const whereClause: any = {
            type,
            isDeleted: false,
        };

        if (departmentId) {
            whereClause.departmentId = departmentId;
        }

        return prisma.subject.findMany({
            where: whereClause,
            include: {
                department: {
                    include: {
                        college: true,
                    },
                },
                _count: {
                    select: {
                        courses: { where: { isDeleted: false } },
                        Result: true,
                    },
                },
            },
            orderBy: [{ semesterNumber: "asc" }, { name: "asc" }],
        });
    }

    /**
     * Retrieves a count of subjects for a specific department.
     * @param departmentId - The ID of the department.
     * @returns The count of subjects.
     */
    public async getCountByDepartment(departmentId: string): Promise<number> {
        return prisma.subject.count({
            where: { departmentId, isDeleted: false },
        });
    }

    /**
     * Retrieves the total count of all subjects.
     * @returns The total count of subjects.
     */
    public async getTotalCount(): Promise<number> {
        return prisma.subject.count({
            where: { isDeleted: false },
        });
    }

    /**
     * Retrieves a count of subjects by semester for a department.
     * @param departmentId - The ID of the department.
     * @returns Object with semester numbers as keys and counts as values.
     */
    public async getCountBySemester(
        departmentId: string
    ): Promise<Record<number, number>> {
        const subjects = await prisma.subject.findMany({
            where: { departmentId, isDeleted: false },
            select: { semesterNumber: true },
        });

        const counts: Record<number, number> = {};
        subjects.forEach((subject) => {
            counts[subject.semesterNumber] =
                (counts[subject.semesterNumber] || 0) + 1;
        });

        return counts;
    }

    /**
     * Retrieves a single subject by its ID.
     * @param id - The ID of the subject to retrieve.
     * @returns The requested subject.
     */
    public async getById(id: string): Promise<SubjectWithRelations> {
        const subject = await prisma.subject.findUnique({
            where: { id, isDeleted: false },
            include: {
                department: {
                    include: {
                        college: true,
                    },
                },
                _count: {
                    select: {
                        courses: { where: { isDeleted: false } },
                        Result: true,
                    },
                },
            },
        });

        if (!subject) {
            throw new AppError("Subject not found.", 404);
        }
        return subject;
    }

    /**
     * Retrieves a subject with all its related data.
     * @param id - The ID of the subject.
     * @returns The subject with full relations.
     */
    public async getByIdWithRelations(
        id: string
    ): Promise<SubjectWithRelations> {
        const subject = await prisma.subject.findUnique({
            where: { id, isDeleted: false },
            include: {
                department: {
                    include: {
                        college: true,
                    },
                },
                courses: {
                    where: { isDeleted: false },
                    include: {
                        faculty: true,
                        semester: true,
                        division: true,
                    },
                    orderBy: { faculty: { fullName: "asc" } },
                },
                Result: {
                    take: 10, // Limit to avoid too much data
                    include: {
                        examResult: {
                            include: {
                                exam: true,
                            },
                        },
                    },
                    orderBy: { examResult: { exam: { examType: "asc" } } },
                },
                _count: {
                    select: {
                        courses: { where: { isDeleted: false } },
                        Result: true,
                    },
                },
            },
        });

        if (!subject) {
            throw new AppError("Subject not found.", 404);
        }
        return subject;
    }

    /**
     * Updates an existing subject.
     * @param id - The ID of the subject to update.
     * @param data - The data to update the subject with.
     * @returns The updated subject.
     */
    public async update(id: string, data: SubjectUpdateData): Promise<Subject> {
        await this.getById(id);

        // If updating code, check for conflicts
        if (data.code) {
            const subject = await prisma.subject.findUnique({
                where: { id },
            });

            const existingSubject = await prisma.subject.findUnique({
                where: {
                    code_departmentId: {
                        code: data.code,
                        departmentId: subject!.departmentId,
                    },
                },
            });

            if (
                existingSubject &&
                existingSubject.id !== id &&
                !existingSubject.isDeleted
            ) {
                throw new AppError(
                    "A subject with this code already exists for this department.",
                    409
                );
            }
        }

        return prisma.subject.update({
            where: { id },
            data,
        });
    }

    /**
     * Soft deletes a subject by setting its `isDeleted` flag to true.
     * @param id - The ID of the subject to delete.
     */
    public async delete(id: string): Promise<void> {
        const subject = await this.getById(id);

        // Check if subject has related data
        const relatedCount = await prisma.subject.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        courses: { where: { isDeleted: false } },
                        Result: true,
                    },
                },
            },
        });

        const totalRelated =
            relatedCount!._count.courses + relatedCount!._count.Result;

        if (totalRelated > 0) {
            throw new AppError(
                "Cannot delete subject. It has associated courses or exam results. Please remove them first.",
                400
            );
        }

        await prisma.subject.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    /**
     * Permanently deletes a subject and all its related data.
     * @param id - The ID of the subject to hard delete.
     */
    public async hardDelete(id: string): Promise<void> {
        await this.getById(id);

        // Delete in correct order due to foreign key constraints
        await prisma.$transaction(async (tx) => {
            // Delete courses first
            await tx.course.deleteMany({
                where: { subjectId: id },
            });

            // Delete results
            await tx.result.deleteMany({
                where: { subjectId: id },
            });

            // Finally delete the subject
            await tx.subject.delete({
                where: { id },
            });
        });
    }

    /**
     * Searches subjects by name, abbreviation, or code.
     * @param searchTerm - The search term.
     * @param departmentId - Optional department ID to filter by.
     * @param semesterNumber - Optional semester number to filter by.
     * @returns A list of matching subjects.
     */
    public async search(
        searchTerm: string,
        departmentId?: string,
        semesterNumber?: number
    ): Promise<Subject[]> {
        const whereClause: any = {
            isDeleted: false,
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { abbreviation: { contains: searchTerm, mode: "insensitive" } },
                { code: { contains: searchTerm, mode: "insensitive" } },
            ],
        };

        if (departmentId) {
            whereClause.departmentId = departmentId;
        }

        if (semesterNumber) {
            whereClause.semesterNumber = semesterNumber;
        }

        return prisma.subject.findMany({
            where: whereClause,
            include: {
                department: {
                    include: {
                        college: true,
                    },
                },
                _count: {
                    select: {
                        courses: { where: { isDeleted: false } },
                        Result: true,
                    },
                },
            },
            orderBy: [{ semesterNumber: "asc" }, { name: "asc" }],
        });
    }

    /**
     * Gets subjects grouped by semester for a department.
     * @param departmentId - The ID of the department.
     * @returns Subjects grouped by semester number.
     */
    public async getGroupedBySemester(
        departmentId: string
    ): Promise<Record<number, Subject[]>> {
        const subjects = await this.getAllByDepartment(departmentId);

        const grouped: Record<number, Subject[]> = {};
        subjects.forEach((subject) => {
            if (!grouped[subject.semesterNumber]) {
                grouped[subject.semesterNumber] = [];
            }
            grouped[subject.semesterNumber].push(subject);
        });

        return grouped;
    }
}

export const subjectService = new SubjectService();
