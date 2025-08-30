/**
 * @file src/controllers/exam.controller.ts
 * @description Enhanced controller for handling exam-related API requests with comprehensive CRUD operations.
 */

import { Request, Response, NextFunction } from "express";
import { examService } from "../services/exam.service";
import { ExamType } from "@prisma/client";

export class ExamController {
    static async createExam(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newExam = await examService.create(req.body);
            res.status(201).json({
                status: "success",
                message: "Exam created successfully",
                data: { exam: newExam },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllExams(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {
                semesterId,
                departmentId,
                academicYearId,
                examType,
                isPublished,
                search,
                includeDeleted,
            } = req.query;

            const options = {
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                academicYearId: academicYearId as string,
                examType: examType as ExamType,
                isPublished:
                    isPublished === "true"
                        ? true
                        : isPublished === "false"
                        ? false
                        : undefined,
                search: search as string,
                includeDeleted: includeDeleted === "true",
            };

            const result = await examService.getAll(options);
            res.status(200).json({
                status: "success",
                message: "Exams retrieved successfully",
                results: result.data.length,
                data: { exams: result.data },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {
                semesterId,
                departmentId,
                academicYearId,
                examType,
                isPublished,
                search,
                includeDeleted,
            } = req.query;

            const options = {
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                academicYearId: academicYearId as string,
                examType: examType as ExamType,
                isPublished:
                    isPublished === "true"
                        ? true
                        : isPublished === "false"
                        ? false
                        : undefined,
                search: search as string,
                includeDeleted: includeDeleted === "true",
            };

            const result = await examService.getCount(options);
            res.status(200).json({
                status: "success",
                message: "Exam count retrieved successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    static async searchExams(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { q, semesterId, departmentId, examType, limit } = req.query;

            if (!q) {
                res.status(400).json({
                    status: "error",
                    message: "Search query is required",
                });
                return;
            }

            const options = {
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                examType: examType as ExamType,
                limit: limit ? parseInt(limit as string) : undefined,
            };

            const exams = await examService.search(q as string, options);
            res.status(200).json({
                status: "success",
                message: "Exam search completed successfully",
                results: exams.length,
                data: { exams },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamsByType(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { examType } = req.params;
            const { semesterId, departmentId, limit } = req.query;

            const options = {
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                limit: limit ? parseInt(limit as string) : undefined,
            };

            const exams = await examService.getByExamType(
                examType as ExamType,
                options
            );
            res.status(200).json({
                status: "success",
                message: `Exams of type '${examType}' retrieved successfully`,
                results: exams.length,
                data: { exams },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getPublishedExams(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { semesterId, departmentId, limit } = req.query;

            const options = {
                semesterId: semesterId as string,
                departmentId: departmentId as string,
                limit: limit ? parseInt(limit as string) : undefined,
            };

            const exams = await examService.getPublishedExams(options);
            res.status(200).json({
                status: "success",
                message: "Published exams retrieved successfully",
                results: exams.length,
                data: { exams },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamsBySemester(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { semesterId } = req.params;
            const exams = await examService.getBySemester(semesterId);
            res.status(200).json({
                status: "success",
                message: "Exams retrieved successfully",
                results: exams.length,
                data: { exams },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamsByDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { departmentId } = req.params;
            const { academicYearId, limit } = req.query;

            const options = {
                academicYearId: academicYearId as string,
                limit: limit ? parseInt(limit as string) : undefined,
            };

            const exams = await examService.getByDepartment(
                departmentId,
                options
            );
            res.status(200).json({
                status: "success",
                message: "Exams retrieved successfully",
                results: exams.length,
                data: { exams },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getExamById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const exam = await examService.getById(req.params.id);
            res.status(200).json({
                status: "success",
                message: "Exam retrieved successfully",
                data: { exam },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateExam(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedExam = await examService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                message: "Exam updated successfully",
                data: { exam: updatedExam },
            });
        } catch (error) {
            next(error);
        }
    }

    static async publishExam(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const exam = await examService.publish(req.params.id);
            res.status(200).json({
                status: "success",
                message: "Exam published successfully",
                data: { exam },
            });
        } catch (error) {
            next(error);
        }
    }

    static async unpublishExam(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const exam = await examService.unpublish(req.params.id);
            res.status(200).json({
                status: "success",
                message: "Exam unpublished successfully",
                data: { exam },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteExam(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await examService.delete(req.params.id);
            res.status(200).json({
                status: "success",
                message: "Exam deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    static async hardDeleteExam(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await examService.hardDelete(req.params.id);
            res.status(200).json({
                status: "success",
                message: "Exam permanently deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    static async restoreExam(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const exam = await examService.restore(req.params.id);
            res.status(200).json({
                status: "success",
                message: "Exam restored successfully",
                data: { exam },
            });
        } catch (error) {
            next(error);
        }
    }
}
