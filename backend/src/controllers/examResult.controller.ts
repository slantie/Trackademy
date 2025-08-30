/**
 * @file src/controllers/examResult.controller.ts
 * @description Enhanced controller for handling exam result API requests with comprehensive CRUD operations.
 */

import { Request, Response, NextFunction } from "express";
import { examResultService } from "../services/examResult.service";
import AppError from "../utils/appError";
import { Role, ResultStatus } from "@prisma/client";
import { prisma } from "../config/prisma.service";

export class ExamResultController {
    static async createExamResult(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newResult = await examResultService.create(req.body);
            res.status(201).json({
                status: "success",
                message: "Exam result created successfully",
                data: { examResult: newResult },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllExamResults(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
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
            } = req.query;

            const options = {
                examId: examId as string,
                studentId: studentId as string,
                studentEnrollmentNumber: studentEnrollmentNumber as string,
                status: status as ResultStatus,
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                academicYearId: academicYearId as string,
                search: search as string,
                minSpi: minSpi ? parseFloat(minSpi as string) : undefined,
                maxSpi: maxSpi ? parseFloat(maxSpi as string) : undefined,
                minCpi: minCpi ? parseFloat(minCpi as string) : undefined,
                maxCpi: maxCpi ? parseFloat(maxCpi as string) : undefined,
            };

            const result = await examResultService.getAll(options);
            res.status(200).json({
                status: "success",
                message: "Exam results retrieved successfully",
                results: result.data.length,
                data: { examResults: result.data },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamResultCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
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
            } = req.query;

            const options = {
                examId: examId as string,
                studentId: studentId as string,
                studentEnrollmentNumber: studentEnrollmentNumber as string,
                status: status as ResultStatus,
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                academicYearId: academicYearId as string,
                search: search as string,
                minSpi: minSpi ? parseFloat(minSpi as string) : undefined,
                maxSpi: maxSpi ? parseFloat(maxSpi as string) : undefined,
                minCpi: minCpi ? parseFloat(minCpi as string) : undefined,
                maxCpi: maxCpi ? parseFloat(maxCpi as string) : undefined,
            };

            const result = await examResultService.getCount(options);
            res.status(200).json({
                status: "success",
                message: "Exam result count retrieved successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    static async searchExamResults(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { q, examId, semesterId, departmentId, status, limit } =
                req.query;

            if (!q) {
                res.status(400).json({
                    status: "error",
                    message: "Search query is required",
                });
                return;
            }

            const options = {
                examId: examId as string,
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                status: status as ResultStatus,
                limit: limit ? parseInt(limit as string) : undefined,
            };

            const results = await examResultService.search(
                q as string,
                options
            );
            res.status(200).json({
                status: "success",
                message: "Exam result search completed successfully",
                results: results.length,
                data: { examResults: results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamResultsByStatus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { status } = req.params;
            const { examId, semesterId, departmentId, limit } = req.query;

            const options = {
                examId: examId as string,
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                limit: limit ? parseInt(limit as string) : undefined,
            };

            const results = await examResultService.getByStatus(
                status as ResultStatus,
                options
            );
            res.status(200).json({
                status: "success",
                message: `Exam results with status '${status}' retrieved successfully`,
                results: results.length,
                data: { examResults: results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getTopPerformers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { examId, semesterId, departmentId, limit, byField } =
                req.query;

            const options = {
                examId: examId as string,
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                limit: limit ? parseInt(limit as string) : undefined,
                byField: byField as "spi" | "cpi",
            };

            const results = await examResultService.getTopPerformers(options);
            res.status(200).json({
                status: "success",
                message: "Top performers retrieved successfully",
                results: results.length,
                data: { examResults: results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamResultsByExam(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { examId } = req.params;
            const results = await examResultService.getByExam(examId);
            res.status(200).json({
                status: "success",
                message: "Exam results retrieved successfully",
                results: results.length,
                data: { examResults: results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamResultsByStudent(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { studentId } = req.params;
            const results = await examResultService.getByStudent(studentId);
            res.status(200).json({
                status: "success",
                message: "Student exam results retrieved successfully",
                results: results.length,
                data: { examResults: results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamResultsByStudentEnrollment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { enrollmentNumber } = req.params;
            const results = await examResultService.getByStudentEnrollment(
                enrollmentNumber
            );
            res.status(200).json({
                status: "success",
                message: "Student exam results retrieved successfully",
                results: results.length,
                data: { examResults: results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamResultsBySemester(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { semesterId } = req.params;
            const { departmentId, status, limit } = req.query;

            const options = {
                departmentId: departmentId as string,
                status: status as ResultStatus,
                limit: limit ? parseInt(limit as string) : undefined,
            };

            const results = await examResultService.getBySemester(
                semesterId,
                options
            );
            res.status(200).json({
                status: "success",
                message: "Semester exam results retrieved successfully",
                results: results.length,
                data: { examResults: results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamResultsByDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { departmentId } = req.params;
            const { academicYearId, semesterId, status, limit } = req.query;

            const options = {
                academicYearId: academicYearId as string,
                semesterId: semesterId as string,
                status: status as ResultStatus,
                limit: limit ? parseInt(limit as string) : undefined,
            };

            const results = await examResultService.getByDepartment(
                departmentId,
                options
            );
            res.status(200).json({
                status: "success",
                message: "Department exam results retrieved successfully",
                results: results.length,
                data: { examResults: results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getResults(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = (req as any).user;
            let results;

            if (user.role === Role.ADMIN || user.role === Role.FACULTY) {
                const { examId } = req.query;
                if (!examId)
                    throw new AppError(
                        "Exam ID is required for this role.",
                        400
                    );
                results = await examResultService.getByExam(examId as string);
            } else {
                const studentProfile = await prisma.student.findUnique({
                    where: { userId: user.userId },
                });
                if (!studentProfile)
                    throw new AppError(
                        "Student profile not found for the logged-in user.",
                        404
                    );
                results = await examResultService.getByStudent(
                    studentProfile.id
                );
            }

            res.status(200).json({
                status: "success",
                message: "Results retrieved successfully",
                results: results.length,
                data: { results },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getResultById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = (req as any).user;
            const resultId = req.params.id;
            const result = await examResultService.getById(resultId);

            if (user.role === Role.STUDENT) {
                const studentProfile = await prisma.student.findUnique({
                    where: { userId: user.userId },
                });
                if (result.studentId !== studentProfile?.id) {
                    throw new AppError(
                        "You are not authorized to view this result.",
                        403
                    );
                }
            }

            res.status(200).json({
                status: "success",
                message: "Exam result retrieved successfully",
                data: { result },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateExamResult(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedResult = await examResultService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                message: "Exam result updated successfully",
                data: { examResult: updatedResult },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteExamResult(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await examResultService.delete(req.params.id);
            res.status(200).json({
                status: "success",
                message: "Exam result deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    static async getStatistics(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { examId, semesterId, departmentId, academicYearId } =
                req.query;

            const options = {
                examId: examId as string,
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                academicYearId: academicYearId as string,
            };

            const statistics = await examResultService.getStatistics(options);
            res.status(200).json({
                status: "success",
                message: "Exam result statistics retrieved successfully",
                data: { statistics },
            });
        } catch (error) {
            next(error);
        }
    }
}
