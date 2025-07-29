/**
 * @file src/controllers/college.controller.ts
 * @description Controller for handling college-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { collegeService } from "../services/college.service";

export class CollegeController {
    static async createCollege(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newCollege = await collegeService.create(req.body);
            res.status(201).json({
                status: "success",
                data: {
                    college: newCollege,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllColleges(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const colleges = await collegeService.getAll();
            res.status(200).json({
                status: "success",
                results: colleges.length,
                data: {
                    colleges,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getCollegeById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const college = await collegeService.getById(req.params.id);
            res.status(200).json({
                status: "success",
                data: {
                    college,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateCollege(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedCollege = await collegeService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: {
                    college: updatedCollege,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCollege(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await collegeService.delete(req.params.id);
            res.status(204).send(); // 204 No Content is standard for successful deletions
        } catch (error) {
            next(error);
        }
    }
}
