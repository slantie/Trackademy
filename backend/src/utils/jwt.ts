/**
 * @file src/utils/jwt.ts
 * @description Utility functions for JSON Web Token (JWT) generation and verification.
 */

import jwt, { SignOptions } from "jsonwebtoken";
import { JWTPayload } from "../types/auth.types";
import AppError from "./appError";
import config from "../config";

// It's highly recommended to manage these settings in a centralized config file.
const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = config.jwtExpiresIn;

/**
 * Generates a JWT for a given payload.
 * @param payload - The data to encode in the token (must conform to JWTPayload).
 * @returns The generated JWT string.
 */
export const generateToken = (payload: JWTPayload): string => {
    if (!JWT_SECRET) {
        throw new AppError(
            "Server configuration error: JWT secret is not defined.",
            500
        );
    }

    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
    };

    return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Verifies a JWT and returns its decoded payload.
 * @param token - The JWT string to verify.
 * @returns The decoded payload if the token is valid.
 */
export const verifyToken = (token: string): JWTPayload => {
    try {
        if (!JWT_SECRET) {
            throw new AppError(
                "Server configuration error: JWT secret is not defined.",
                500
            );
        }
        // Type assertion to ensure the decoded object matches our JWTPayload interface
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        // Catches errors like 'TokenExpiredError' or 'JsonWebTokenError'
        throw new AppError("Invalid or expired token.", 403); // 403 Forbidden
    }
};
