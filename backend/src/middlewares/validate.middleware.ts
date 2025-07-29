/**
 * @file src/middlewares/validate.middleware.ts
 * @description Middleware for validating request data against Zod schemas.
 */

import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import AppError from "../utils/appError";

export const validate =
    (schema: ZodObject) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse and validate the request parts against the provided schema
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // If validation is successful, proceed to the next middleware/controller
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                // Extract a clean list of error messages from the ZodError
                const errorMessages = error.issues.map(
                    (issue) => issue.message
                );
                // Pass a formatted error to the global error handler
                return next(
                    new AppError(
                        `Validation failed: ${errorMessages.join(", ")}`,
                        400
                    )
                );
            }
            // Handle other unexpected errors
            next(new AppError("An unexpected validation error occurred.", 500));
        }
    };
