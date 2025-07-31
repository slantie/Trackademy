/**
 * @file src/controllers/upload.controller.ts
 * @description Controller for handling bulk data upload requests.
 */

import { Request, Response, NextFunction } from "express";
import { uploadService } from "../services/upload.service";
import AppError from "../utils/appError";
import { ExamType, SemesterType } from "@prisma/client";

export class UploadController {
    static async uploadFacultyData(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.file)
                throw new AppError("No Excel file was uploaded.", 400);
            const result = await uploadService.processFacultyData(
                req.file.buffer
            );
            res.status(201).json({ status: "success", data: result });
        } catch (error) {
            next(error);
        }
    }

    static async uploadStudentData(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.file)
                throw new AppError("No Excel file was uploaded.", 400);
            const result = await uploadService.processStudentData(
                req.file.buffer
            );
            res.status(201).json({ status: "success", data: result });
        } catch (error) {
            next(error);
        }
    }

    static async uploadSubjectData(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.file)
                throw new AppError("No Excel file was uploaded.", 400);
            // const { academicYearId } = req.body;
            // if (!academicYearId)
            //     throw new AppError("Academic Year ID is required.", 400);
            const result = await uploadService.processSubjectData(
                req.file.buffer
                // academicYearId
            );
            res.status(201).json({ status: "success", data: result });
        } catch (error) {
            next(error);
        }
    }

    static async uploadFacultyMatrix(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.file)
                throw new AppError("No Excel file was uploaded.", 400);
            const { academicYear, semesterType, departmentId } = req.body;
            const result = await uploadService.processFacultyMatrix(
                req.file.buffer,
                {
                    academicYear,
                    semesterType: semesterType as SemesterType,
                    departmentId,
                }
            );
            res.status(201).json({ status: "success", data: result });
        } catch (error) {
            next(error);
        }
    }

    static async uploadResultsData(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.file)
                throw new AppError("No Excel file was uploaded.", 400);
            const {
                examName,
                examType,
                academicYearId,
                departmentId,
                semesterNumber,
            } = req.body;

            const result = await uploadService.processResultsData(
                req.file.buffer,
                {
                    examName,
                    examType: examType as ExamType,
                    academicYearId,
                    departmentId,
                    semesterNumber: Number(semesterNumber),
                }
            );
            res.status(201).json({ status: "success", data: result });
        } catch (error) {
            next(error);
        }
    }
}
