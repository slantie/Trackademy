/**
 * @file src/services/examResult.service.ts
 * @description Service layer for exam result-related business logic.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { ExamResult } from "@prisma/client";

class ExamResultService {
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
                results: {
                    include: {
                        subject: true,
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
                // FIX: Include the nested data required for the orderBy clause.
                exam: {
                    include: {
                        semester: {
                            include: {
                                academicYear: true,
                            },
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

    /**
     * Retrieves a single, detailed exam result by its ID.
     * @param id - The CUID of the ExamResult record.
     * @returns The detailed exam result.
     */
    public async getById(id: string): Promise<ExamResult> {
        const examResult = await prisma.examResult.findUnique({
            where: { id },
            include: {
                student: true,
                exam: true,
                results: {
                    include: {
                        subject: true,
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
}

export const examResultService = new ExamResultService();
