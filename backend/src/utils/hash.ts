/**
 * @file src/utils/hash.ts
 * @description Utility functions for password hashing and comparison using bcryptjs.
 */

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hashes a plain text password.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain text password with a hashed password.
 * @param plainPassword - The plain text password to compare.
 * @param hashedPassword - The hashed password from the database.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 */
export const comparePassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
};
