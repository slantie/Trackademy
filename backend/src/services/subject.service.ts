/**
 * @file src/services/subject.service.ts
 * @description Service layer for subject-related business logic.
 */

import { prisma } from "./prisma.service";
import AppError from "../utils/appError";
import { Subject, SubjectType } from "@prisma/client";

interface SubjectCreateData {
    name: string;
    code: string;
    type: SubjectType;
    departmentId: string;
    semesterId: string;
}

type SubjectUpdateData = Partial<
    Omit<SubjectCreateData, "departmentId" | "semesterId">
> & { isDeleted?: boolean };

class SubjectService {
    /**
     * Creates a new subject.
     * @param data - The data for the new subject.
     * @returns The newly created subject.
     */
    public async create(data: SubjectCreateData): Promise<Subject> {
        // Check if a subject with the same code already exists in this department and semester
        const existingSubject = await prisma.subject.findUnique({
            where: {
                code_departmentId_semesterId: {
                    code: data.code,
                    departmentId: data.departmentId,
                    semesterId: data.semesterId,
                },
            },
        });

        if (existingSubject && !existingSubject.isDeleted) {
            throw new AppError(
                "A subject with this code already exists for this department and semester.",
                409
            );
        }

        return prisma.subject.create({ data });
    }

    /**
     * Retrieves all non-deleted subjects for a given semester.
     * @param semesterId - The CUID of the semester.
     * @returns A list of subjects.
     */
    public async getAllBySemester(semesterId: string): Promise<Subject[]> {
        return prisma.subject.findMany({
            where: {
                semesterId,
                isDeleted: false,
            },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Retrieves a single subject by its ID.
     * @param id - The CUID of the subject.
     * @returns The requested subject.
     */
    public async getById(id: string): Promise<Subject> {
        const subject = await prisma.subject.findUnique({
            where: { id, isDeleted: false },
        });

        if (!subject) {
            throw new AppError("Subject not found.", 404);
        }
        return subject;
    }

    /**
     * Updates an existing subject.
     * @param id - The CUID of the subject to update.
     * @param data - The data to update.
     * @returns The updated subject.
     */
    public async update(id: string, data: SubjectUpdateData): Promise<Subject> {
        await this.getById(id); // Ensures the subject exists before updating
        return prisma.subject.update({
            where: { id },
            data,
        });
    }

    /**
     * Soft deletes a subject.
     * @param id - The CUID of the subject to delete.
     */
    public async delete(id: string): Promise<void> {
        await this.getById(id); // Ensures the subject exists
        await prisma.subject.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const subjectService = new SubjectService();
