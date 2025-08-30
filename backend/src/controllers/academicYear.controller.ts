/**
 * @file src/controllers/academicYear.controller.ts
 * @description Enhanced controller for handling academic year-related API requests with comprehensive CRUD operations.
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
            const isActive = req.query.isActive
                ? req.query.isActive === "true"
                : undefined;
            const search = req.query.search as string;
            const includeDeleted = req.query.includeDeleted === "true";

            const result = await academicYearService.getAll({
                collegeId,
                isActive,
                search,
                includeDeleted,
            });

            res.status(200).json({
                status: "success",
                results: result.data.length,
                data: {
                    academicYears: result.data,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllAcademicYearsByCollege(
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

    static async getActiveAcademicYears(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const collegeId = req.query.collegeId as string;
            const activeYears = await academicYearService.getActiveYears(
                collegeId
            );
            res.status(200).json({
                status: "success",
                results: activeYears.length,
                data: {
                    academicYears: activeYears,
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

    static async getAcademicYearCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const collegeId = req.query.collegeId as string;
            const isActive = req.query.isActive
                ? req.query.isActive === "true"
                : undefined;
            const search = req.query.search as string;
            const includeDeleted = req.query.includeDeleted === "true";

            const result = await academicYearService.getCount({
                collegeId,
                isActive,
                search,
                includeDeleted,
            });

            res.status(200).json({
                status: "success",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    static async searchAcademicYears(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const query = req.query.q as string;
            const collegeId = req.query.collegeId as string;
            const limit = parseInt(req.query.limit as string) || 20;

            if (!query) {
                throw new AppError("Search query is required", 400);
            }

            const academicYears = await academicYearService.search(query, {
                collegeId,
                limit,
            });

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

    static async activateAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const academicYear = await academicYearService.activate(
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

    static async deactivateAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const academicYear = await academicYearService.deactivate(
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

    static async hardDeleteAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await academicYearService.hardDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async restoreAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const academicYear = await academicYearService.restore(
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
}
