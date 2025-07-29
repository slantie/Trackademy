/**
 * @file src/controllers/subject.controller.ts
 * @description Controller for handling subject-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { subjectService } from "../services/subject.service";

export class SubjectController {
    static async createSubject(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newSubject = await subjectService.create(req.body);
            res.status(201).json({
                status: "success",
                data: {
                    subject: newSubject,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllSubjects(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semesterId = req.query.semesterId as string;
            const subjects = await subjectService.getAllBySemester(semesterId);
            res.status(200).json({
                status: "success",
                results: subjects.length,
                data: {
                    subjects,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSubjectById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const subject = await subjectService.getById(req.params.id);
            res.status(200).json({
                status: "success",
                data: {
                    subject,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateSubject(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedSubject = await subjectService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: {
                    subject: updatedSubject,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteSubject(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await subjectService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
