/**
 * @file src/services/course.service.ts
 * @description Enhanced service layer for managing course offerings (subject allocations) with comprehensive CRUD operations.
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

type CourseUpdateData = Partial<CourseCreateData> & { isDeleted?: boolean };

interface CourseQueryOptions {
    page?: number;
    limit?: number;
    subjectId?: string;
    facultyId?: string;
    semesterId?: string;
    divisionId?: string;
    lectureType?: LectureType;
    batch?: string;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: "subject" | "faculty" | "lectureType" | "createdAt";
    sortOrder?: "asc" | "desc";
}

class CourseService {
    public async create(data: CourseCreateData): Promise<Course> {
        // Validate subject exists
        const subject = await prisma.subject.findUnique({
            where: { id: data.subjectId, isDeleted: false },
        });
        if (!subject) {
            throw new AppError("Subject not found.", 404);
        }

        // Validate faculty exists
        const faculty = await prisma.faculty.findUnique({
            where: { id: data.facultyId, isDeleted: false },
        });
        if (!faculty) {
            throw new AppError("Faculty not found.", 404);
        }

        // Validate semester exists
        const semester = await prisma.semester.findUnique({
            where: { id: data.semesterId, isDeleted: false },
        });
        if (!semester) {
            throw new AppError("Semester not found.", 404);
        }

        // Validate division exists
        const division = await prisma.division.findUnique({
            where: { id: data.divisionId, isDeleted: false },
        });
        if (!division) {
            throw new AppError("Division not found.", 404);
        }

        // Check for existing course allocation
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

        return prisma.course.create({
            data,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    public async getAll(options: CourseQueryOptions = {}) {
        const {
            subjectId,
            facultyId,
            semesterId,
            divisionId,
            lectureType,
            batch,
            search,
            includeDeleted = false,
            sortBy = "subject",
            sortOrder = "asc",
        } = options;

        const where: any = {};

        if (!includeDeleted) {
            where.isDeleted = false;
        }

        if (subjectId) where.subjectId = subjectId;
        if (facultyId) where.facultyId = facultyId;
        if (semesterId) where.semesterId = semesterId;
        if (divisionId) where.divisionId = divisionId;
        if (lectureType) where.lectureType = lectureType;
        if (batch) where.batch = batch;

        if (search) {
            where.OR = [
                {
                    subject: {
                        name: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    subject: {
                        code: { contains: search, mode: "insensitive" },
                    },
                },
                {
                    faculty: {
                        fullName: { contains: search, mode: "insensitive" },
                    },
                },
                { batch: { contains: search, mode: "insensitive" } },
            ];
        }

        const orderBy: any = {};
        if (sortBy === "subject") orderBy.subject = { name: sortOrder };
        else if (sortBy === "faculty")
            orderBy.faculty = { fullName: sortOrder };
        else if (sortBy === "lectureType" || sortBy === "createdAt")
            orderBy[sortBy] = sortOrder;
        else orderBy.subject = { name: "asc" };

        const courses = await prisma.course.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: { id: true, year: true, isActive: true },
                        },
                    },
                },
                division: { select: { id: true, name: true } },
            },
            orderBy,
        });

        return { data: courses };
    }

    public async getCount(
        options: Omit<CourseQueryOptions, "page" | "limit"> = {}
    ) {
        const {
            subjectId,
            facultyId,
            semesterId,
            divisionId,
            lectureType,
            batch,
            search,
            includeDeleted = false,
        } = options;

        const where: any = {};

        if (!includeDeleted) {
            where.isDeleted = false;
        }

        if (subjectId) {
            where.subjectId = subjectId;
        }

        if (facultyId) {
            where.facultyId = facultyId;
        }

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (lectureType) {
            where.lectureType = lectureType;
        }

        if (batch) {
            where.batch = batch;
        }

        if (search) {
            where.OR = [
                {
                    subject: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    subject: {
                        code: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    faculty: {
                        fullName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    batch: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }

        const count = await prisma.course.count({ where });
        return { count };
    }

    public async search(
        query: string,
        options: {
            subjectId?: string;
            facultyId?: string;
            semesterId?: string;
            divisionId?: string;
            lectureType?: LectureType;
            limit?: number;
        } = {}
    ) {
        const {
            subjectId,
            facultyId,
            semesterId,
            divisionId,
            lectureType,
            limit = 20,
        } = options;

        const where: any = {
            isDeleted: false,
            OR: [
                {
                    subject: {
                        name: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    subject: {
                        code: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    faculty: {
                        fullName: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    batch: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        };

        if (subjectId) {
            where.subjectId = subjectId;
        }

        if (facultyId) {
            where.facultyId = facultyId;
        }

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (lectureType) {
            where.lectureType = lectureType;
        }

        return prisma.course.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                subject: { name: "asc" },
            },
            take: limit,
        });
    }

    public async getBySubject(
        subjectId: string,
        options: {
            semesterId?: string;
            divisionId?: string;
            lectureType?: LectureType;
            limit?: number;
        } = {}
    ) {
        const { semesterId, divisionId, lectureType, limit = 20 } = options;

        const where: any = {
            subjectId,
            isDeleted: false,
        };

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (lectureType) {
            where.lectureType = lectureType;
        }

        return prisma.course.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                faculty: { fullName: "asc" },
            },
            take: limit,
        });
    }

    public async getByFaculty(
        facultyId: string,
        options: {
            semesterId?: string;
            divisionId?: string;
            lectureType?: LectureType;
            limit?: number;
        } = {}
    ) {
        const { semesterId, divisionId, lectureType, limit = 20 } = options;

        const where: any = {
            facultyId,
            isDeleted: false,
        };

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (lectureType) {
            where.lectureType = lectureType;
        }

        return prisma.course.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                subject: { name: "asc" },
            },
            take: limit,
        });
    }

    public async getBySemester(
        semesterId: string,
        options: {
            divisionId?: string;
            facultyId?: string;
            lectureType?: LectureType;
            limit?: number;
        } = {}
    ) {
        const { divisionId, facultyId, lectureType, limit = 50 } = options;

        const where: any = {
            semesterId,
            isDeleted: false,
        };

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (facultyId) {
            where.facultyId = facultyId;
        }

        if (lectureType) {
            where.lectureType = lectureType;
        }

        return prisma.course.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [
                { subject: { name: "asc" } },
                { faculty: { fullName: "asc" } },
            ],
            take: limit,
        });
    }

    public async getByDivision(divisionId: string): Promise<Course[]> {
        return prisma.course.findMany({
            where: { divisionId, isDeleted: false },
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
            },
            orderBy: { subject: { name: "asc" } },
        });
    }

    public async getByLectureType(
        lectureType: LectureType,
        options: {
            semesterId?: string;
            divisionId?: string;
            facultyId?: string;
            limit?: number;
        } = {}
    ) {
        const { semesterId, divisionId, facultyId, limit = 20 } = options;

        const where: any = {
            lectureType,
            isDeleted: false,
        };

        if (semesterId) {
            where.semesterId = semesterId;
        }

        if (divisionId) {
            where.divisionId = divisionId;
        }

        if (facultyId) {
            where.facultyId = facultyId;
        }

        return prisma.course.findMany({
            where,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                subject: { name: "asc" },
            },
            take: limit,
        });
    }

    public async getId(id: string): Promise<Course> {
        const course = await prisma.course.findFirst({
            where: { id, isDeleted: false },
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!course) {
            throw new AppError("Course not found.", 404);
        }

        return course;
    }

    public async getByIdWithRelations(id: string) {
        return this.getId(id);
    }

    public async update(id: string, data: CourseUpdateData): Promise<Course> {
        const existingCourse = await prisma.course.findFirst({
            where: { id, isDeleted: false },
        });

        if (!existingCourse) {
            throw new AppError("Course not found.", 404);
        }

        // If updating core fields, check for conflicts
        if (
            data.subjectId ||
            data.facultyId ||
            data.semesterId ||
            data.divisionId ||
            data.lectureType ||
            data.batch !== undefined
        ) {
            const updateData = {
                subjectId: data.subjectId || existingCourse.subjectId,
                facultyId: data.facultyId || existingCourse.facultyId,
                semesterId: data.semesterId || existingCourse.semesterId,
                divisionId: data.divisionId || existingCourse.divisionId,
                lectureType: data.lectureType || existingCourse.lectureType,
                batch:
                    data.batch !== undefined
                        ? data.batch || "-"
                        : existingCourse.batch || "-",
            };

            const conflictingCourse = await prisma.course.findFirst({
                where: {
                    subjectId: updateData.subjectId,
                    facultyId: updateData.facultyId,
                    semesterId: updateData.semesterId,
                    divisionId: updateData.divisionId,
                    lectureType: updateData.lectureType,
                    batch: updateData.batch,
                    id: { not: id },
                    isDeleted: false,
                },
            });

            if (conflictingCourse) {
                throw new AppError(
                    "A course with this combination already exists.",
                    409
                );
            }
        }

        return prisma.course.update({
            where: { id },
            data,
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    public async delete(id: string): Promise<void> {
        const course = await prisma.course.findFirst({
            where: { id, isDeleted: false },
        });

        if (!course) {
            throw new AppError("Course not found.", 404);
        }

        await prisma.course.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    public async restore(id: string): Promise<Course> {
        const course = await prisma.course.findFirst({
            where: { id, isDeleted: true },
        });

        if (!course) {
            throw new AppError("Course not found or not deleted.", 404);
        }

        return prisma.course.update({
            where: { id },
            data: { isDeleted: false },
            include: {
                subject: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                        abbreviation: true,
                        type: true,
                    },
                },
                faculty: {
                    select: {
                        id: true,
                        fullName: true,
                        designation: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                    },
                },
                semester: {
                    select: {
                        id: true,
                        semesterNumber: true,
                        semesterType: true,
                        department: {
                            select: {
                                id: true,
                                name: true,
                                abbreviation: true,
                            },
                        },
                        academicYear: {
                            select: {
                                id: true,
                                year: true,
                                isActive: true,
                            },
                        },
                    },
                },
                division: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    public async hardDelete(id: string): Promise<void> {
        const course = await prisma.course.findFirst({
            where: { id },
            include: {
                _count: {
                    select: {
                        Attendance: true,
                        enrollments: true,
                    },
                },
            },
        });

        if (!course) {
            throw new AppError("Course not found.", 404);
        }

        // Check for dependencies
        const totalRelations =
            (course._count?.Attendance || 0) +
            (course._count?.enrollments || 0);

        if (totalRelations > 0) {
            throw new AppError(
                "Cannot permanently delete course with existing attendance records or enrollments.",
                409
            );
        }

        await prisma.course.delete({
            where: { id },
        });
    }

    public async getStatistics(
        options: {
            subjectId?: string;
            facultyId?: string;
            semesterId?: string;
            divisionId?: string;
        } = {}
    ) {
        const where: any = {};

        if (options.subjectId) {
            where.subjectId = options.subjectId;
        }

        if (options.facultyId) {
            where.facultyId = options.facultyId;
        }

        if (options.semesterId) {
            where.semesterId = options.semesterId;
        }

        if (options.divisionId) {
            where.divisionId = options.divisionId;
        }

        const [
            totalCourses,
            activeCourses,
            deletedCourses,
            coursesByLectureType,
            coursesBySubject,
            coursesByFaculty,
        ] = await Promise.all([
            // Total courses
            prisma.course.count({ where }),

            // Active courses
            prisma.course.count({
                where: { ...where, isDeleted: false },
            }),

            // Deleted courses
            prisma.course.count({
                where: { ...where, isDeleted: true },
            }),

            // Courses by lecture type
            prisma.course.groupBy({
                by: ["lectureType"],
                where: { ...where, isDeleted: false },
                _count: true,
            }),

            // Courses by subject
            prisma.course.findMany({
                where: { ...where, isDeleted: false },
                include: {
                    subject: { select: { name: true } },
                    _count: {
                        select: {
                            Attendance: true,
                            enrollments: true,
                        },
                    },
                },
                orderBy: {
                    Attendance: { _count: "desc" },
                },
                take: 5,
            }),

            // Courses by faculty
            prisma.course.findMany({
                where: { ...where, isDeleted: false },
                include: {
                    faculty: { select: { fullName: true } },
                    _count: {
                        select: {
                            Attendance: true,
                            enrollments: true,
                        },
                    },
                },
                orderBy: {
                    enrollments: { _count: "desc" },
                },
                take: 5,
            }),
        ]);

        return {
            overview: {
                total: totalCourses,
                active: activeCourses,
                deleted: deletedCourses,
            },
            distribution: {
                byLectureType: coursesByLectureType,
            },
            topPerformers: {
                mostAttendance: coursesBySubject.map((course) => ({
                    id: course.id,
                    subject: course.subject.name,
                    lectureType: course.lectureType,
                    attendanceCount: course._count.Attendance,
                })),
                mostEnrollments: coursesByFaculty.map((course) => ({
                    id: course.id,
                    faculty: course.faculty.fullName,
                    lectureType: course.lectureType,
                    enrollmentCount: course._count.enrollments,
                })),
            },
        };
    }
}

export const courseService = new CourseService();
