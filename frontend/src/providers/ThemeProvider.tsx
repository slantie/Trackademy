/**
 * @file src/providers/ThemeProvider.tsx
 * @description Provider for managing the application's light/dark theme.
 */
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDarkMode, setIsDark] = useState<boolean>(false);
    const [isClient, setIsClient] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
        const storedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = (dark: boolean) => {
            setIsDark(dark);
            document.documentElement.classList.toggle("dark", dark);
        };

        if (storedTheme === "dark") {
            applyTheme(true);
        } else if (storedTheme === "light") {
            applyTheme(false);
        } else {
            applyTheme(prefersDark.matches);
        }

        const mediaQueryListener = (e: MediaQueryListEvent) =>
            applyTheme(e.matches);
        prefersDark.addEventListener("change", mediaQueryListener);

        return () => {
            prefersDark.removeEventListener("change", mediaQueryListener);
        };
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark((prevIsDark) => {
            const newIsDark = !prevIsDark;
            localStorage.setItem("theme", newIsDark ? "dark" : "light");
            document.documentElement.classList.toggle("dark", newIsDark);
            return newIsDark;
        });
    }, []);

    const contextValue: ThemeContextType = {
        isDarkMode: isClient ? isDarkMode : false, // Provide a default for SSR
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
