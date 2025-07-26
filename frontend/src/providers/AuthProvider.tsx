"use client"; // This directive is necessary for using hooks in Next.js App Router

import React, { useState, useEffect, ReactNode, useCallback } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthService, setAuthToken } from "@/services/AuthService";
import {
    User,
    LoginRequest,
    RegisterStudentRequest,
    RegisterFacultyRequest,
    RegisterAdminRequest,
    RegisterResponse,
} from "../interfaces/auth";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to handle logout
    const logout = useCallback(() => {
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("token");
    }, []);

    // Effect to check for an existing token and validate it with the server
    useEffect(() => {
        const validateToken = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setAuthToken(storedToken);
                try {
                    const currentUser = await AuthService.getMe();
                    setUser(currentUser);
                } catch (error) {
                    console.error("Session validation failed:", error);
                    logout(); // Token is invalid or expired
                }
            }
            setIsLoading(false);
        };

        validateToken();
    }, [logout]);

    // Login function
    const login = async (credentials: LoginRequest) => {
        try {
            const { token, user: loggedInUser } = await AuthService.login(
                credentials
            );
            setUser(loggedInUser);
            setAuthToken(token);
            localStorage.setItem("token", token);
        } catch (error) {
            console.error("Login failed:", error);
            logout(); // Ensure clean state on failure
            throw error; // Re-throw to be handled by the UI component
        }
    };

    // Registration functions
    const registerStudent = async (
        data: RegisterStudentRequest
    ): Promise<RegisterResponse> => {
        return AuthService.registerStudent(data);
    };

    const registerFaculty = async (
        data: RegisterFacultyRequest
    ): Promise<RegisterResponse> => {
        return AuthService.registerFaculty(data);
    };

    const registerAdmin = async (
        data: RegisterAdminRequest
    ): Promise<RegisterResponse> => {
        return AuthService.registerAdmin(data);
    };

    // The context value that will be supplied to all children
    const authContextValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        registerStudent,
        registerFaculty,
        registerAdmin,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
