/**
 * @file src/controllers/subject.controller.ts
 * @description Controller for handling subject-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { subjectService } from "../services/subject.service";
import { SubjectType } from "@prisma/client";
import AppError from "../utils/appError";

export class SubjectController {
    /**
     * Creates a new subject.
     */
    static async createSubject(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newSubject = await subjectService.create(req.body);
            res.status(201).json({
                status: "success",
                data: { subject: newSubject },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves all subjects with flexible filtering options.
     */
    static async getAllSubjects(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { departmentId, semesterNumber, type, search, grouped } =
                req.query;

            let subjects;

            if (search) {
                subjects = await subjectService.search(
                    search as string,
                    departmentId as string,
                    semesterNumber ? Number(semesterNumber) : undefined
                );
            } else if (grouped === "true" && departmentId) {
                const groupedSubjects =
                    await subjectService.getGroupedBySemester(
                        departmentId as string
                    );
                res.status(200).json({
                    status: "success",
                    data: { subjects: groupedSubjects },
                });
                return;
            } else if (type) {
                subjects = await subjectService.getByType(
                    type as SubjectType,
                    departmentId as string
                );
            } else if (departmentId && semesterNumber) {
                subjects = await subjectService.getByDepartmentAndSemester(
                    departmentId as string,
                    Number(semesterNumber)
                );
            } else if (departmentId) {
                subjects = await subjectService.getAllByDepartment(
                    departmentId as string
                );
            } else {
                subjects = await subjectService.getAll();
            }

            res.status(200).json({
                status: "success",
                results: subjects.length,
                data: { subjects },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves a count of subjects.
     */
    static async getSubjectCount(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { departmentId, bySemester } = req.query;

            let count;

            if (bySemester === "true" && departmentId) {
                count = await subjectService.getCountBySemester(
                    departmentId as string
                );
            } else if (departmentId) {
                count = await subjectService.getCountByDepartment(
                    departmentId as string
                );
            } else {
                count = await subjectService.getTotalCount();
            }

            res.status(200).json({
                status: "success",
                data: { count },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves a single subject by its ID.
     */
    static async getSubjectById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const includeRelations = req.query.include === "relations";

            const subject = includeRelations
                ? await subjectService.getByIdWithRelations(req.params.id)
                : await subjectService.getById(req.params.id);

            res.status(200).json({
                status: "success",
                data: { subject },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Updates an existing subject.
     */
    static async updateSubject(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedSubject = await subjectService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: { subject: updatedSubject },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Soft or hard deletes a subject.
     */
    static async deleteSubject(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const force = req.query.force === "true";

            if (force) {
                await subjectService.hardDelete(req.params.id);
            } else {
                await subjectService.delete(req.params.id);
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    /**
     * Searches subjects by name, abbreviation, or code.
     */
    static async searchSubjects(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const searchTerm = req.query.q as string;
            const departmentId = req.query.departmentId as string;
            const semesterNumber = req.query.semesterNumber
                ? Number(req.query.semesterNumber)
                : undefined;

            if (!searchTerm) {
                throw new AppError("Search term is required.", 400);
            }

            const subjects = await subjectService.search(
                searchTerm,
                departmentId,
                semesterNumber
            );

            res.status(200).json({
                status: "success",
                results: subjects.length,
                data: { subjects },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves subjects by type (MANDATORY or ELECTIVE).
     */
    static async getSubjectsByType(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const type = req.params.type as SubjectType;
            const departmentId = req.query.departmentId as string;

            const subjects = await subjectService.getByType(type, departmentId);

            res.status(200).json({
                status: "success",
                results: subjects.length,
                data: { subjects },
            });
        } catch (error) {
            next(error);
        }
    }
}
