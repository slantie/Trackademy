/**
 * @file src/services/auth.service.ts
 * @description Service layer for authentication and user management with RBAC.
 * Handles user registration (Faculty, Admin), login, profile retrieval, and password updates.
 */

import { User, Role, Designation } from "@prisma/client";
import { prisma } from "./prisma.service"; // Assuming prisma client is exported from here
import AppError from "../utils/appError"; // Assuming a custom AppError class exists
import { generateToken } from "../utils/jwt"; // Assuming a JWT utility
import { hashPassword, comparePassword } from "../utils/hash"; // Assuming hashing utilities
import { isEmail } from "../utils/validation"; // Utility to check if identifier is an email
import {
    AuthenticatedUser,
    RegisterFacultyRequest,
    RegisterAdminRequest,
    JWTPayload,
} from "../types/auth.types";

class AuthService {
    public async authenticateUser(
        identifier: string,
        password: string
    ): Promise<{ user: AuthenticatedUser; token: string }> {
        let user: User | null = null;
        let userProfile: { fullName: string; details?: any } = { fullName: "" };

        if (isEmail(identifier)) {
            // Login attempt for Faculty or Admin using email
            const foundUser = await prisma.user.findUnique({
                where: { email: identifier },
                include: {
                    faculty: true, // Include faculty profile if it exists
                },
            });

            if (foundUser) {
                user = foundUser;
                if (foundUser.role === "FACULTY" && foundUser.faculty) {
                    userProfile.fullName = foundUser.faculty.fullName;
                    userProfile.details = foundUser.faculty;
                } else if (foundUser.role === "ADMIN") {
                    // For Admins, we can use their email or a generic name
                    userProfile.fullName = "Administrator";
                }
            }
        } else {
            // Login attempt for Student using enrollment number
            const student = await prisma.student.findUnique({
                where: { enrollmentNumber: identifier },
                include: { user: true },
            });

            if (student && student.user) {
                user = student.user;
                userProfile.fullName = student.fullName;
                userProfile.details = student;
            }
        }

        // If no user was found with the identifier, or they are soft-deleted (if applicable)
        if (!user) {
            throw new AppError("Invalid credentials.", 401);
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new AppError("Invalid credentials.", 401);
        }

        // Construct the authenticated user object
        const authenticatedUser: AuthenticatedUser = {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName: userProfile.fullName,
            // details: userProfile.details,
        };

        // Find the User's Role and map to the correct Role Enum
        if (!Object.values(Role).includes(user.role)) {
            throw new AppError("Invalid user role.", 400);
        }
        // If the user is a Faculty, we can also include their designation
        if (user.role === "FACULTY" && userProfile.details) {
            authenticatedUser.designation = userProfile.details.designation;
        }

        const role_enum: Role =
            user.role === "ADMIN"
                ? Role.ADMIN
                : user.role === "FACULTY"
                ? Role.FACULTY
                : Role.STUDENT;

        const payload: JWTPayload = {
            userId: user.id,
            email: user.email,
            role: role_enum as Role,
        };

        // Generate a JWT token for the session
        const token = generateToken(payload);

        return { user: authenticatedUser, token };
    }

    public async registerFaculty(
        data: RegisterFacultyRequest
    ): Promise<Omit<User, "password">> {
        // Validate that the provided designation is a valid enum value
        if (!Object.values(Designation).includes(data.designation)) {
            throw new AppError("Invalid designation provided.", 400);
        }

        // Check if a user with this email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new AppError("A user with this email already exists.", 409); // 409 Conflict
        }

        const hashedPassword = await hashPassword(data.password);

        // Use a transaction to ensure both User and Faculty records are created successfully
        const newUser = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    role: "FACULTY",
                },
            });

            await tx.faculty.create({
                data: {
                    userId: user.id,
                    fullName: data.fullName,
                    designation: data.designation, // This is now a validated enum value
                    departmentId: data.departmentId,
                },
            });

            return user;
        });

        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    public async registerAdmin(
        data: RegisterAdminRequest
    ): Promise<Omit<User, "password">> {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new AppError("A user with this email already exists.", 409);
        }

        const hashedPassword = await hashPassword(data.password);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                role: "ADMIN",
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    public async getUserProfile(userId: string): Promise<AuthenticatedUser> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                student: true,
                faculty: true,
            },
        });

        if (!user) {
            throw new AppError("User not found.", 404);
        }

        let fullName = "";
        let details: any = null;

        if (user.role === "STUDENT" && user.student) {
            fullName = user.student.fullName;
            details = user.student;
        } else if (user.role === "FACULTY" && user.faculty) {
            fullName = user.faculty.fullName;
            details = user.faculty;
        } else if (user.role === "ADMIN") {
            fullName = "Administrator";
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role,
            fullName,
            // details,
        };
    }

    public async updatePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<string> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError("User not found.", 404);
        }

        const isMatch = await comparePassword(currentPassword, user.password);
        if (!isMatch) {
            throw new AppError("Current password is incorrect.", 401);
        }

        const hashedNewPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedNewPassword },
        });

        return "Password updated successfully.";
    }
}

export const authService = new AuthService();
