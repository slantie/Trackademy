/**
 * @file src/middlewares/auth.middleware.ts
 * @description Authentication and authorization middleware for protecting routes.
 */

import { Role } from "@prisma/client";
import AppError from "../utils/appError";
import { verifyToken } from "../utils/jwt";
import { JWTPayload } from "../types/auth.types";
import { Request, Response, NextFunction } from "express";

// Extend the global Express Request interface to include our custom 'user' property.
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

/**
 * Middleware to authenticate a JWT.
 * It verifies the token and attaches the decoded payload to the request object.
 */
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Authentication token is required.", 401);
        }

        const token = authHeader.split(" ")[1];
        const decodedPayload = verifyToken(token);

        // Attach the payload to the request for use in subsequent middleware/controllers.
        req.user = decodedPayload;

        next();
    } catch (error) {
        next(error); // Pass the error to the global error handler.
    }
};

/**
 * Middleware factory to authorize users based on their roles.
 * @param roles - An array of roles that are permitted to access the route.
 * @returns An Express middleware function.
 */
export const authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // This middleware must run after authenticate(), so req.user should be defined.
        if (!req.user) {
            // This case should ideally not be hit if authenticate runs first.
            return next(
                new AppError(
                    "Authentication required to check authorization.",
                    401
                )
            );
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    "You do not have permission to perform this action.",
                    403
                )
            );
        }

        next();
    };
};
