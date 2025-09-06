/**
 * @file src/services/college.service.ts
 * @description Enhanced service layer for college-related business logic with comprehensive CRUD operations.
 */

import { prisma } from "../config/prisma.service";
import AppError from "../utils/appError";
import { College } from "@prisma/client";

interface CollegeCreateData {
  name: string;
  abbreviation: string;
  website?: string | null;
  address?: string | null;
  contactNumber?: string | null;
}

type CollegeUpdateData = Partial<CollegeCreateData> & { isDeleted?: boolean };

interface CollegeQueryOptions {
  search?: string;
  includeDeleted?: boolean;
  sortBy?: "name" | "abbreviation" | "createdAt";
  sortOrder?: "asc" | "desc";
}

class CollegeService {
  /**
   * Creates a new college.
   * @param data - The data for the new college.
   * @returns The newly created college.
   */
  public async create(data: CollegeCreateData): Promise<College> {
    // Convert empty strings to null for optional fields
    const sanitizedData = {
      ...data,
      website: data.website?.trim() || null,
      address: data.address?.trim() || null,
      contactNumber: data.contactNumber?.trim() || null,
    };

    try {
      return await prisma.college.create({
        data: sanitizedData,
        include: {
          _count: {
            select: {
              departments: true,
            },
          },
        },
      });
    } catch (error: any) {
      // Handle Prisma unique constraint errors specifically
      if (error.code === "P2002") {
        const field = error.meta?.target?.[0];
        if (field === "name") {
          throw new AppError(
            "A college with this name already exists. Please use a different name.",
            409
          );
        } else if (field === "abbreviation") {
          throw new AppError(
            "A college with this abbreviation already exists. Please use a different abbreviation.",
            409
          );
        } else {
          throw new AppError(
            "A college with this information already exists.",
            409
          );
        }
      }
      // Re-throw other errors
      throw error;
    }
  }

  public async getAll(options: CollegeQueryOptions = {}) {
    const {
      search,
      includeDeleted = false,
      sortBy = "name",
      sortOrder = "asc",
    } = options;

    const where: any = {};

    if (!includeDeleted) {
      where.isDeleted = false;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          abbreviation: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const orderBy: any = {};
    if (
      sortBy === "name" ||
      sortBy === "abbreviation" ||
      sortBy === "createdAt"
    ) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.name = "asc";
    }

    const colleges = await prisma.college.findMany({
      where,
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
      orderBy,
    });

    return { data: colleges };
  }

  public async getCount(options: CollegeQueryOptions = {}) {
    const { search, includeDeleted = false } = options;

    const where: any = {};

    if (!includeDeleted) {
      where.isDeleted = false;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          abbreviation: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const count = await prisma.college.count({ where });
    return { count };
  }

  public async search(
    query: string,
    options: {
      limit?: number;
    } = {}
  ) {
    const { limit = 20 } = options;

    const where: any = {
      isDeleted: false,
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          abbreviation: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    };

    return prisma.college.findMany({
      where,
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
      take: limit,
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
      include: {
        departments: {
          where: { isDeleted: false },
          select: {
            id: true,
            name: true,
            abbreviation: true,
            _count: {
              select: {
                semesters: true,
                faculties: true,
              },
            },
          },
          orderBy: { name: "asc" },
        },
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });

    if (!college) {
      throw new AppError("College not found.", 404);
    }
    return college;
  }

  public async getByIdWithRelations(id: string) {
    return this.getById(id);
  }

  /**
   * Updates an existing college.
   * @param id - The CUID of the college to update.
   * @param data - The data to update the college with.
   * @returns The updated college.
   */
  public async update(id: string, data: CollegeUpdateData): Promise<College> {
    const existingCollege = await prisma.college.findUnique({
      where: { id, isDeleted: false },
    });

    if (!existingCollege) {
      throw new AppError("College not found.", 404);
    }

    // Check for unique constraints if name or abbreviation is being updated
    if (data.name || data.abbreviation) {
      const conflictCollege = await prisma.college.findFirst({
        where: {
          OR: [
            ...(data.name ? [{ name: data.name }] : []),
            ...(data.abbreviation ? [{ abbreviation: data.abbreviation }] : []),
          ],
          isDeleted: false,
          NOT: { id },
        },
      });

      if (conflictCollege) {
        throw new AppError(
          "A college with this name or abbreviation already exists.",
          409
        );
      }
    }

    // Convert empty strings to null for optional fields
    const sanitizedData = { ...data };
    if ("website" in data) {
      sanitizedData.website = data.website?.trim() || null;
    }
    if ("address" in data) {
      sanitizedData.address = data.address?.trim() || null;
    }
    if ("contactNumber" in data) {
      sanitizedData.contactNumber = data.contactNumber?.trim() || null;
    }

    return prisma.college.update({
      where: { id },
      data: sanitizedData,
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });
  }

  /**
   * Soft deletes a college by setting its `isDeleted` flag to true.
   * @param id - The CUID of the college to delete.
   */
  public async delete(id: string): Promise<void> {
    const college = await prisma.college.findUnique({
      where: { id, isDeleted: false },
    });

    if (!college) {
      throw new AppError("College not found.", 404);
    }

    await prisma.college.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  public async restore(id: string): Promise<College> {
    const college = await prisma.college.findUnique({
      where: { id },
    });

    if (!college) {
      throw new AppError("College not found.", 404);
    }

    if (!college.isDeleted) {
      throw new AppError("College is not deleted.", 400);
    }

    return prisma.college.update({
      where: { id },
      data: { isDeleted: false },
      include: {
        _count: {
          select: {
            departments: true,
          },
        },
      },
    });
  }

  public async hardDelete(id: string): Promise<void> {
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        departments: true,
      },
    });

    if (!college) {
      throw new AppError("College not found.", 404);
    }

    // Check for dependencies
    if (college.departments.length > 0) {
      throw new AppError(
        `Cannot delete college. College has ${college.departments.length} department(s).`,
        400
      );
    }

    await prisma.college.delete({
      where: { id },
    });
  }

  public async getStatistics() {
    const [
      totalColleges,
      deletedColleges,
      collegesWithDepartments,
      avgDepartmentsPerCollege,
    ] = await Promise.all([
      prisma.college.count({
        where: { isDeleted: false },
      }),
      prisma.college.count({
        where: { isDeleted: true },
      }),
      prisma.college.count({
        where: {
          isDeleted: false,
          departments: {
            some: {
              isDeleted: false,
            },
          },
        },
      }),
      prisma.department.count({
        where: { isDeleted: false },
      }),
    ]);

    return {
      totalColleges,
      deletedColleges,
      collegesWithDepartments,
      collegesWithoutDepartments: totalColleges - collegesWithDepartments,
      avgDepartmentsPerCollege:
        totalColleges > 0
          ? (avgDepartmentsPerCollege / totalColleges).toFixed(2)
          : "0.00",
    };
  }
}

export const collegeService = new CollegeService();
