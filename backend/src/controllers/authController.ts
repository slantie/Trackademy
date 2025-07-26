/**
 * @file src/controllers/authController.ts
 * @description Authentication controller handling login requests and responses
 */

import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { generateToken } from '../utils/auth';
import {
  LoginRequest,
  LoginResponse,
  RegisterStudentRequest,
  RegisterFacultyRequest,
  RegisterAdminRequest,
  RegisterResponse
} from '../types/auth';

export class AuthController {
  /**
   * Handle user login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, password }: LoginRequest = req.body;

      // Validate input
      if (!identifier || !password) {
        res.status(400).json({
          message: 'Identifier and password are required'
        });
        return;
      }

      // Authenticate user
      const user = await AuthService.authenticateUser(identifier, password);

      if (!user) {
        res.status(401).json({
          message: 'Invalid credentials'
        });
        return;
      }

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        role: user.role
      });

      // Send success response
      const response: LoginResponse = {
        token,
        user: {
          id: user.id,
          role: user.role,
          fullName: user.fullName || ''
        }
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        message: 'Internal server error'
      });
    }
  }

  /**
   * Handle student registration
   */
  static async registerStudent(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, enrollmentNumber, fullName, divisionId }: RegisterStudentRequest = req.body;

      // Validate input
      if (!email || !password || !enrollmentNumber || !fullName || !divisionId) {
        res.status(400).json({
          message: 'All fields are required: email, password, enrollmentNumber, fullName, divisionId'
        });
        return;
      }

      // Register student
      const user = await AuthService.registerStudent({
        email,
        password,
        enrollmentNumber,
        fullName,
        divisionId
      });

      const response: RegisterResponse = {
        message: 'Student registered successfully',
        user
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error('Student registration error:', error);

      if (error.message === 'Email already registered' ||
        error.message === 'Enrollment number already registered' ||
        error.message === 'Invalid division ID') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Handle faculty registration
   */
  static async registerFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, designation, departmentId }: RegisterFacultyRequest = req.body;

      // Validate input
      if (!email || !password || !fullName || !designation || !departmentId) {
        res.status(400).json({
          message: 'All fields are required: email, password, fullName, designation, departmentId'
        });
        return;
      }

      // Register faculty
      const user = await AuthService.registerFaculty({
        email,
        password,
        fullName,
        designation,
        departmentId
      });

      const response: RegisterResponse = {
        message: 'Faculty registered successfully',
        user
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error('Faculty registration error:', error);

      if (error.message === 'Email already registered' ||
        error.message === 'Invalid department ID') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  /**
   * Handle admin registration
   */
  static async registerAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: RegisterAdminRequest = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({
          message: 'Email and password are required'
        });
        return;
      }

      // Register admin
      const user = await AuthService.registerAdmin({
        email,
        password
      });

      const response: RegisterResponse = {
        message: 'Admin registered successfully',
        user
      };

      res.status(201).json(response);
    } catch (error: any) {
      console.error('Admin registration error:', error);

      if (error.message === 'Email already registered') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}

