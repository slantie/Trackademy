/**
 * @file src/controllers/student.controller.ts
 * @description Controller for handling student profile management API requests.
 */

import { Request, Response, NextFunction } from "express";
import { studentService } from "../services/student.service";

export class StudentController {
    static async createStudent(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const newStudent = await studentService.create(req.body);
            res.status(201).json({
                status: "success",
                data: { student: newStudent },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAllStudents(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const divisionId = req.query.divisionId as string;
            const students = await studentService.getAllByDivision(divisionId);
            res.status(200).json({
                status: "success",
                results: students.length,
                data: { students },
            });
        } catch (error) {
            next(error);
        }
    }

    static async getStudentById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const student = await studentService.getById(req.params.id);
            res.status(200).json({ status: "success", data: { student } });
        } catch (error) {
            next(error);
        }
    }

    static async updateStudent(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const updatedStudent = await studentService.update(
                req.params.id,
                req.body
            );
            res.status(200).json({
                status: "success",
                data: { student: updatedStudent },
            });
        } catch (error) {
            next(error);
        }
    }

    static async deleteStudent(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await studentService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
