/**
 * @file src/components/ui/ThemeToggle.tsx
 * @description Theme toggle component for switching between light and dark modes
 */

"use client";

import React from "react"; // No need for useState, useEffect here anymore
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils"; // Import the cn utility
import { useTheme } from "@/providers/ThemeProvider"; // Import useTheme hook

function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "inline-flex items-center justify-center rounded-lg text-sm font-medium",
                "h-10 w-10 transition-colors border-2 border-light-muted-background dark:border-dark-muted-background",
                "bg-light-muted-background text-light-text hover:border-light-highlight",
                "dark:bg-dark-muted-background dark:text-dark-text dark:hover:border-dark-highlight"
            )}
            aria-label="Toggle theme"
        >
            {/* h-[1.2rem] w-[1.2rem] group-hover:scale-105 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0.8*/}
            {isDarkMode ? (
                <Sun className="w-5 h-5 text-light-text dark:text-dark-text" />
            ) : (
                <Moon className="w-5 h-5 text-light-text dark:text-dark-text" />
            )}
        </button>
    );
}

export default ThemeToggle;
