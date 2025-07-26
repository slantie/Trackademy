/**
 * @file src/app/(main)/home/page.tsx
 * @description Home page component
 */

"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
    BookOpen,
    Users,
    Calendar,
    BarChart3,
    GraduationCap,
    UserCheck,
    Clock,
    Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
    const { user } = useAuth();

    const features = [
        {
            icon: BookOpen,
            title: "Course Management",
            description:
                "Manage courses, subjects, and academic content efficiently.",
            color: "text-blue-500",
        },
        {
            icon: Users,
            title: "Student Management",
            description:
                "Track student enrollment, progress, and academic records.",
            color: "text-green-500",
        },
        {
            icon: UserCheck,
            title: "Attendance Tracking",
            description: "Monitor and manage student attendance with ease.",
            color: "text-purple-500",
        },
        {
            icon: BarChart3,
            title: "Analytics & Reports",
            description: "Generate comprehensive reports and analytics.",
            color: "text-orange-500",
        },
        {
            icon: Calendar,
            title: "Schedule Management",
            description: "Organize classes, exams, and academic events.",
            color: "text-red-500",
        },
        {
            icon: Award,
            title: "Grade Management",
            description: "Track grades, assessments, and academic performance.",
            color: "text-indigo-500",
        },
    ];

    return (
        <div className="mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="text-center py-12 md:py-20">
                <div className="mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-light-text dark:text-dark-text">
                        Welcome to{" "}
                        <span className="text-light-highlight dark:text-dark-highlight">
                            StudentPortal
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-light-muted-text dark:text-dark-muted-text">
                        A comprehensive student management system designed for
                        modern educational institutions.
                    </p>

                    {user ? (
                        <div className="bg-light-muted-background dark:bg-dark-muted-background rounded-lg p-6 mb-8">
                            <h2 className="text-2xl font-semibold mb-2 text-light-text dark:text-dark-text">
                                Welcome back, {user.fullName}!
                            </h2>
                            <p className="text-light-muted-text dark:text-dark-muted-text">
                                Role:{" "}
                                <span className="font-medium capitalize">
                                    {user.role.toLowerCase()}
                                </span>
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/login"
                                className={cn(
                                    "inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-colors",
                                    "bg-light-highlight text-white hover:bg-light-hover",
                                    "dark:bg-dark-highlight dark:hover:bg-dark-hover"
                                )}
                            >
                                <Clock className="mr-2 h-5 w-5" />
                                Get Started
                            </Link>
                            <Link
                                href="/register"
                                className={cn(
                                    "inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-colors border",
                                    "border-light-highlight text-light-highlight hover:bg-light-highlight hover:text-white",
                                    "dark:border-dark-highlight dark:text-dark-highlight dark:hover:bg-dark-highlight dark:hover:text-white"
                                )}
                            >
                                <GraduationCap className="mr-2 h-5 w-5" />
                                Register Now
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12">
                <div className="mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-light-text dark:text-dark-text">
                        Powerful Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-light-muted-background dark:bg-dark-muted-background rounded-lg p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-center mb-4">
                                        <Icon
                                            className={cn(
                                                "h-8 w-8 mr-3",
                                                feature.color
                                            )}
                                        />
                                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-light-muted-text dark:text-dark-muted-text">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 text-center">
                <div className="mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-light-text dark:text-dark-text">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl mb-8 text-light-muted-text dark:text-dark-muted-text">
                        Join thousands of educational institutions already using
                        StudentPortal.
                    </p>

                    {!user && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className={cn(
                                    "inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-colors",
                                    "bg-light-highlight text-white hover:bg-light-hover",
                                    "dark:bg-dark-highlight dark:hover:bg-dark-hover"
                                )}
                            >
                                Start Free Trial
                            </Link>
                            <Link
                                href="/login"
                                className={cn(
                                    "inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-colors border",
                                    "border-light-highlight text-light-highlight hover:bg-light-highlight hover:text-white",
                                    "dark:border-dark-highlight dark:text-dark-highlight dark:hover:bg-dark-highlight dark:hover:text-white"
                                )}
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
