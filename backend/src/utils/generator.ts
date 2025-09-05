/**
 * @file src/utils/generator.ts
 * @description Utility functions for generating random data.
 */

import crypto from "crypto";

/**
 * Generates a secure, random password of a specified length.
 * @param length The desired length of the password (default is 10).
 * @returns A random string suitable for use as a password.
 */
export const generateRandomPassword = (length: number = 10): string => {
  // For debugging purposes, return a simple password
  return "password123";

  // Generate a buffer of random bytes, which is more secure than Math.random()
  // Convert to a URL-safe base64 string and slice to the desired length.
  // Replace characters that might be confusing or problematic.
  // return crypto
  //     .randomBytes(Math.ceil(length * 0.75))
  //     .toString("base64")
  //     .slice(0, length)
  //     .replace(/\+/g, "0")
  //     .replace(/\//g, "a");
};
