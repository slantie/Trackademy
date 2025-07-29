/**
 * @file src/services/department.service.ts
 * @description Service layer for department-related business logic.
 */

import { prisma } from "./prisma.service";
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
    /**
     * Creates a new department within a college.
     * @param data - The data for the new department.
     * @returns The newly created department.
     */
    public async create(data: DepartmentCreateData): Promise<Department> {
        // Check if a department with the same name or abbreviation already exists in this college
        const existingDepartment = await prisma.department.findFirst({
            where: {
                collegeId: data.collegeId,
                isDeleted: false,
                OR: [{ name: data.name }, { abbreviation: data.abbreviation }],
            },
        });

        if (existingDepartment) {
            throw new AppError(
                "A department with this name or abbreviation already exists in this college.",
                409
            );
        }

        return prisma.department.create({ data });
    }

    /**
     * Retrieves all non-deleted departments for a given college.
     * @param collegeId - The CUID of the college.
     * @returns A list of departments.
     */
    public async getAllByCollege(collegeId: string): Promise<Department[]> {
        return prisma.department.findMany({
            where: { collegeId, isDeleted: false },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Retrieves a single department by its ID.
     * @param id - The CUID of the department.
     * @returns The requested department.
     */
    public async getById(id: string): Promise<Department> {
        const department = await prisma.department.findUnique({
            where: { id, isDeleted: false },
        });

        if (!department) {
            throw new AppError("Department not found.", 404);
        }
        return department;
    }

    /**
     * Updates an existing department.
     * @param id - The CUID of the department to update.
     * @param data - The data to update.
     * @returns The updated department.
     */
    public async update(
        id: string,
        data: DepartmentUpdateData
    ): Promise<Department> {
        await this.getById(id); // Ensures the department exists before updating
        return prisma.department.update({
            where: { id },
            data,
        });
    }

    /**
     * Soft deletes a department.
     * @param id - The CUID of the department to delete.
     */
    public async delete(id: string): Promise<void> {
        await this.getById(id); // Ensures the department exists
        await prisma.department.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const departmentService = new DepartmentService();
