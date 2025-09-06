/**
 * @file src/services/faculty.service.ts
 * @description Enhanced service layer for managing faculty profiles with comprehensive CRUD operations.
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

interface FacultyQueryOptions {
  departmentId?: string;
  designation?: Designation;
  search?: string;
  includeDeleted?: boolean;
}

class FacultyService {
  public async create(data: FacultyCreateData): Promise<Faculty> {
    // Validate department exists
    const department = await prisma.department.findUnique({
      where: { id: data.departmentId, isDeleted: false },
    });
    if (!department) {
      throw new AppError("Department not found.", 400);
    }

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
          joiningDate: data.joiningDate ? new Date(data.joiningDate) : null,
          departmentId: data.departmentId,
        },
        include: {
          department: {
            select: {
              id: true,
              name: true,
              abbreviation: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });
    });
  }

  public async getAll(options: FacultyQueryOptions = {}) {
    const {
      departmentId,
      designation,
      search,
      includeDeleted = false,
    } = options;

    const where: any = {};
    if (!includeDeleted) where.isDeleted = false;
    if (departmentId) where.departmentId = departmentId;
    if (designation) where.designation = designation;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { abbreviation: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const faculties = await prisma.faculty.findMany({
      where,
      include: {
        department: {
          select: { id: true, name: true, abbreviation: true },
        },
        user: { select: { id: true, email: true, role: true } },
      },
      orderBy: { fullName: "asc" },
    });

    return { data: faculties };
  }

  public async getCount(options: FacultyQueryOptions = {}) {
    const {
      departmentId,
      designation,
      search,
      includeDeleted = false,
    } = options;

    const where: any = {};

    if (!includeDeleted) {
      where.isDeleted = false;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    if (designation) {
      where.designation = designation;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { abbreviation: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const count = await prisma.faculty.count({ where });
    return { count };
  }

  public async search(
    query: string,
    options: { departmentId?: string; limit?: number } = {}
  ) {
    const { departmentId, limit = 20 } = options;

    const where: any = {
      isDeleted: false,
      OR: [
        { fullName: { contains: query, mode: "insensitive" } },
        { abbreviation: { contains: query, mode: "insensitive" } },
        { user: { email: { contains: query, mode: "insensitive" } } },
      ],
    };

    if (departmentId) {
      where.departmentId = departmentId;
    }

    return prisma.faculty.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { fullName: "asc" },
      take: limit,
    });
  }

  public async getByDesignation(
    designation: Designation,
    options: { departmentId?: string } = {}
  ) {
    const { departmentId } = options;

    const where: any = {
      designation,
      isDeleted: false,
    };

    if (departmentId) {
      where.departmentId = departmentId;
    }

    return prisma.faculty.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { fullName: "asc" },
    });
  }

  public async getGroupedByDesignation(departmentId?: string) {
    const where: any = { isDeleted: false };
    if (departmentId) {
      where.departmentId = departmentId;
    }

    const faculties = await prisma.faculty.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { fullName: "asc" },
    });

    // Group by designation
    const grouped = faculties.reduce((acc, faculty) => {
      const designation = faculty.designation;
      if (!acc[designation]) {
        acc[designation] = [];
      }
      acc[designation].push(faculty);
      return acc;
    }, {} as Record<Designation, typeof faculties>);

    return grouped;
  }

  public async getAllByDepartment(departmentId: string): Promise<Faculty[]> {
    return prisma.faculty.findMany({
      where: { departmentId, isDeleted: false },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { fullName: "asc" },
    });
  }

  public async getById(id: string): Promise<Faculty> {
    const faculty = await prisma.faculty.findUnique({
      where: { id, isDeleted: false },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
            college: {
              select: {
                id: true,
                name: true,
                abbreviation: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!faculty) throw new AppError("Faculty not found.", 404);
    return faculty;
  }

  public async getByIdWithRelations(id: string) {
    return this.getById(id);
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
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
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

  public async hardDelete(id: string): Promise<void> {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!faculty) {
      throw new AppError("Faculty not found.", 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.faculty.delete({ where: { id } });
      if (faculty.userId) {
        await tx.user.delete({ where: { id: faculty.userId } });
      }
    });
  }

  public async restore(id: string): Promise<Faculty> {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
    });

    if (!faculty) {
      throw new AppError("Faculty not found.", 404);
    }

    if (!faculty.isDeleted) {
      throw new AppError("Faculty is not deleted.", 400);
    }

    return prisma.faculty.update({
      where: { id },
      data: { isDeleted: false },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            abbreviation: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  public async getPublicProfile(facultyId: string): Promise<any | null> {
    try {
      const faculty = await prisma.faculty.findUnique({
        where: {
          id: facultyId,
          isDeleted: false,
        },
        include: {
          user: {
            select: {
              email: true,
              // Only include non-sensitive user information
            },
          },
          department: {
            select: {
              id: true,
              name: true,
              abbreviation: true,
            },
          },
          courses: {
            include: {
              subject: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                },
              },
              semester: {
                select: {
                  semesterNumber: true,
                  semesterType: true,
                },
              },
              division: {
                select: {
                  name: true,
                },
              },
              assignments: {
                include: {
                  _count: {
                    select: {
                      submissions: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  enrollments: true,
                },
              },
            },
          },
        },
      });

      if (!faculty) {
        return null;
      }

      // Get attendance statistics for courses taught
      const attendanceStats = await this.getFacultyAttendanceStats(facultyId);

      // Calculate overall statistics
      const totalCourses = faculty.courses.length;
      const totalStudents = faculty.courses.reduce(
        (acc: number, course: any) => acc + course._count.enrollments,
        0
      );

      // Get all assignments from all courses
      const allAssignments = faculty.courses.flatMap(
        (course: any) => course.assignments
      );
      const totalAssignments = allAssignments.length;
      const totalSubmissions = allAssignments.reduce(
        (acc: number, assignment: any) => acc + assignment._count.submissions,
        0
      );

      // Get unique subjects taught
      const uniqueSubjects = [
        ...new Set(faculty.courses.map((course: any) => course.subject.id)),
      ];
      const totalSubjects = uniqueSubjects.length;

      // Get unique semesters taught
      const uniqueSemesters = [
        ...new Set(
          faculty.courses.map((course: any) => course.semester.semesterNumber)
        ),
      ];

      return {
        ...faculty,
        statistics: {
          totalCourses,
          totalStudents,
          totalSubjects,
          totalAssignments,
          totalSubmissions,
          semestersTaught: uniqueSemesters.sort(),
          experience: faculty.joiningDate
            ? Math.floor(
                (new Date().getTime() -
                  new Date(faculty.joiningDate).getTime()) /
                  (1000 * 60 * 60 * 24 * 365)
              )
            : null,
        },
        attendanceStats,
      };
    } catch (error) {
      console.error("Error fetching public faculty profile:", error);
      throw new AppError("Failed to fetch faculty profile.", 500);
    }
  }

  private async getFacultyAttendanceStats(facultyId: string) {
    try {
      const courses = await prisma.course.findMany({
        where: {
          facultyId,
        },
        include: {
          Attendance: {
            select: {
              status: true,
            },
          },
          subject: {
            select: {
              name: true,
              code: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      });

      return courses.map((course: any) => {
        const totalClasses = course.Attendance.length;
        const attendanceByStatus = course.Attendance.reduce(
          (acc: any, record: any) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
          },
          {} as any
        );

        const averageAttendance =
          totalClasses > 0
            ? Math.round(
                ((attendanceByStatus.PRESENT || 0) / totalClasses) * 100 * 100
              ) / 100
            : 0;

        return {
          courseId: course.id,
          subjectName: course.subject.name,
          subjectCode: course.subject.code,
          totalStudents: course._count.enrollments,
          totalClasses,
          averageAttendance,
          attendanceByStatus,
        };
      });
    } catch (error) {
      console.error("Error fetching faculty attendance stats:", error);
      return [];
    }
  }
}

export const facultyService = new FacultyService();
