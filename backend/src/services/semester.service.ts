/**
 * @file src/services/semester.service.ts
 * @description Service layer for semester-related business logic.
 */

import { prisma } from "./prisma.service";
import AppError from "../utils/appError";
import { Semester, SemesterType } from "@prisma/client";

interface SemesterCreateData {
    semesterNumber: number;
    semesterType: SemesterType;
    departmentId: string;
    academicYearId: string;
}

type SemesterUpdateData = Partial<
    Omit<SemesterCreateData, "departmentId" | "academicYearId">
> & { isDeleted?: boolean };

class SemesterService {
    /**
     * Creates a new semester.
     * @param data - The data for the new semester.
     * @returns The newly created semester.
     */
    public async create(data: SemesterCreateData): Promise<Semester> {
        // Check if this semester already exists for the given department and academic year
        const existingSemester = await prisma.semester.findUnique({
            where: {
                departmentId_semesterNumber_academicYearId: {
                    departmentId: data.departmentId,
                    semesterNumber: data.semesterNumber,
                    academicYearId: data.academicYearId,
                },
            },
        });

        if (existingSemester && !existingSemester.isDeleted) {
            throw new AppError(
                "This semester already exists for the specified department and academic year.",
                409
            );
        }

        return prisma.semester.create({ data });
    }

    /**
     * Retrieves all non-deleted semesters, filtered by department and optionally by academic year.
     * @param filters - An object containing departmentId and optional academicYearId.
     * @returns A list of semesters.
     */
    public async getAll(filters: {
        departmentId: string;
        academicYearId?: string;
    }): Promise<Semester[]> {
        return prisma.semester.findMany({
            where: {
                departmentId: filters.departmentId,
                academicYearId: filters.academicYearId, // This will be undefined if not provided, so it won't filter
                isDeleted: false,
            },
            orderBy: [
                { academicYear: { year: "desc" } },
                { semesterNumber: "asc" },
            ],
        });
    }

    /**
     * Retrieves a single semester by its ID.
     * @param id - The CUID of the semester.
     * @returns The requested semester.
     */
    public async getById(id: string): Promise<Semester> {
        const semester = await prisma.semester.findUnique({
            where: { id, isDeleted: false },
        });

        if (!semester) {
            throw new AppError("Semester not found.", 404);
        }
        return semester;
    }

    /**
     * Updates an existing semester.
     * @param id - The CUID of the semester to update.
     * @param data - The data to update.
     * @returns The updated semester.
     */
    public async update(
        id: string,
        data: SemesterUpdateData
    ): Promise<Semester> {
        await this.getById(id); // Ensures the semester exists before updating
        return prisma.semester.update({
            where: { id },
            data,
        });
    }

    /**
     * Soft deletes a semester.
     * @param id - The CUID of the semester to delete.
     */
    public async delete(id: string): Promise<void> {
        await this.getById(id); // Ensures the semester exists
        await prisma.semester.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const semesterService = new SemesterService();
