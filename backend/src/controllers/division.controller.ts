/**
 * @file src/controllers/division.controller.ts
 * @description Enhanced controller for handling division-related API requests with comprehensive CRUD operations.
 */

import { Request, Response, NextFunction } from "express";
import { divisionService } from "../services/division.service";

export class DivisionController {
    static async createDivision(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newDivision = await divisionService.create(req.body);
            res.status(201).json({
                status: "success",
                data: {
                    division: newDivision,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllDivisions(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semesterId = req.query.semesterId as string;
            const departmentId = req.query.departmentId as string;
            const academicYearId = req.query.academicYearId as string;
            const search = req.query.search as string;
            const includeDeleted = req.query.includeDeleted === "true";

            const result = await divisionService.getAll({
                semesterId,
                departmentId,
                academicYearId,
                search,
                includeDeleted,
            });

            res.status(200).json({
                status: "success",
                results: result.data.length,
                data: {
                    divisions: result.data,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDivisionsBySemester(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semesterId = req.query.semesterId as string;
            const divisions = await divisionService.getAllBySemester(
                semesterId
            );
            res.status(200).json({
                status: "success",
                results: divisions.length,
                data: {
                    divisions,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDivisionById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const division = await divisionService.getById(req.params.id);
            res.status(200).json({
                status: "success",
                data: {
                    division,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDivisionCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semesterId = req.query.semesterId as string;
            const departmentId = req.query.departmentId as string;
            const academicYearId = req.query.academicYearId as string;
            const search = req.query.search as string;
            const includeDeleted = req.query.includeDeleted === "true";

            const result = await divisionService.getCount({
                semesterId,
                departmentId,
                academicYearId,
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

    static async searchDivisions(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const query = req.query.q as string;
            const semesterId = req.query.semesterId as string;
            const departmentId = req.query.departmentId as string;
            const academicYearId = req.query.academicYearId as string;
            const limit = parseInt(req.query.limit as string) || 20;

            if (!query) {
                throw new Error("Search query is required");
            }

            const divisions = await divisionService.search(query, {
                semesterId,
                departmentId,
                academicYearId,
                limit,
            });

            res.status(200).json({
                status: "success",
                results: divisions.length,
                data: {
                    divisions,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDivisionsByDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const departmentId = req.params.departmentId;
            const academicYearId = req.query.academicYearId as string;
            const limit = parseInt(req.query.limit as string) || 50;

            const divisions = await divisionService.getByDepartment(
                departmentId,
                {
                    academicYearId,
                    limit,
                }
            );

            res.status(200).json({
                status: "success",
                results: divisions.length,
                data: {
                    divisions,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDivisionsByAcademicYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const academicYearId = req.params.academicYearId;
            const departmentId = req.query.departmentId as string;
            const limit = parseInt(req.query.limit as string) || 50;

            const divisions = await divisionService.getByAcademicYear(
                academicYearId,
                {
                    departmentId,
                    limit,
                }
            );

            res.status(200).json({
                status: "success",
                results: divisions.length,
                data: {
                    divisions,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateDivision(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedDivision = await divisionService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: {
                    division: updatedDivision,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteDivision(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await divisionService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async hardDeleteDivision(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await divisionService.hardDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async restoreDivision(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const division = await divisionService.restore(req.params.id);
            res.status(200).json({
                status: "success",
                data: {
                    division,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
