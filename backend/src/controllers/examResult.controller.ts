/**
 * @file src/controllers/examResult.controller.ts
 * @description Controller for handling exam result API requests.
 */

import { Request, Response, NextFunction } from "express";
import { examResultService } from "../services/examResult.service";
import AppError from "../utils/appError";
import { Role } from "@prisma/client";
import { prisma } from "../config/prisma.service";

export class ExamResultController {
    static async getResults(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const user = (req as any).user; // This is the JWTPayload
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
                // Student role
                // FIX: Use user.userId from the JWT payload, not user.id
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
            const user = (req as any).user; // This is the JWTPayload
            const resultId = req.params.id;
            const result = await examResultService.getById(resultId);

            // Authorization check: Ensure students can only access their own results
            if (user.role === Role.STUDENT) {
                // FIX: Use user.userId from the JWT payload, not user.id
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

            res.status(200).json({ status: "success", data: { result } });
        } catch (error) {
            next(error);
        }
    }
}
