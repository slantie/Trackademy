/**
 * @file src/controllers/semester.controller.ts
 * @description Controller for handling semester-related API requests.
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
                data: {
                    semester: newSemester,
                },
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
            const { departmentId, academicYearId } = req.query;
            const semesters = await semesterService.getAll({
                departmentId: departmentId as string,
                academicYearId: academicYearId as string | undefined,
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

    static async getSemesterById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const semester = await semesterService.getById(req.params.id);
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
                data: {
                    semester: updatedSemester,
                },
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
}
