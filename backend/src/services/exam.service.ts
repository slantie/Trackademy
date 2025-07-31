/**
 * @file src/services/exam.service.ts
 * @description Service layer for exam-related business logic.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Exam, ExamType } from "@prisma/client";

interface ExamCreateData {
    name: string;
    examType: ExamType;
    semesterId: string;
}

type ExamUpdateData = Partial<
    Omit<ExamCreateData, "semesterId" | "examType">
> & { isPublished?: boolean; isDeleted?: boolean };

class ExamService {
    public async create(data: ExamCreateData): Promise<Exam> {
        const existingExam = await prisma.exam.findUnique({
            where: {
                semesterId_examType: {
                    semesterId: data.semesterId,
                    examType: data.examType,
                },
            },
        });

        if (existingExam && !existingExam.isDeleted) {
            throw new AppError(
                `An exam of type '${data.examType}' already exists for this semester.`,
                409
            );
        }

        return prisma.exam.create({ data });
    }

    public async getBySemester(semesterId: string): Promise<Exam[]> {
        return prisma.exam.findMany({
            where: { semesterId, isDeleted: false },
            orderBy: { name: "asc" },
        });
    }

    public async getById(id: string): Promise<Exam> {
        const exam = await prisma.exam.findUnique({
            where: { id, isDeleted: false },
        });
        if (!exam) throw new AppError("Exam not found.", 404);
        return exam;
    }

    public async update(id: string, data: ExamUpdateData): Promise<Exam> {
        await this.getById(id);
        return prisma.exam.update({ where: { id }, data });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.exam.update({ where: { id }, data: { isDeleted: true } });
    }
}

export const examService = new ExamService();
