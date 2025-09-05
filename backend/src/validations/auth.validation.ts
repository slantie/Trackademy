/**
 * @file src/validations/auth.validation.ts
 * @description Zod validation schemas for authentication-related API requests.
 */

import { z } from "zod";

// Schema for user login
export const loginSchema = z.object({
  body: z.object({
    identifier: z
      .string()
      .min(1, "Identifier is required.")
      .max(100, "Identifier must not exceed 100 characters."),
    password: z
      .string()
      .min(1, "Password is required.")
      .max(100, "Password must not exceed 100 characters."),
  }),
});

// Schema for faculty registration
export const registerFacultySchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("A valid email address is required.")
      .max(100, "Email must not exceed 100 characters."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(100, "Password must not exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    fullName: z
      .string()
      .min(1, "Full name is required.")
      .max(100, "Full name must not exceed 100 characters."),
    designation: z.enum(
      ["PROFESSOR", "ASSOCIATE_PROFESSOR", "ASSISTANT_PROFESSOR", "LECTURER"],
      {
        message: "A valid designation is required.",
      }
    ),
    departmentId: z.string().cuid("A valid department ID is required."),
  }),
});

// Schema for admin registration
export const registerAdminSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("A valid email address is required.")
      .max(100, "Email must not exceed 100 characters."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .max(100, "Password must not exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    fullName: z
      .string()
      .min(1, "Full name is required.")
      .max(100, "Full name must not exceed 100 characters."),
  }),
});

// Schema for updating password (requires current password)
export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string()
      .min(1, "Current password is required.")
      .max(100, "Current password must not exceed 100 characters."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .max(100, "New password must not exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
  }),
});

// Schema for resetting user password (admin only - no current password required)
export const resetUserPasswordSchema = z.object({
  params: z.object({
    userId: z.string().cuid("A valid user ID is required."),
  }),
  body: z.object({
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .max(100, "New password must not exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
  }),
});

// Schema for resetting faculty password (admin only - no current password required)
export const resetFacultyPasswordSchema = z.object({
  params: z.object({
    id: z.string().cuid("A valid faculty ID is required."),
  }),
  body: z.object({
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .max(100, "New password must not exceed 100 characters.")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
  }),
});
