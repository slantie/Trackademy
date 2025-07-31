/**
 * @file src/services/subject.service.ts
 * @description Service layer for master subject-related business logic.
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

class SubjectService {
    public async create(data: SubjectCreateData): Promise<Subject> {
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

        return prisma.subject.create({ data });
    }

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
            orderBy: { name: "asc" },
        });
    }

    public async getById(id: string): Promise<Subject> {
        const subject = await prisma.subject.findUnique({
            where: { id, isDeleted: false },
        });

        if (!subject) {
            throw new AppError("Subject not found.", 404);
        }
        return subject;
    }

    public async update(id: string, data: SubjectUpdateData): Promise<Subject> {
        await this.getById(id);
        return prisma.subject.update({ where: { id }, data });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.subject.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const subjectService = new SubjectService();
