/**
 * @file src/contexts/AuthContext.tsx
 * @description Authentication context and provider for user state and actions,
 * including loading states and comprehensive registration methods.
 */
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { showToast } from "@/lib/toast"; // Assuming this path is correct
import { authService } from "@/services/authService"; // Assuming this path is correct

// Import your existing authentication interfaces
import {
    User,
    LoginRequest,
    RegisterStudentRequest,
    RegisterFacultyRequest,
    RegisterAdminRequest,
    RegisterResponse,
} from "../interfaces/auth"; // Ensure this path is correct relative to AuthContext.tsx

// Define the shape of the authentication context
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean; // Renamed from 'loading' for consistency with current project's interface
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    registerStudent: (
        data: RegisterStudentRequest
    ) => Promise<RegisterResponse>;
    registerFaculty: (
        data: RegisterFacultyRequest
    ) => Promise<RegisterResponse>;
    registerAdmin: (data: RegisterAdminRequest) => Promise<RegisterResponse>;
    checkAuth: () => Promise<void>; // Added checkAuth to context type
}

// Create the authentication context with an undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

// AuthProvider component to manage authentication state
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Initial loading state for auth check
    const router = useRouter();

    // Function to check authentication status
    const checkAuth = useCallback(async () => {
        setLoading(true); // Start loading
        try {
            const token = Cookies.get("authToken");
            if (!token) {
                setUser(null);
                return;
            }
            // Assuming authService.getMe() returns { data: { user: User } }
            const response = await authService.getMe();
            setUser(response); // Assuming response is directly the User object
        } catch (error: unknown) {
            console.error("Authentication check failed:", error);
            showToast.error("Session expired or invalid. Please log in again.");
            Cookies.remove("authToken"); // Clear invalid token
            setUser(null); // Ensure user is null on failure
            // Optionally redirect to login if auth check fails on a protected route
            // if (router.pathname !== '/login' && router.pathname !== '/') {
            //     router.replace('/login');
            // }
        } finally {
            setLoading(false); // End loading
        }
    }, []);

    // Effect to run authentication check on component mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Handle user login
    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authService.login(credentials);
            const { token, user: userData } = response; // Assuming response has token and user properties

            Cookies.set("authToken", token, {
                expires: 7, // Token expires in 7 days
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
            });
            setUser(userData);
            showToast.success("Logged in successfully!");
            router.replace("/dashboard"); // Redirect to dashboard or appropriate page
        } catch (error: unknown) {
            console.error("Login failed:", error);
            showToast.error(
                "Login failed: " +
                    (error instanceof Error
                        ? error.message
                        : "Invalid credentials.")
            );
            throw new Error("Login failed"); // Re-throw for component to handle if needed
        } finally {
            setLoading(false);
        }
    };

    // Handle user logout
    const logout = async () => {
        try {
            Cookies.remove("authToken");
            setUser(null);
            showToast.success("Logged out successfully!");
            router.replace("/");
        } catch (error) {
            showToast.error("Failed to log out: " + error);
            Cookies.remove("authToken");
            setUser(null);
        }
    };

    // Handle student registration
    const registerStudent = async (
        data: RegisterStudentRequest
    ): Promise<RegisterResponse> => {
        setLoading(true);
        try {
            const response = await authService.registerStudent(data);
            showToast.success(
                response.message || "Student registered successfully!"
            );
            // Optionally log in the user immediately after registration
            // if (response.token && response.user) {
            //     Cookies.set("authToken", response.token, { expires: 7, secure: process.env.NODE_ENV === "production", sameSite: "Lax" });
            //     setUser(response.user);
            //     router.replace("/dashboard");
            // }
            return response;
        } catch (error: Error | unknown) {
            console.error("Student registration failed:", error);
            showToast.error(
                "Registration failed: " +
                    (error instanceof Error
                        ? error.message
                        : "An error occurred.")
            );
            throw error; // Re-throw for component to handle
        } finally {
            setLoading(false);
        }
    };

    // Handle faculty registration
    const registerFaculty = async (
        data: RegisterFacultyRequest
    ): Promise<RegisterResponse> => {
        setLoading(true);
        try {
            const response = await authService.registerFaculty(data);
            showToast.success(
                response.message || "Faculty registered successfully!"
            );
            return response;
        } catch (error: Error | unknown) {
            console.error("Faculty registration failed:", error);
            showToast.error(
                "Registration failed: " +
                    (error instanceof Error
                        ? error.message
                        : "An error occurred.")
            );
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Handle admin registration
    const registerAdmin = async (
        data: RegisterAdminRequest
    ): Promise<RegisterResponse> => {
        setLoading(true);
        try {
            const response = await authService.registerAdmin(data);
            showToast.success(
                response.message || "Admin registered successfully!"
            );
            return response;
        } catch (error: Error | unknown) {
            console.error("Admin registration failed:", error);
            showToast.error(
                "Registration failed: " +
                    (error instanceof Error
                        ? error.message
                        : "An error occurred.")
            );
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Context value provided to consumers
    const contextValue: AuthContextType = {
        user,
        isAuthenticated: !!user, // True if user object exists
        loading,
        login,
        logout,
        registerStudent,
        registerFaculty,
        registerAdmin,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the authentication context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
