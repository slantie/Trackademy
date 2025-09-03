/**
 * @file src/controllers/course.controller.ts
 * @description Enhanced controller for handling course offering API requests with comprehensive CRUD operations.
 */

import { Request, Response, NextFunction } from "express";
import { courseService } from "../services/course.service";
import { LectureType } from "@prisma/client";
import { prisma } from "../config/prisma.service";

export class CourseController {
  static async createCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newCourse = await courseService.create(req.body);
      res.status(201).json({
        status: "success",
        message: "Course created successfully",
        data: { course: newCourse },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        subjectId,
        facultyId,
        facultyUserId,
        semesterId,
        divisionId,
        lectureType,
        batch,
        search,
        includeDeleted,
        sortBy,
        sortOrder,
      } = req.query;

      let resolvedFacultyId = facultyId as string;

      // If facultyUserId is provided, look up the faculty record
      if (facultyUserId && !facultyId) {
        const faculty = await prisma.faculty.findUnique({
          where: { userId: facultyUserId as string, isDeleted: false },
        });
        if (faculty) {
          resolvedFacultyId = faculty.id;
        }
      }

      const options = {
        subjectId: subjectId as string,
        facultyId: resolvedFacultyId,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        lectureType: lectureType as LectureType,
        batch: batch as string,
        search: search as string,
        includeDeleted: includeDeleted === "true",
        sortBy: sortBy as "subject" | "faculty" | "lectureType" | "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
      };

      const result = await courseService.getAll(options);

      res.status(200).json({
        status: "success",
        results: result.data.length,
        data: { courses: result.data },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoursesCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        subjectId,
        facultyId,
        semesterId,
        divisionId,
        lectureType,
        batch,
        search,
        includeDeleted,
      } = req.query;

      const options = {
        subjectId: subjectId as string,
        facultyId: facultyId as string,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        lectureType: lectureType as LectureType,
        batch: batch as string,
        search: search as string,
        includeDeleted: includeDeleted === "true",
      };

      const result = await courseService.getCount(options);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q } = req.query;
      const {
        subjectId,
        facultyId,
        semesterId,
        divisionId,
        lectureType,
        limit,
      } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({
          status: "error",
          message: "Search query 'q' is required",
        });
        return;
      }

      const options = {
        subjectId: subjectId as string,
        facultyId: facultyId as string,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        lectureType: lectureType as LectureType,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const courses = await courseService.search(q, options);

      res.status(200).json({
        status: "success",
        results: courses.length,
        data: { courses },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoursesBySubject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { subjectId } = req.params;
      const { semesterId, divisionId, lectureType, limit } = req.query;

      const options = {
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        lectureType: lectureType as LectureType,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const courses = await courseService.getBySubject(subjectId, options);

      res.status(200).json({
        status: "success",
        results: courses.length,
        data: { courses },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoursesByFaculty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { facultyId } = req.params;
      const { semesterId, divisionId, lectureType, limit } = req.query;

      const options = {
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        lectureType: lectureType as LectureType,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const courses = await courseService.getByFaculty(facultyId, options);

      res.status(200).json({
        status: "success",
        results: courses.length,
        data: { courses },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoursesBySemester(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { semesterId } = req.params;
      const { divisionId, facultyId, lectureType, limit } = req.query;

      const options = {
        divisionId: divisionId as string,
        facultyId: facultyId as string,
        lectureType: lectureType as LectureType,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const courses = await courseService.getBySemester(semesterId, options);

      res.status(200).json({
        status: "success",
        results: courses.length,
        data: { courses },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoursesByDivision(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { divisionId } = req.params;
      const courses = await courseService.getByDivision(divisionId);

      res.status(200).json({
        status: "success",
        results: courses.length,
        data: { courses },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoursesByLectureType(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { lectureType } = req.params;
      const { semesterId, divisionId, facultyId, limit } = req.query;

      const options = {
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        facultyId: facultyId as string,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const courses = await courseService.getByLectureType(
        lectureType as LectureType,
        options
      );

      res.status(200).json({
        status: "success",
        results: courses.length,
        data: { courses },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCourseById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const course = await courseService.getId(req.params.id);
      res.status(200).json({
        status: "success",
        data: { course },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCourseByIdWithRelations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const course = await courseService.getByIdWithRelations(req.params.id);
      res.status(200).json({
        status: "success",
        data: { course },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedCourse = await courseService.update(req.params.id, req.body);
      res.status(200).json({
        status: "success",
        message: "Course updated successfully",
        data: { course: updatedCourse },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await courseService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  static async restoreCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const restoredCourse = await courseService.restore(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Course restored successfully",
        data: { course: restoredCourse },
      });
    } catch (error) {
      next(error);
    }
  }

  static async hardDeleteCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await courseService.hardDelete(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Course permanently deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCourseStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { subjectId, facultyId, semesterId, divisionId } = req.query;

      const options = {
        subjectId: subjectId as string,
        facultyId: facultyId as string,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
      };

      const statistics = await courseService.getStatistics(options);

      res.status(200).json({
        status: "success",
        data: { statistics },
      });
    } catch (error) {
      next(error);
    }
  }
}
