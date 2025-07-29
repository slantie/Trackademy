/**
 * @file src/controllers/division.controller.ts
 * @description Controller for handling division-related API requests.
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
}
