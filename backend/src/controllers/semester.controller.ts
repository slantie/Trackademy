/**
 * @file src/controllers/semester.controller.ts
 * @description Enhanced controller for handling semester-related API requests with comprehensive CRUD operations.
 */

import { Request, Response, NextFunction } from "express";
import { semesterService } from "../services/semester.service";

export class SemesterController {
    static async createSemester(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newSemester = await semesterService.create(req.body);
            res.status(201).json({
                status: "success",
                data: { semester: newSemester },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllSemesters(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const departmentId = req.query.departmentId as string;
            const academicYearId = req.query.academicYearId as string;
            const semesterNumber = req.query.semesterNumber
                ? parseInt(req.query.semesterNumber as string)
                : undefined;
            const semesterType = req.query.semesterType as any;
            const search = req.query.search as string;
            const includeDeleted = req.query.includeDeleted === "true";

            const result = await semesterService.getAll({
                departmentId,
                academicYearId,
                semesterNumber,
                semesterType,
                search,
                includeDeleted,
            });

            res.status(200).json({
                status: "success",
                results: result.data.length,
                data: {
                    semesters: result.data,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSemestersByDepartmentAndYear(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { departmentId, academicYearId } = req.query;
            const semesters = await semesterService.getByDepartmentAndYear(
                departmentId as string,
                academicYearId as string
            );
            res.status(200).json({
                status: "success",
                results: semesters.length,
                data: { semesters },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSemesterById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semester = await semesterService.getById(req.params.id);
            res.status(200).json({ status: "success", data: { semester } });
        } catch (error) {
            next(error);
        }
    }

    static async getSemesterCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const departmentId = req.query.departmentId as string;
            const academicYearId = req.query.academicYearId as string;
            const semesterNumber = req.query.semesterNumber
                ? parseInt(req.query.semesterNumber as string)
                : undefined;
            const semesterType = req.query.semesterType as any;
            const search = req.query.search as string;
            const includeDeleted = req.query.includeDeleted === "true";

            const result = await semesterService.getCount({
                departmentId,
                academicYearId,
                semesterNumber,
                semesterType,
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

    static async searchSemesters(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const query = req.query.q as string;
            const departmentId = req.query.departmentId as string;
            const academicYearId = req.query.academicYearId as string;
            const limit = parseInt(req.query.limit as string) || 20;

            if (!query) {
                throw new Error("Search query is required");
            }

            const semesters = await semesterService.search(query, {
                departmentId,
                academicYearId,
                limit,
            });

            res.status(200).json({
                status: "success",
                results: semesters.length,
                data: {
                    semesters,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSemestersBySemesterNumber(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semesterNumber = parseInt(req.params.semesterNumber);
            const departmentId = req.query.departmentId as string;
            const academicYearId = req.query.academicYearId as string;

            const semesters = await semesterService.getBySemesterNumber(
                semesterNumber,
                {
                    departmentId,
                    academicYearId,
                }
            );

            res.status(200).json({
                status: "success",
                results: semesters.length,
                data: {
                    semesters,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getSemestersBySemesterType(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semesterType = req.params.semesterType as any;
            const departmentId = req.query.departmentId as string;
            const academicYearId = req.query.academicYearId as string;
            const limit = parseInt(req.query.limit as string) || 50;

            const semesters = await semesterService.getBySemesterType(
                semesterType,
                {
                    departmentId,
                    academicYearId,
                    limit,
                }
            );

            res.status(200).json({
                status: "success",
                results: semesters.length,
                data: {
                    semesters,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateSemester(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedSemester = await semesterService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: { semester: updatedSemester },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteSemester(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await semesterService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async hardDeleteSemester(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await semesterService.hardDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    static async restoreSemester(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semester = await semesterService.restore(req.params.id);
            res.status(200).json({
                status: "success",
                data: {
                    semester,
                },
            });
        } catch (error) {
            next(error);
        }
    }
}
