/**
 * @file src/services/division.service.ts
 * @description Service layer for division-related business logic.
 */

import { prisma } from "../config/prisma.service";
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
    public async create(data: DivisionCreateData): Promise<Division> {
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

    public async getAllBySemester(semesterId: string): Promise<Division[]> {
        return prisma.division.findMany({
            where: {
                semesterId,
                isDeleted: false,
            },
            orderBy: { name: "asc" },
        });
    }

    public async getById(id: string): Promise<Division> {
        const division = await prisma.division.findUnique({
            where: { id, isDeleted: false },
        });

        if (!division) {
            throw new AppError("Division not found.", 404);
        }
        return division;
    }

    public async update(
        id: string,
        data: DivisionUpdateData
    ): Promise<Division> {
        await this.getById(id);
        return prisma.division.update({
            where: { id },
            data,
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.division.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const divisionService = new DivisionService();
