/**
 * @file src/services/faculty.service.ts
 * @description Service layer for managing faculty profiles.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Faculty, Designation, Role } from "@prisma/client";
import { hashPassword } from "../utils/hash";

interface FacultyCreateData {
    email: string;
    password: string;
    fullName: string;
    designation: Designation;
    abbreviation?: string;
    joiningDate?: string | null;
    departmentId: string;
}

type FacultyUpdateData = Partial<
    Omit<FacultyCreateData, "email" | "password" | "departmentId">
> & { isDeleted?: boolean };

class FacultyService {
    public async create(data: FacultyCreateData): Promise<Faculty> {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new AppError("A user with this email already exists.", 409);
        }

        const hashedPassword = await hashPassword(data.password);

        return prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    role: Role.FACULTY,
                },
            });

            return tx.faculty.create({
                data: {
                    userId: newUser.id,
                    fullName: data.fullName,
                    designation: data.designation,
                    abbreviation: data.abbreviation,
                    joiningDate: data.joiningDate
                        ? new Date(data.joiningDate)
                        : null,
                    departmentId: data.departmentId,
                },
            });
        });
    }

    public async getAllByDepartment(departmentId: string): Promise<Faculty[]> {
        return prisma.faculty.findMany({
            where: { departmentId, isDeleted: false },
            orderBy: { fullName: "asc" },
        });
    }

    public async getById(id: string): Promise<Faculty> {
        const faculty = await prisma.faculty.findUnique({
            where: { id, isDeleted: false },
        });
        if (!faculty) throw new AppError("Faculty not found.", 404);
        return faculty;
    }

    public async update(id: string, data: FacultyUpdateData): Promise<Faculty> {
        await this.getById(id);
        return prisma.faculty.update({
            where: { id },
            data: {
                ...data,
                joiningDate: data.joiningDate
                    ? new Date(data.joiningDate)
                    : data.joiningDate,
            },
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.faculty.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const facultyService = new FacultyService();
