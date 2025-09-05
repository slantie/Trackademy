/**
 * @file src/controllers/student.controller.ts
 * @description Enhanced controller for handling student profile management API requests with comprehensive CRUD operations.
 */

import { Request, Response, NextFunction } from "express";
import { studentService } from "../services/student.service";

export class StudentController {
  static async createStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newStudent = await studentService.create(req.body);
      res.status(201).json({
        status: "success",
        message: "Student created successfully",
        data: { student: newStudent },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        departmentId,
        semesterId,
        divisionId,
        batch,
        search,
        includeDeleted,
        sortBy,
        sortOrder,
      } = req.query;

      const options = {
        departmentId: departmentId as string,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        batch: batch as string,
        search: search as string,
        includeDeleted: includeDeleted === "true",
        sortBy: sortBy as
          | "fullName"
          | "enrollmentNumber"
          | "batch"
          | "createdAt",
        sortOrder: sortOrder as "asc" | "desc",
      };

      const result = await studentService.getAll(options);

      res.status(200).json({
        status: "success",
        results: result.data.length,
        data: { students: result.data },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentsCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        departmentId,
        semesterId,
        divisionId,
        batch,
        search,
        includeDeleted,
      } = req.query;

      const options = {
        departmentId: departmentId as string,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        batch: batch as string,
        search: search as string,
        includeDeleted: includeDeleted === "true",
      };

      const result = await studentService.getCount(options);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async searchStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q } = req.query;
      const { departmentId, semesterId, divisionId, batch, limit } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({
          status: "error",
          message: "Search query 'q' is required",
        });
        return;
      }

      const options = {
        departmentId: departmentId as string,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        batch: batch as string,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const students = await studentService.search(q, options);

      res.status(200).json({
        status: "success",
        results: students.length,
        data: { students },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentsByDepartment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { departmentId } = req.params;
      const { semesterId, divisionId, batch, limit } = req.query;

      const options = {
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        batch: batch as string,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const students = await studentService.getByDepartment(
        departmentId,
        options
      );

      res.status(200).json({
        status: "success",
        results: students.length,
        data: { students },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentsBySemester(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { semesterId } = req.params;
      const { departmentId, divisionId, batch, limit } = req.query;

      const options = {
        departmentId: departmentId as string,
        divisionId: divisionId as string,
        batch: batch as string,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const students = await studentService.getBySemester(semesterId, options);

      res.status(200).json({
        status: "success",
        results: students.length,
        data: { students },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentsByDivision(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { divisionId } = req.params;
      const students = await studentService.getAllByDivision(divisionId);

      res.status(200).json({
        status: "success",
        results: students.length,
        data: { students },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentsByBatch(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { batch } = req.params;
      const { departmentId, semesterId, divisionId, limit } = req.query;

      const options = {
        departmentId: departmentId as string,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        limit: limit ? parseInt(limit as string) : undefined,
      };

      const students = await studentService.getByBatch(batch, options);

      res.status(200).json({
        status: "success",
        results: students.length,
        data: { students },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentByEnrollmentNumber(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { enrollmentNumber } = req.params;
      const student = await studentService.getByEnrollmentNumber(
        enrollmentNumber
      );

      if (!student) {
        res.status(404).json({
          status: "error",
          message: "Student not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: { student },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const student = await studentService.getById(req.params.id);
      res.status(200).json({
        status: "success",
        data: { student },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentByIdWithRelations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const student = await studentService.getByIdWithRelations(req.params.id);
      res.status(200).json({
        status: "success",
        data: { student },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updatedStudent = await studentService.update(
        req.params.id,
        req.body
      );
      res.status(200).json({
        status: "success",
        message: "Student updated successfully",
        data: { student: updatedStudent },
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await studentService.delete(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Student deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async restoreStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const restoredStudent = await studentService.restore(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Student restored successfully",
        data: { student: restoredStudent },
      });
    } catch (error) {
      next(error);
    }
  }

  static async hardDeleteStudent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await studentService.hardDelete(req.params.id);
      res.status(200).json({
        status: "success",
        message: "Student permanently deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudentStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { departmentId, semesterId, divisionId, batch } = req.query;

      const options = {
        departmentId: departmentId as string,
        semesterId: semesterId as string,
        divisionId: divisionId as string,
        batch: batch as string,
      };

      const statistics = await studentService.getStatistics(options);

      res.status(200).json({
        status: "success",
        data: { statistics },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;

      const student = await studentService.getPublicProfile(id);

      if (!student) {
        res.status(404).json({
          status: "error",
          message: "Student not found or profile is not public",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }
}
