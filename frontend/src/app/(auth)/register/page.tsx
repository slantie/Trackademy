/**
 * @file src/app/(auth)/register/page.tsx
 * @description Registration page component with role selection
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    RegisterStudentRequest,
    RegisterFacultyRequest,
} from "@/interfaces/auth";
import { useAuth } from "@/contexts/authContext";
import { PublicRoute } from "@/components/PublicRoute";
import { cn } from "@/lib/utils";
import {
    Eye,
    EyeOff,
    UserPlus,
    GraduationCap,
    Users,
    Loader,
} from "lucide-react";
import { showToast } from "@/lib/toast"; // Assuming this utility exists
import { AuthLayout } from "@/components/auth/AuthLayout";
import { motion } from "framer-motion";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

type UserRole = "student" | "faculty";

const initialFormState = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    enrollmentNumber: "",
    designation: "",
    divisionId: "",
    departmentId: "",
};

export default function RegisterPage() {
    const [selectedRole, setSelectedRole] = useState<UserRole>("student");
    const [formData, setFormData] = useState(initialFormState);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { registerStudent, registerFaculty } = useAuth();
    const router = useRouter();

    const handleRoleChange = (role: UserRole) => {
        setSelectedRole(role);
        setFormData(initialFormState); // Reset form on role change for clean state
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (formData.password !== formData.confirmPassword) {
            showToast.error("Passwords do not match");
            return;
        }

        setIsSubmitting(true);

        try {
            let response;
            if (selectedRole === "student") {
                const studentData: RegisterStudentRequest = {
                    email: formData.email,
                    password: formData.password,
                    enrollmentNumber: formData.enrollmentNumber,
                    fullName: formData.fullName,
                    divisionId: formData.divisionId,
                };
                response = await registerStudent(studentData);
            } else {
                const facultyData: RegisterFacultyRequest = {
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    designation: formData.designation,
                    departmentId: formData.departmentId,
                };
                response = await registerFaculty(facultyData);
            }

            showToast.success(response.message || "Registration successful!");
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: unknown) {
            let errorMessage = "Registration failed. Please try again.";
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

    const roleOptions = [
        {
            value: "student" as UserRole,
            label: "Student",
            icon: GraduationCap,
            // description: "Register as a student",
        },
        {
            value: "faculty" as UserRole,
            label: "Faculty",
            icon: Users,
            // description: "Register as a faculty member",
        },
    ];

    return (
        <PublicRoute>
            <AuthLayout>
                <motion.div
                    className="w-full w-2xl" // Use max-w-xl for consistent width as login form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white/80 dark:bg-dark-background/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 border-2 border-light-muted-text/10 dark:border-dark-muted-text/10">
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-light-highlight to-light-secondary bg-clip-text text-transparent mb-2 dark:from-dark-highlight dark:to-dark-secondary">
                                Create Account
                            </h1>
                            <p className="text-light-muted-text dark:text-dark-muted-text text-sm sm:text-base">
                                Join Trackademy today
                            </p>
                        </div>

                        {/* Role Selection */}
                        <div className="mb-6 sm:mb-8">
                            {" "}
                            {/* Adjusted margin for consistency */}
                            <h3 className="text-lg font-medium text-light-text dark:text-dark-text mb-4">
                                Select Your Role
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {roleOptions.map((role) => {
                                    const Icon = role.icon;
                                    return (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() =>
                                                handleRoleChange(role.value)
                                            }
                                            className={cn(
                                                "p-4 rounded-xl border-2 transition-colors text-left shadow-sm hover:shadow-md", // Added shadow for consistency
                                                selectedRole === role.value
                                                    ? "border-light-highlight dark:border-dark-highlight bg-light-highlight/10 dark:bg-dark-highlight/10"
                                                    : "border-light-muted-background dark:border-dark-muted-background hover:border-light-highlight/50 dark:hover:border-dark-highlight/50",
                                                "flex items-center gap-2" // Ensures icon and text are aligned
                                            )}
                                        >
                                            <div className="flex items-center">
                                                {" "}
                                                {/* Removed this div to simplify, icon and span can be direct children of button */}
                                                <Icon className="h-6 w-6 mr-2 text-light-highlight dark:text-dark-highlight flex-shrink-0" />{" "}
                                                {/* Added flex-shrink-0 for icon */}
                                                <span className="font-medium text-light-text dark:text-dark-text">
                                                    {role.label}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 sm:space-y-6"
                        >
                            {/* Common Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                        className={cn(
                                            "w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-white dark:bg-dark-muted-background",
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                            "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                        )}
                                        placeholder="Jhon Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className={cn(
                                            "w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-white dark:bg-dark-muted-background",
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                            "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                        )}
                                        placeholder="jhon_doe@ldrp.ac.in"
                                    />
                                </div>
                            </div>

                            {/* Role-specific Fields */}
                            {selectedRole === "student" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                            Enrollment Number
                                        </label>
                                        <input
                                            type="text"
                                            name="enrollmentNumber"
                                            value={formData.enrollmentNumber}
                                            onChange={handleChange}
                                            required
                                            className={cn(
                                                "w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                                "border-light-muted-background dark:border-dark-muted-background",
                                                "bg-white dark:bg-dark-muted-background",
                                                "text-light-text dark:text-dark-text",
                                                "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                                "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                            )}
                                            placeholder="22BECE30091"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                            Division ID
                                        </label>
                                        <input
                                            type="text"
                                            name="divisionId"
                                            value={formData.divisionId}
                                            onChange={handleChange}
                                            required
                                            className={cn(
                                                "w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                                "border-light-muted-background dark:border-dark-muted-background",
                                                "bg-white dark:bg-dark-muted-background",
                                                "text-light-text dark:text-dark-text",
                                                "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                                "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                            )}
                                            placeholder="Contact admin for Division ID"
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedRole === "faculty" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                            Designation
                                        </label>
                                        <input
                                            type="text"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            required
                                            className={cn(
                                                "w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                                "border-light-muted-background dark:border-dark-muted-background",
                                                "bg-white dark:bg-dark-muted-background",
                                                "text-light-text dark:text-dark-text",
                                                "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                                "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                            )}
                                            placeholder="Assistant Professor"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                            Department ID
                                        </label>
                                        <input
                                            type="text"
                                            name="departmentId"
                                            value={formData.departmentId}
                                            onChange={handleChange}
                                            required
                                            className={cn(
                                                "w-full px-4 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                                "border-light-muted-background dark:border-dark-muted-background",
                                                "bg-white dark:bg-dark-muted-background",
                                                "text-light-text dark:text-dark-text",
                                                "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                                "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                            )}
                                            placeholder="Contact admin for Department ID"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className={cn(
                                                "w-full px-4 py-3.5 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                                "border-light-muted-background dark:border-dark-muted-background",
                                                "bg-white dark:bg-dark-muted-background",
                                                "text-light-text dark:text-dark-text",
                                                "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                                "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                            )}
                                            placeholder="Enter password"
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
                                                <RiEyeOffLine className="h-5 w-5" />
                                            ) : (
                                                <RiEyeLine className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className={cn(
                                                "w-full px-4 py-3.5 pr-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                                                "border-light-muted-background dark:border-dark-muted-background",
                                                "bg-white dark:bg-dark-muted-background",
                                                "text-light-text dark:text-dark-text",
                                                "focus:ring-light-highlight dark:focus:ring-dark-highlight",
                                                "placeholder:text-light-muted-text/50 dark:placeholder:text-dark-muted-text/50"
                                            )}
                                            placeholder="Confirm password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-light-muted-text dark:text-dark-muted-text hover:text-light-text dark:hover:text-dark-text"
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirm password"
                                                    : "Show confirm password"
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <RiEyeOffLine className="h-5 w-5" />
                                            ) : (
                                                <RiEyeLine className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }} // Adjusted to match login button's hover scale
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "w-full py-3 sm:py-4 bg-gradient-to-r from-light-highlight to-light-secondary text-white rounded-xl text-lg font-semibold transition-all hover:from-light-secondary hover:to-light-highlight focus:ring-2 focus:ring-light-highlight/50 shadow-lg shadow-light-highlight/30 flex items-center justify-center gap-2",
                                    "dark:from-dark-highlight dark:to-dark-secondary dark:hover:from-dark-secondary dark:hover:to-dark-highlight dark:focus:ring-dark-highlight/50 dark:shadow-dark-highlight/20",
                                    {
                                        "opacity-50 cursor-not-allowed":
                                            isSubmitting,
                                    } // Use isSubmitting for register
                                )}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </motion.button>
                        </form>

                        {/* Footer */}
                        <p className="mt-4 text-center text-sm text-light-muted-text dark:text-dark-text">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-light-highlight dark:text-dark-highlight hover:underline font-medium transition-colors"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </AuthLayout>
        </PublicRoute>
    );
}
