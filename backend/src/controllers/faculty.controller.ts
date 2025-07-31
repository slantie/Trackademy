/**
 * @file src/controllers/faculty.controller.ts
 * @description Controller for handling faculty profile management API requests.
 */

import { Request, Response, NextFunction } from "express";
import { facultyService } from "../services/faculty.service";

export class FacultyController {
    static async createFaculty(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newFaculty = await facultyService.create(req.body);
            res.status(201).json({
                status: "success",
                data: { faculty: newFaculty },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllFaculties(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const departmentId = req.query.departmentId as string;
            const faculties = await facultyService.getAllByDepartment(
                departmentId
            );
            res.status(200).json({
                status: "success",
                results: faculties.length,
                data: { faculties },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getFacultyById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const faculty = await facultyService.getById(req.params.id);
            res.status(200).json({ status: "success", data: { faculty } });
        } catch (error) {
            next(error);
        }
    }

    static async updateFaculty(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedFaculty = await facultyService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: { faculty: updatedFaculty },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteFaculty(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await facultyService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
