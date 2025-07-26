/**
 * @file src/types/auth.ts
 * @description Type definitions for authentication system
 */

export interface LoginRequest {
  identifier: string; // Can be rollNumber or email
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    role: string;
    fullName: string;
  };
}

export interface RegisterStudentRequest {
  email: string;
  password: string;
  enrollmentNumber: string;
  fullName: string;
  divisionId: string;
}

export interface RegisterFacultyRequest {
  email: string;
  password: string;
  fullName: string;
  designation: string;
  departmentId: string;
}

export interface RegisterAdminRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  userId: string;
  role: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}