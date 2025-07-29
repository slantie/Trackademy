/**
 * @file src/services/division.service.ts
 * @description Service layer for division-related business logic.
 */

import { prisma } from "./prisma.service";
import AppError from "../utils/appError";
import { Division } from "@prisma/client";

interface DivisionCreateData {
    name: string;
    semesterId: string;
}

type DivisionUpdateData = Partial<Omit<DivisionCreateData, "semesterId">> & {
    isDeleted?: boolean;
};

class DivisionService {
    /**
     * Creates a new division within a semester.
     * @param data - The data for the new division.
     * @returns The newly created division.
     */
    public async create(data: DivisionCreateData): Promise<Division> {
        // Check if a division with the same name already exists in this semester
        const existingDivision = await prisma.division.findUnique({
            where: {
                name_semesterId: {
                    name: data.name,
                    semesterId: data.semesterId,
                },
            },
        });

        if (existingDivision && !existingDivision.isDeleted) {
            throw new AppError(
                "A division with this name already exists in this semester.",
                409
            );
        }

        return prisma.division.create({ data });
    }

    /**
     * Retrieves all non-deleted divisions for a given semester.
     * @param semesterId - The CUID of the semester.
     * @returns A list of divisions.
     */
    public async getAllBySemester(semesterId: string): Promise<Division[]> {
        return prisma.division.findMany({
            where: {
                semesterId,
                isDeleted: false,
            },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Retrieves a single division by its ID.
     * @param id - The CUID of the division.
     * @returns The requested division.
     */
    public async getById(id: string): Promise<Division> {
        const division = await prisma.division.findUnique({
            where: { id, isDeleted: false },
        });

        if (!division) {
            throw new AppError("Division not found.", 404);
        }
        return division;
    }

    /**
     * Updates an existing division.
     * @param id - The CUID of the division to update.
     * @param data - The data to update.
     * @returns The updated division.
     */
    public async update(
        id: string,
        data: DivisionUpdateData
    ): Promise<Division> {
        await this.getById(id); // Ensures the division exists before updating
        return prisma.division.update({
            where: { id },
            data,
        });
    }

    /**
     * Soft deletes a division.
     * @param id - The CUID of the division to delete.
     */
    public async delete(id: string): Promise<void> {
        await this.getById(id); // Ensures the division exists
        await prisma.division.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const divisionService = new DivisionService();
