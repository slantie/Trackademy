/**
 * @file src/types/auth.types.ts
 * @description Type definitions for the Trackademy authentication system.
 */

import { Role, Designation, Student, Faculty, User } from "@prisma/client";

// --- API Request & Response Types ---

export interface LoginRequest {
  identifier: string; // Can be an email (for Faculty/Admin) or enrollment number (for Student)
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface RegisterFacultyRequest {
  email: string;
  password: string;
  fullName: string;
  designation: Designation; // Enforces the use of the Designation enum
  departmentId: string;
}

export interface RegisterAdminRequest {
  email: string;
  password: string;
  fullName: string; // Admins should also have a name
}

// A generic response for registration endpoints.
export interface RegisterResponse {
  message: string;
  user: Omit<User, "password">;
}

// --- Core & JWT Types ---

/**
 * Represents the structured user object returned after a successful authentication.
 * This object is used throughout the application frontend to represent the logged-in user.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  designation?: Designation | null; // Contains the designation for Faculty
  details?: any;
}

/**
 * Defines the data structure encoded within the JWT.
 * This is the payload that will be available in authenticated requests.
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}
