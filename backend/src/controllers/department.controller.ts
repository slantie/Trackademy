/**
 * @file src/controllers/department.controller.ts
 * @description Controller for handling department-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { departmentService } from "../services/department.service";

export class DepartmentController {
    static async createDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newDepartment = await departmentService.create(req.body);
            res.status(201).json({
                status: "success",
                data: {
                    department: newDepartment,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllDepartments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const collegeId = req.query.collegeId as string;
            const departments = await departmentService.getAllByCollege(
                collegeId
            );
            res.status(200).json({
                status: "success",
                results: departments.length,
                data: {
                    departments,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDepartmentById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const department = await departmentService.getById(req.params.id);
            res.status(200).json({
                status: "success",
                data: {
                    department,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedDepartment = await departmentService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: {
                    department: updatedDepartment,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await departmentService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
