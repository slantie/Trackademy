/**
 * @file src/services/student.service.ts
 * @description Service layer for managing student profiles and associated user accounts.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Student } from "@prisma/client";
import { hashPassword } from "../utils/hash";

interface StudentCreateData {
    email: string;
    password: string;
    fullName: string;
    enrollmentNumber: string;
    batch: string;
    departmentId: string;
    semesterId: string;
    divisionId: string;
}

type StudentUpdateData = Partial<
    Omit<
        StudentCreateData,
        "email" | "password" | "enrollmentNumber" | "departmentId"
    >
> & { isDeleted?: boolean };

class StudentService {
    public async create(data: StudentCreateData): Promise<Student> {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser)
            throw new AppError("A user with this email already exists.", 409);

        const existingStudent = await prisma.student.findUnique({
            where: { enrollmentNumber: data.enrollmentNumber },
        });
        if (existingStudent)
            throw new AppError(
                "A student with this enrollment number already exists.",
                409
            );

        const hashedPassword = await hashPassword(data.password);

        return prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    role: "STUDENT",
                },
            });

            return tx.student.create({
                data: {
                    userId: newUser.id,
                    fullName: data.fullName,
                    enrollmentNumber: data.enrollmentNumber,
                    batch: data.batch,
                    departmentId: data.departmentId,
                    semesterId: data.semesterId,
                    divisionId: data.divisionId,
                },
            });
        });
    }

    public async getAllByDivision(divisionId: string): Promise<Student[]> {
        return prisma.student.findMany({
            where: { divisionId, isDeleted: false },
            orderBy: { enrollmentNumber: "asc" },
        });
    }

    public async getById(id: string): Promise<Student> {
        const student = await prisma.student.findUnique({
            where: { id, isDeleted: false },
        });

        if (!student) {
            throw new AppError("Student not found.", 404);
        }
        return student;
    }

    public async update(id: string, data: StudentUpdateData): Promise<Student> {
        await this.getById(id);
        return prisma.student.update({
            where: { id },
            data,
        });
    }

    public async delete(id: string): Promise<void> {
        await this.getById(id);
        await prisma.student.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const studentService = new StudentService();
