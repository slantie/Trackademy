/**
 * @file src/services/department.service.ts
 * @description Service layer for department-related business logic.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Department } from "@prisma/client";

interface DepartmentCreateData {
    name: string;
    abbreviation: string;
    collegeId: string;
}

type DepartmentUpdateData = Partial<Omit<DepartmentCreateData, "collegeId">> & {
    isDeleted?: boolean;
};

class DepartmentService {
    public async create(data: DepartmentCreateData): Promise<Department> {
        const existingDepartment = await prisma.department.findUnique({
            where: {
                collegeId_name: {
                    collegeId: data.collegeId,
                    name: data.name,
                },
            },
        });

        if (existingDepartment && !existingDepartment.isDeleted) {
            throw new AppError(
                "A department with this name already exists in this college.",
                409
            );
        }

        return prisma.department.create({ data });
    }

    public async getAllByCollege(collegeId: string): Promise<Department[]> {
        return prisma.department.findMany({
            where: { collegeId, isDeleted: false },
            orderBy: { name: "asc" },
        });
    }

    public async getById(id: string): Promise<Department> {
        const department = await prisma.department.findUnique({
            where: { id, isDeleted: false },
        });

        if (!department) {
            throw new AppError("Department not found.", 404);
        }
        return department;
    }

    public async update(
        id: string,
        data: DepartmentUpdateData
    ): Promise<Department> {
        await this.getById(id);
        return prisma.department.update({
            where: { id },
            data,
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.department.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const departmentService = new DepartmentService();
