/**
 * @file src/controllers/department.controller.ts
 * @description Controller for handling department-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { departmentService } from "../services/department.service";
import AppError from "../utils/appError";

export class DepartmentController {
    /**
     * Creates a new department.
     */
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

    /**
     * Retrieves all departments. Can be filtered by college ID.
     */
    static async getAllDepartments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const collegeId = req.query.collegeId as string;
            const searchTerm = req.query.search as string;

            let departments;

            if (searchTerm) {
                departments = await departmentService.search(searchTerm, {
                    collegeId,
                });
            } else if (collegeId) {
                departments = await departmentService.getAllByCollege(
                    collegeId
                );
            } else {
                departments = await departmentService.getAll();
            }

            res.status(200).json({
                status: "success",
                results: Array.isArray(departments)
                    ? departments.length
                    : Array.isArray(departments.data)
                    ? departments.data.length
                    : 0,
                data: {
                    departments,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves a count of departments.
     */
    static async getDepartmentCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const collegeId = req.query.collegeId as string;

            const count = collegeId
                ? await departmentService.getCountByCollege(collegeId)
                : await departmentService.getTotalCount();

            res.status(200).json({
                status: "success",
                data: {
                    count,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves a single department by its ID.
     */
    static async getDepartmentById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const includeRelations = req.query.include === "relations";

            const department = includeRelations
                ? await departmentService.getByIdWithRelations(req.params.id)
                : await departmentService.getById(req.params.id);

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

    /**
     * Updates an existing department.
     */
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

    /**
     * Soft deletes a department.
     */
    static async deleteDepartment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const force = req.query.force === "true";

            if (force) {
                await departmentService.hardDelete(req.params.id);
            } else {
                await departmentService.delete(req.params.id);
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    /**
     * Searches departments by name or abbreviation.
     */
    static async searchDepartments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const searchTerm = req.query.q as string;
            const collegeId = req.query.collegeId as string;

            if (!searchTerm) {
                throw new AppError("Search term is required.", 400);
            }

            const departments = await departmentService.search(searchTerm, {
                collegeId,
            });

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
}
