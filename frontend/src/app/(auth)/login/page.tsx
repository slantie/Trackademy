/**
 * @file src/app/(auth)/login/page.tsx
 * @description Login page component
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginRequest } from "@/interfaces/auth";
import { useAuth } from "@/contexts/AuthContext";
import { PublicRoute } from "@/components/PublicRoute";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { showToast } from "@/lib/toast"; // Assuming this utility exists

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginRequest>({
        identifier: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await login(formData);
            showToast.success("Login successful! Redirecting...");
            // No explicit redirect here. The <PublicRoute> component will handle it.
            // This prevents a race condition and keeps the login page from entering browser history.
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err.message ||
                "Login failed. Please check your credentials.";
            showToast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <PublicRoute>
            <div className="w-full max-w-md mx-auto">
                <div className="bg-light-muted-background dark:bg-dark-muted-background rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <LogIn className="h-12 w-12 mx-auto mb-4 text-light-highlight dark:text-dark-highlight" />
                        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
                            Welcome Back
                        </h1>
                        <p className="text-light-muted-text dark:text-dark-muted-text mt-2">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Identifier Field */}
                        <div>
                            <label
                                htmlFor="identifier"
                                className="block text-sm font-medium text-light-text dark:text-dark-text mb-2"
                            >
                                Email or Enrollment Number
                            </label>
                            <input
                                type="text"
                                id="identifier"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                required
                                className={cn(
                                    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                    "border-light-muted-background dark:border-dark-muted-background",
                                    "bg-light-background dark:bg-dark-background",
                                    "text-light-text dark:text-dark-text",
                                    "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                    "placeholder:text-light-muted-text dark:placeholder:text-dark-muted-text"
                                )}
                                placeholder="Enter your email or enrollment number"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-light-text dark:text-dark-text mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className={cn(
                                        "w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                        "border-light-muted-background dark:border-dark-muted-background",
                                        "bg-light-background dark:bg-dark-background",
                                        "text-light-text dark:text-dark-text",
                                        "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                        "placeholder:text-light-muted-text dark:placeholder:text-dark-muted-text"
                                    )}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-light-muted-text dark:text-dark-muted-text hover:text-light-text dark:hover:text-dark-text"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "w-full py-2 px-4 rounded-lg font-medium transition-colors",
                                "bg-light-highlight text-white hover:bg-light-hover",
                                "dark:bg-dark-highlight dark:hover:bg-dark-hover",
                                "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-light-muted-text dark:text-dark-muted-text">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="text-light-highlight dark:text-dark-highlight hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-light-background dark:bg-dark-background rounded-lg border border-light-muted-background dark:border-dark-muted-background">
                        <h3 className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
                            Demo Credentials:
                        </h3>
                        <div className="text-xs text-light-muted-text dark:text-dark-muted-text space-y-1">
                            <p>
                                <strong>Student:</strong> 210303105123 /
                                student123
                            </p>
                            <p>
                                <strong>Faculty:</strong> faculty@ldrp.edu /
                                faculty123
                            </p>
                            <p>
                                <strong>Admin:</strong> admin@ldrp.edu /
                                admin123
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicRoute>
    );
}
