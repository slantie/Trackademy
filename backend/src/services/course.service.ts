/**
 * @file src/services/course.service.ts
 * @description Service layer for managing course offerings (subject allocations).
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { Course, LectureType } from "@prisma/client";

interface CourseCreateData {
    subjectId: string;
    facultyId: string;
    semesterId: string;
    divisionId: string;
    lectureType: LectureType;
    batch?: string | null;
}

class CourseService {
    public async create(data: CourseCreateData): Promise<Course> {
        // Check for duplicates based on the unique constraint
        const existingCourse = await prisma.course.findUnique({
            where: {
                subjectId_facultyId_semesterId_divisionId_lectureType_batch: {
                    ...data,
                    batch: data.batch ? data.batch : "-",
                },
            },
        });

        if (existingCourse && !existingCourse.isDeleted) {
            throw new AppError(
                "This exact course allocation already exists.",
                409
            );
        }

        return prisma.course.create({ data });
    }

    public async getByDivision(divisionId: string): Promise<Course[]> {
        return prisma.course.findMany({
            where: { divisionId, isDeleted: false },
            include: {
                subject: true,
                faculty: true,
            },
            orderBy: { subject: { name: "asc" } },
        });
    }

    public async delete(id: string): Promise<void> {
        const course = await prisma.course.findUnique({ where: { id } });
        if (!course) throw new AppError("Course offering not found.", 404);

        await prisma.course.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}

export const courseService = new CourseService();
