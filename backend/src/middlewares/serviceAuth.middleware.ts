/**
 * @file src/middlewares/serviceAuth.middleware.ts
 * @description Middleware for service-to-service authentication using API keys.
 */

import AppError from "../utils/appError";
import config from "../config";
import { Request, Response, NextFunction } from "express";

// Authenticates service-to-service requests using API keys.
export const serviceAuthMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const apiKey = req.headers["x-api-key"];

    // Checks if API key is provided.
    if (!apiKey) {
        throw new AppError(
            "API key is required for service-to-service communication",
            401
        );
    }

    // Validates the provided API key.
    if (apiKey !== config.serviceApiKey) {
        throw new AppError("Invalid API key", 401);
    }

    // Attaches service user context to the request.
    (req as any).user = {
        id: "service-account",
        email: "service@system.internal",
        designation: "SUPER_ADMIN",
        isService: true,
        permissions: ["read:all", "write:all"],
    };

    next();
};
