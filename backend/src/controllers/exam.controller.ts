/**
 * @file src/controllers/exam.controller.ts
 * @description Controller for handling exam-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { examService } from "../services/exam.service";

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
            const semesterId = req.query.semesterId as string;
            const exams = await examService.getBySemester(semesterId);
            res.status(200).json({
                status: "success",
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
            res.status(200).json({ status: "success", data: { exam } });
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
                data: { exam: updatedExam },
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
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
