/**
 * @file src/lib/utils.ts
 * @description General utility functions for the frontend application.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A utility function to conditionally join Tailwind CSS classes without conflicts.
 * @param inputs - A list of class names or conditional class objects.
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
