/**
 * @file src/components/ui/ThemeToggle.tsx
 * @description Theme toggle component for switching between light and dark modes
 */

"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium",
                "h-10 w-10 transition-colors",
                "bg-light-muted-background text-light-text hover:bg-light-hover hover:text-white",
                "dark:bg-dark-muted-background dark:text-dark-text dark:hover:bg-dark-hover"
            )}
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    );
}
