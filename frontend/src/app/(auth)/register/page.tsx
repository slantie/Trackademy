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
import { useAuth } from "@/contexts/AuthContext";
import { PublicRoute } from "@/components/PublicRoute";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, UserPlus, GraduationCap, Users } from "lucide-react";
import { showToast } from "@/lib/toast"; // Assuming this utility exists

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
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err.message ||
                "Registration failed. Please try again.";
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
            description: "Register as a student",
        },
        {
            value: "faculty" as UserRole,
            label: "Faculty",
            icon: Users,
            description: "Register as a faculty member",
        },
    ];

    return (
        <PublicRoute>
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-light-muted-background dark:bg-dark-muted-background rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <UserPlus className="h-12 w-12 mx-auto mb-4 text-light-highlight dark:text-dark-highlight" />
                        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
                            Create Account
                        </h1>
                        <p className="text-light-muted-text dark:text-dark-muted-text mt-2">
                            Join StudentPortal today
                        </p>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-8">
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
                                            "p-4 rounded-lg border-2 transition-colors text-left",
                                            selectedRole === role.value
                                                ? "border-light-highlight dark:border-dark-highlight bg-light-highlight/10 dark:bg-dark-highlight/10"
                                                : "border-light-muted-background dark:border-dark-muted-background hover:border-light-highlight/50 dark:hover:border-dark-highlight/50"
                                        )}
                                    >
                                        <div className="flex items-center mb-2">
                                            <Icon className="h-6 w-6 mr-2 text-light-highlight dark:text-dark-highlight" />
                                            <span className="font-medium text-light-text dark:text-dark-text">
                                                {role.label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                                            {role.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                        "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                        "border-light-muted-background dark:border-dark-muted-background",
                                        "bg-light-background dark:bg-dark-background",
                                        "text-light-text dark:text-dark-text",
                                        "focus:ring-light-highlight dark:focus:ring-dark-highlight"
                                    )}
                                    placeholder="Enter your full name"
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
                                        "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                        "border-light-muted-background dark:border-dark-muted-background",
                                        "bg-light-background dark:bg-dark-background",
                                        "text-light-text dark:text-dark-text",
                                        "focus:ring-light-highlight dark:focus:ring-dark-highlight"
                                    )}
                                    placeholder="Enter your email"
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
                                            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-light-background dark:bg-dark-background",
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight"
                                        )}
                                        placeholder="e.g., 210303105123"
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
                                            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-light-background dark:bg-dark-background",
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight"
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
                                            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-light-background dark:bg-dark-background",
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight"
                                        )}
                                        placeholder="e.g., Assistant Professor"
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
                                            "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-light-background dark:bg-dark-background",
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight"
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
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className={cn(
                                            "w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-light-background dark:bg-dark-background",
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight"
                                        )}
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-light-muted-text dark:text-dark-muted-text"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
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
                                            "w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                                            "border-light-muted-background dark:border-dark-muted-background",
                                            "bg-light-background dark:bg-dark-background",
                                            "text-light-text dark:text-dark-text",
                                            "focus:ring-light-highlight dark:focus:ring-dark-highlight"
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
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-light-muted-text dark:text-dark-muted-text"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
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
                            {isSubmitting
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-light-muted-text dark:text-dark-muted-text">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-light-highlight dark:text-dark-highlight hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </PublicRoute>
    );
}
