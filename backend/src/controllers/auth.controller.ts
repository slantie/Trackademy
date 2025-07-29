/**
 * @file src/controllers/auth.controller.ts
 * @description Controller for handling all authentication-related API requests.
 */

import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import {
    LoginRequest,
    RegisterFacultyRequest,
    RegisterAdminRequest,
} from "../types/auth.types";
import AppError from "../utils/appError"; // Assuming a custom AppError class

export class AuthController {
    /**
     * Handles user login for all roles (Student, Faculty, Admin).
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    static async login(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { identifier, password }: LoginRequest = req.body;

            if (!identifier || !password) {
                throw new AppError(
                    "Identifier and password are required.",
                    400
                );
            }

            // The service now returns both the user object and the token
            const { user, token } = await authService.authenticateUser(
                identifier,
                password
            );

            res.status(200).json({
                status: "success",
                token,
                data: {
                    user,
                },
            });
        } catch (error) {
            next(error); // Pass errors to the global error handler
        }
    }

    /**
     * Handles the registration of a new Faculty member.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    static async registerFaculty(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const {
                email,
                password,
                fullName,
                designation,
                departmentId,
            }: RegisterFacultyRequest = req.body;

            // Basic validation
            if (
                !email ||
                !password ||
                !fullName ||
                !designation ||
                !departmentId
            ) {
                throw new AppError(
                    "All fields are required for faculty registration.",
                    400
                );
            }

            const newUser = await authService.registerFaculty(req.body);

            res.status(201).json({
                status: "success",
                message: "Faculty registered successfully.",
                data: {
                    user: newUser,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles the registration of a new Admin user.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    static async registerAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, password, fullName }: RegisterAdminRequest =
                req.body;

            if (!email || !password || !fullName) {
                throw new AppError(
                    "Email, password, and full name are required for admin registration.",
                    400
                );
            }

            const newUser = await authService.registerAdmin(req.body);

            res.status(201).json({
                status: "success",
                message: "Admin registered successfully.",
                data: {
                    user: newUser,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Retrieves the profile of the currently authenticated user.
     * Assumes a middleware has already verified the JWT and attached the user payload to req.user.
     * @param req - Express request object, with user payload attached.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    static async getProfile(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            // req.user.id should be populated by an authentication middleware
            const userId = (req as any).user?.id;
            if (!userId) {
                throw new AppError(
                    "Authentication error: User ID not found.",
                    401
                );
            }

            const userProfile = await authService.getUserProfile(userId);

            res.status(200).json({
                status: "success",
                data: {
                    user: userProfile,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handles updating the password for the currently authenticated user.
     * @param req - Express request object.
     * @param res - Express response object.
     * @param next - Express next middleware function.
     */
    static async updatePassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = (req as any).user?.id;
            const { currentPassword, newPassword } = req.body;

            if (!userId) {
                throw new AppError(
                    "Authentication error: User ID not found.",
                    401
                );
            }
            if (!currentPassword || !newPassword) {
                throw new AppError(
                    "Current password and new password are required.",
                    400
                );
            }

            const message = await authService.updatePassword(
                userId,
                currentPassword,
                newPassword
            );

            res.status(200).json({
                status: "success",
                message,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * NOTE: Student registration is not handled via a public endpoint.
     * Students are created by Admins through a bulk import process.
     */
    // static async registerStudent(req: Request, res: Response, next: NextFunction): Promise<void> { ... }
}
