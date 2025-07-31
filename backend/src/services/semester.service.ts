/**
 * @file src/services/semester.service.ts
 * @description Service layer for semester-related business logic.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Semester, SemesterType } from "@prisma/client";

interface SemesterCreateData {
    semesterNumber: number;
    semesterType: SemesterType;
    departmentId: string;
    academicYearId: string;
}

type SemesterUpdateData = { isDeleted?: boolean };

class SemesterService {
    public async create(data: SemesterCreateData): Promise<Semester> {
        const existingSemester = await prisma.semester.findUnique({
            where: {
                academicYearId_departmentId_semesterNumber: {
                    academicYearId: data.academicYearId,
                    departmentId: data.departmentId,
                    semesterNumber: data.semesterNumber,
                },
            },
        });

        if (existingSemester && !existingSemester.isDeleted) {
            throw new AppError(
                "This semester instance already exists for the specified department and academic year.",
                409
            );
        }

        return prisma.semester.create({ data });
    }

    public async getByDepartmentAndYear(
        departmentId: string,
        academicYearId: string
    ): Promise<Semester[]> {
        return prisma.semester.findMany({
            where: {
                departmentId,
                academicYearId,
                isDeleted: false,
            },
            orderBy: { semesterNumber: "asc" },
        });
    }

    public async getById(id: string): Promise<Semester> {
        const semester = await prisma.semester.findUnique({
            where: { id, isDeleted: false },
        });

        if (!semester) {
            throw new AppError("Semester not found.", 404);
        }
        return semester;
    }

    public async update(
        id: string,
        data: SemesterUpdateData
    ): Promise<Semester> {
        await this.getById(id);
        return prisma.semester.update({
            where: { id },
            data,
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.semester.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const semesterService = new SemesterService();
