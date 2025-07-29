/**
 * @file src/services/college.service.ts
 * @description Service layer for college-related business logic.
 */

import { prisma } from "./prisma.service";
import AppError from "../utils/appError";
import { College } from "@prisma/client";

// Interface for the data required to create a college
interface CollegeCreateData {
    name: string;
    websiteUrl?: string;
    address?: string;
    contactNumber?: string;
}

// Interface for the data allowed for updating a college
type CollegeUpdateData = Partial<CollegeCreateData> & { isDeleted?: boolean };

class CollegeService {
    /**
     * Creates a new college.
     * @param data - The data for the new college.
     * @returns The newly created college.
     */
    public async create(data: CollegeCreateData): Promise<College> {
        const existingCollege = await prisma.college.findFirst({
            where: { name: data.name, isDeleted: false },
        });

        if (existingCollege) {
            throw new AppError("A college with this name already exists.", 409);
        }

        return prisma.college.create({ data });
    }

    /**
     * Retrieves all non-deleted colleges.
     * @returns A list of all active colleges.
     */
    public async getAll(): Promise<College[]> {
        return prisma.college.findMany({
            where: { isDeleted: false },
            orderBy: { name: "asc" },
        });
    }

    /**
     * Retrieves a single college by its ID.
     * @param id - The CUID of the college to retrieve.
     * @returns The requested college.
     */
    public async getById(id: string): Promise<College> {
        const college = await prisma.college.findUnique({
            where: { id, isDeleted: false },
        });

        if (!college) {
            throw new AppError("College not found.", 404);
        }
        return college;
    }

    /**
     * Updates an existing college.
     * @param id - The CUID of the college to update.
     * @param data - The data to update the college with.
     * @returns The updated college.
     */
    public async update(id: string, data: CollegeUpdateData): Promise<College> {
        await this.getById(id); // Ensures the college exists before attempting to update
        return prisma.college.update({
            where: { id },
            data,
        });
    }

    /**
     * Soft deletes a college by setting its `isDeleted` flag to true.
     * @param id - The CUID of the college to delete.
     * @returns The college that was marked as deleted.
     */
    public async delete(id: string): Promise<College> {
        await this.getById(id); // Ensure the college exists
        return prisma.college.delete({
            where: { id },
        });
    }
}

export const collegeService = new CollegeService();
