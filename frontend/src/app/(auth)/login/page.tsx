/**
 * @file src/app/(auth)/login/page.tsx
 * @description Login page component with integrated logic and modern UI.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { LoginRequest } from "@/interfaces/auth.types"; // Assuming LoginRequest is defined here
import { useAuth } from "@/contexts/auth.context"; // Your updated AuthContext
import { PublicRoute } from "@/components/PublicRoute"; // Assuming this component exists
import { cn } from "@/lib/utils"; // Assuming this utility exists
import { Loader, LogIn } from "lucide-react"; // For the main icon and loading spinner
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri"; // For password visibility toggle
import { showToast } from "@/lib/toast"; // Assuming this utility exists
import { AuthLayout } from "@/components/auth/AuthLayout"; // Assuming this component exists
import { motion } from "framer-motion"; // Assuming framer-motion is installed

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginRequest>({
        identifier: "", // This might be 'email' or 'username' depending on your LoginRequest interface
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    // isSubmitting is still useful for immediate UI feedback, even with global loading
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, loading } = useAuth(); // Destructure loading from useAuth

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Prevent multiple submissions if already submitting or global auth is loading
        if (isSubmitting || loading) return;

        setIsSubmitting(true); // Set local submitting state
        // loading from AuthContext will also be true due to login call

        try {
            await login(formData);
            // showToast.success("Login successful! Redirecting..."); // AuthContext already shows success toast
        } catch (err: unknown) {
            // Error handling is now primarily handled by AuthContext,
            // but this block catches any re-thrown errors or unexpected issues
            let errorMessage = "Login failed. Please check your credentials.";
            if (
                typeof err === "object" &&
                err !== null &&
                "response" in err &&
                typeof (err as { response?: { data?: { message?: string } } })
                    .response === "object" &&
                (err as { response?: { data?: { message?: string } } })
                    .response !== null &&
                "data" in
                    (err as { response?: { data?: { message?: string } } })
                        .response!
            ) {
                errorMessage =
                    (err as { response: { data: { message?: string } } })
                        .response.data.message || errorMessage;
            } else if (err instanceof Error) {
                errorMessage = err.message || errorMessage;
            }
            showToast.error(errorMessage); // Show specific error if available
        } finally {
            setIsSubmitting(false); // Reset local submitting state
            // loading from AuthContext will be set to false by AuthProvider's finally block
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Combine local submitting state with global loading from AuthContext
    const isOperationInProgress = isSubmitting || loading;

    return (
        <PublicRoute>
            <AuthLayout>
                <motion.div
                    className="min-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white/80 dark:bg-dark-background/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border-2 border-light-muted-text/10 dark:border-dark-muted-text/10">
                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-light-highlight dark:text-dark-highlight mb-2 flex items-center justify-center gap-2">
                                Login to Trackademy
                            </h1>
                            <p className="text-light-muted-text dark:text-dark-muted-text text-sm sm:text-base">
                                Sign in to your account
                            </p>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 sm:space-y-6"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="identifier"
                                    className="text-sm font-medium text-light-text dark:text-dark-text block"
                                >
                                    Email Address or Enrollment Number
                                </label>
                                <input
                                    type="text" // Changed to text as identifier can be email or enrollment number
                                    id="identifier"
                                    name="identifier" // Ensure name matches formData key
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                        "border-light-muted-background dark:border-dark-muted-background",
                                        "bg-white dark:bg-dark-muted-background", // Adjusted background for input fields
                                        "text-light-text dark:text-dark-text",
                                        "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                        "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                    )}
                                    placeholder="Enter your email or enrollment number"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-light-text dark:text-dark-text block"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        name="password" // Ensure name matches formData key
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={cn(
                                            "w-full px-4 py-3.5 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-white dark:bg-dark-muted-background", // Adjusted background for input fields
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                            "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                        )}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-light-muted-text dark:text-dark-muted-text hover:text-light-text dark:hover:text-dark-text"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? (
                                            <RiEyeOffLine size={20} />
                                        ) : (
                                            <RiEyeLine size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                // whileHover={{ scale: 1.005 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "w-full py-4 bg-light-highlight text-dark-muted-text rounded-lg hover:bg-primary-darker transition-colors duration-200 text-md font-bold dark:bg-dark-highlight dark:text-dark-muted-text hover:border-light-highlight dark:hover:border-dark-highlight text-lg",
                                    {
                                        "opacity-50 cursor-not-allowed":
                                            isOperationInProgress,
                                    }
                                )}
                                disabled={isOperationInProgress}
                            >
                                {isOperationInProgress ? (
                                    <>Signing In...</>
                                ) : (
                                    "Sign In"
                                )}
                            </motion.button>

                            <p className="text-center text-sm text-light-muted-text dark:text-dark-text mt-4">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/register"
                                    className="text-light-highlight dark:text-dark-highlight hover:underline font-medium transition-colors"
                                >
                                    Register
                                </Link>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </AuthLayout>
        </PublicRoute>
    );
}
