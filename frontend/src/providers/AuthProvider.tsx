/**
 * @file src/providers/auth.provider.ts
 * @description The authentication provider component that manages user state and actions.
 */
"use client";

import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { AuthContext, AuthContextType } from "@/contexts/auth.context";
import { authService } from "@/services/auth.service";
import { setAuthToken } from "@/lib/axiosInstance";
import { User, LoginRequest } from "../interfaces/auth.types";
import { showToast } from "@/lib/toast";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start as true to check for session

    const logout = useCallback(() => {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("authToken");
    }, []);

    // Check for an existing session token on initial app load
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = localStorage.getItem("authToken");
            if (token) {
                setAuthToken(token);
                try {
                    const currentUser = await authService.getMe();
                    setUser(currentUser);
                } catch (error) {
                    console.error(
                        "Session token is invalid or expired.",
                        error
                    );
                    logout(); // Clear invalid token
                }
            }
            setIsLoading(false);
        };
        checkAuthStatus();
    }, [logout]);

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authService.login(credentials);
            const { token, data } = response;

            setUser(data.user);
            setAuthToken(token);
            localStorage.setItem("authToken", token);
            showToast.success("Login successful!");
        } catch (error: any) {
            console.error("Login failed:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Invalid credentials or server error.";
            showToast.error(`Login failed: ${errorMessage}`);
            logout(); // Ensure clean state on failure
            throw error; // Re-throw to be handled by the UI component
        }
    };

    const authContextValue: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
