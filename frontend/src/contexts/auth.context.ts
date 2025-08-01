/**
 * @file src/contexts/auth.context.ts
 * @description Defines the authentication context and a custom hook for consuming it.
 */
"use client";

import { createContext, useContext } from "react";
import { User, LoginRequest } from "../interfaces/auth.types";

// Define the shape of the data and functions that the context will provide.
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
}

// Create the context with a default value of undefined.
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

/**
 * Custom hook to safely consume the AuthContext.
 * Ensures that the hook is used within a component wrapped by AuthProvider.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
