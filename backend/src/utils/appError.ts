/**
 * @file src/utils/appError.ts
 * @description Custom error class for handling operational errors with specific HTTP statuses.
 */

class AppError extends Error {
    public statusCode: number;
    public status: string;
    public isOperational: boolean;

    /**
     * Initializes a new operational error.
     * @param message - The error message.
     * @param statusCode - The HTTP status code associated with the error.
     */
    constructor(message: string, statusCode: number) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true; // Flag to distinguish from programming errors

        // Capture the stack trace, excluding the constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
