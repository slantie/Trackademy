/**
 * @file src/services/faculty.service.ts
 * @description Service layer for managing faculty profiles.
 */

import { prisma } from "./prisma.service";
import AppError from "../utils/appError";
import { Faculty, Designation } from "@prisma/client";

// Note: Creation is handled by AuthService.registerFaculty

type FacultyUpdateData = {
    fullName?: string;
    designation?: Designation;
    abbreviation?: string;
    joiningDate?: string | Date;
    seatingLocation?: string;
    isDeleted?: boolean;
};

class FacultyService {
    /**
     * Retrieves all non-deleted faculty for a given department.
     * @param departmentId - The CUID of the department.
     * @returns A list of faculty profiles.
     */
    public async getAllByDepartment(departmentId: string): Promise<Faculty[]> {
        return prisma.faculty.findMany({
            where: {
                departmentId,
                isDeleted: false,
            },
            orderBy: { fullName: "asc" },
        });
    }

    /**
     * Retrieves a single faculty profile by its ID.
     * @param id - The CUID of the faculty profile.
     * @returns The requested faculty profile.
     */
    public async getById(id: string): Promise<Faculty> {
        const faculty = await prisma.faculty.findUnique({
            where: { id, isDeleted: false },
        });

        if (!faculty) {
            throw new AppError("Faculty not found.", 404);
        }
        return faculty;
    }

    /**
     * Updates an existing faculty profile.
     * @param id - The CUID of the faculty profile to update.
     * @param data - The data to update.
     * @returns The updated faculty profile.
     */
    public async update(id: string, data: FacultyUpdateData): Promise<Faculty> {
        await this.getById(id); // Ensures the faculty profile exists before updating
        return prisma.faculty.update({
            where: { id },
            data,
        });
    }

    /**
     * Soft deletes a faculty profile.
     * Note: This does not affect the associated User account.
     * @param id - The CUID of the faculty profile to delete.
     */
    public async delete(id: string): Promise<void> {
        await this.getById(id); // Ensures the faculty profile exists
        await prisma.faculty.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const facultyService = new FacultyService();
