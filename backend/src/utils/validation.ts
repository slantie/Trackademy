/**
 * @file src/utils/validation.ts
 * @description Common validation utility functions.
 */

/**
 * Checks if a given string is a valid email address.
 * @param identifier - The string to validate.
 * @returns True if the string is a valid email, otherwise false.
 */
export const isEmail = (identifier: string): boolean => {
    if (!identifier) return false;
    // A robust regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier);
};
