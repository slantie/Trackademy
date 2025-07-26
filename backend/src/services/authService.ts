/**
 * @file src/services/authService.ts
 * @description Authentication service containing business logic for user authentication
 */

import prisma from '../config/database';
import { comparePassword, isEmail, hashPassword } from '../utils/auth';
import { AuthenticatedUser, RegisterStudentRequest, RegisterFacultyRequest, RegisterAdminRequest } from '../types/auth';

export class AuthService {
  /**
   * Authenticate user by identifier (rollNumber or email) and password
   */
  static async authenticateUser(identifier: string, password: string): Promise<AuthenticatedUser | null> {
    try {
      let user: any = null;
      let fullName: string = '';

      if (isEmail(identifier)) {
        // Faculty/Admin login with email
        user = await prisma.user.findUnique({
          where: { email: identifier },
          include: {
            faculty: true
          }
        });

        if (user && user.faculty) {
          fullName = user.faculty.fullName;
        }
      } else {
        // Student login with rollNumber
        const student = await prisma.student.findUnique({
          where: { enrollmentNumber: identifier },
          include: { user: true }
        });

        if (student) {
          user = student.user;
          fullName = student.fullName;
        }
      }

      // If user not found, return null
      if (!user) {
        return null;
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      // Return authenticated user data
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: fullName
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }
  /**
 * Register a new faculty member
 */
  static async registerFaculty(data: RegisterFacultyRequest) {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Check if department exists
      const department = await prisma.department.findUnique({
        where: { id: data.departmentId }
      });

      if (!department) {
        throw new Error('Invalid department ID');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user and faculty in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            role: 'FACULTY'
          }
        });

        // Create faculty
        const faculty = await tx.faculty.create({
          data: {
            fullName: data.fullName,
            designation: data.designation,
            userId: user.id,
            departmentId: data.departmentId
          }
        });

        return { user, faculty };
      });

      return {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role
      };
    } catch (error) {
      console.error('Faculty registration error:', error);
      throw error;
    }
  }

  /**
   * Register a new admin
   */
  static async registerAdmin(data: RegisterAdminRequest) {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create admin user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });

      return {
        id: user.id,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      console.error('Admin registration error:', error);
      throw error;
    }
  }
  /**
   * Register a new student
   */
  static async registerStudent(data: RegisterStudentRequest) {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Check if enrollment number already exists
      const existingStudent = await prisma.student.findUnique({
        where: { enrollmentNumber: data.enrollmentNumber }
      });

      if (existingStudent) {
        throw new Error('Enrollment number already registered');
      }

      // Check if division exists
      const division = await prisma.division.findUnique({
        where: { id: data.divisionId }
      });

      if (!division) {
        throw new Error('Invalid division ID');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user and student in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: data.email,
            password: hashedPassword,
            role: 'STUDENT'
          }
        });

        // Create student
        const student = await tx.student.create({
          data: {
            enrollmentNumber: data.enrollmentNumber,
            fullName: data.fullName,
            userId: user.id,
            divisionId: data.divisionId
          }
        });

        return { user, student };
      });

      return {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role
      };
    } catch (error) {
      console.error('Student registration error:', error);
      throw error;
    }
  }

}