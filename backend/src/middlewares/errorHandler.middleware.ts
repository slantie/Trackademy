/**
 * @file src/middlewares/errorHandler.middleware.ts
 * @description Global error handling middleware for the application
 */

import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import AppError from "../utils/appError";

interface ErrorResponse {
  status: string;
  message: string;
  error?: any;
  stack?: string;
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", err);

  // Prisma Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaKnownRequestError(err);
  }

  // Prisma Validation Errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    error = handlePrismaValidationError(err);
  }

  // Prisma Init Errors
  if (err instanceof Prisma.PrismaClientInitializationError) {
    error = handlePrismaInitializationError(err);
  }

  // Zod Validation Errors
  if (err.name === "ZodError") {
    error = handleZodError(err);
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please login again.", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired. Please login again.", 401);
  }

  // Default to 500 server error
  if (!(error instanceof AppError)) {
    error = new AppError("Internal server error", 500);
  }

  const response: ErrorResponse = {
    status: error.status || "error",
    message: error.message,
  };

  // Add error details in development
  if (process.env.NODE_ENV === "development") {
    response.error = err;
    response.stack = err.stack;
  }

  res.status(error.statusCode || 500).json(response);
};

// Handle Prisma known request errors
const handlePrismaKnownRequestError = (
  err: Prisma.PrismaClientKnownRequestError
): AppError => {
  switch (err.code) {
    case "P2002":
      // Unique constraint violation
      const field = err.meta?.target as string[] | undefined;
      const fieldName = field ? field[0] : "field";
      return new AppError(
        `A record with this ${fieldName} already exists. Please use a different ${fieldName}.`,
        409
      );

    case "P2014":
      // Required relation violation
      return new AppError(
        "The change you're trying to make would violate a required relation.",
        400
      );

    case "P2003":
      // Foreign key constraint violation
      return new AppError(
        "This record cannot be deleted because it is referenced by other records.",
        400
      );

    case "P2025":
      // Record not found
      return new AppError("Record not found.", 404);

    case "P2016":
      // Query interpretation error
      return new AppError("Query error. Please check your request.", 400);

    default:
      return new AppError(`Database error: ${err.message}`, 400);
  }
};

// Handle Prisma validation errors
const handlePrismaValidationError = (
  err: Prisma.PrismaClientValidationError
): AppError => {
  return new AppError("Invalid data provided. Please check your input.", 400);
};

// Handle Prisma initialization errors
const handlePrismaInitializationError = (
  err: Prisma.PrismaClientInitializationError
): AppError => {
  return new AppError(
    "Database connection error. Please try again later.",
    500
  );
};

// Handle Zod validation errors
const handleZodError = (err: any): AppError => {
  const errors = err.errors?.map((e: any) => {
    return `${e.path.join(".")}: ${e.message}`;
  });

  const message = `Validation error: ${errors?.join(", ") || "Invalid input"}`;
  return new AppError(message, 400);
};
