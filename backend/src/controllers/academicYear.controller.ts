/**
 * @file src/controllers/academicYear.controller.ts
 * @description Controller for handling academic year-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { academicYearService } from "../services/academicYear.service";
import AppError from "../utils/appError";

export class AcademicYearController {
    static async createAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newAcademicYear = await academicYearService.create(req.body);
            res.status(201).json({
                status: "success",
                data: {
                    academicYear: newAcademicYear,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllAcademicYears(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const collegeId = req.query.collegeId as string;
            const academicYears = await academicYearService.getAllByCollege(
                collegeId
            );
            res.status(200).json({
                status: "success",
                results: academicYears.length,
                data: {
                    academicYears,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getActiveAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const collegeId = req.query.collegeId as string;
            const activeYear = await academicYearService.getActiveByCollege(
                collegeId
            );
            if (!activeYear) {
                throw new AppError(
                    "No active academic year found for this college.",
                    404
                );
            }
            res.status(200).json({
                status: "success",
                data: {
                    academicYear: activeYear,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAcademicYearById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const academicYear = await academicYearService.getById(
                req.params.id
            );
            res.status(200).json({
                status: "success",
                data: {
                    academicYear,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedAcademicYear = await academicYearService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: {
                    academicYear: updatedAcademicYear,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await academicYearService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
