/**
 * @file src/controllers/course.controller.ts
 * @description Controller for handling course offering API requests.
 */

import { Request, Response, NextFunction } from "express";
import { courseService } from "../services/course.service";

export class CourseController {
    static async createCourse(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newCourse = await courseService.create(req.body);
            res.status(201).json({
                status: "success",
                data: { course: newCourse },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllCourses(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const divisionId = req.query.divisionId as string;
            const courses = await courseService.getByDivision(divisionId);
            res.status(200).json({
                status: "success",
                results: courses.length,
                data: { courses },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCourse(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await courseService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
