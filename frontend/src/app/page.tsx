/**
@file src/app/page.tsx
@description Home page for the Trackademy student management portal.
*/

"use client";

import { PublicRoute } from "@/components/PublicRoute";
import { TechStack } from "@/components/landing/TechStack";
import Image from "next/image";
import Link from "next/link";
import LightHeroElement from "/public/LightHeroElement.svg";
import DarkHeroElement from "/public/DarkHeroElement.svg";
import { motion } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import Header from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

import {
    SiNextdotjs,
    SiPostgresql,
    SiPrisma,
    SiTailwindcss,
    SiTypescript,
} from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import React from "react"; // Import React for React.ElementType

const techStack = [
    { icon: SiNextdotjs, name: "Next.js" },
    { icon: SiPostgresql, name: "PostgreSQL" },
    { icon: FaNodeJs, name: "Node.js" },
    { icon: SiTailwindcss, name: "Tailwind CSS" },
    { icon: SiPrisma, name: "Prisma" },
    { icon: SiTypescript, name: "TypeScript" },
];

import {
    Award,
    UserCheck,
    BarChart3,
    Briefcase,
    FileText,
    LayoutList,
    MessageCircle,
    GitFork,
} from "lucide-react";

const animations = {
    fadeInScale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1 },
    },
};

const featureAnimations = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3, duration: 0.6, ease: "easeOut" as const }, // Adjusted delay for sequential components
    },
};

// Main content for the home page
function HomePageContent() {
    const { isDarkMode } = useTheme();

    // Defined a richer set of features with Lucide icons
    const trackademyFeatures = [
        {
            title: "Secure Results Publishing",
            description:
                "Faculty securely upload and publish student results. Students view detailed subject-wise scores, ranks, and progress over time.",
            icon: Award, // Lucide icon
        },
        {
            title: "Real-time Attendance Monitoring",
            description:
                "Digitize attendance tracking with real-time dashboards showing present/absent days, percentages, and alerts for low attendance.",
            icon: UserCheck, // Lucide icon
        },
        {
            title: "AI-Powered Academic Analytics",
            description:
                "Uses machine learning to analyze student performance trends, identify weak areas, and recommend interventions.",
            icon: BarChart3, // Lucide icon
        },
        {
            title: "Internships Tracking & Review",
            description:
                "Students log internship experiences; faculty review, approve, and rate for academic credit and feedback.",
            icon: Briefcase, // Lucide icon
        },
        {
            title: "Certificates Collection & Tracking",
            description:
                "Centralized repository for students to upload and download certificates, enabling tagging, searching, and document verification.",
            icon: FileText, // Lucide icon
        },
        {
            title: "Student Projects Showcase",
            description:
                "Display student projects with categories, tags, and GitHub links. Filter by domain and batch. Acts as a portfolio builder.",
            icon: GitFork, // Lucide icon
        },
        {
            title: "Assignments & Submissions",
            description:
                "Faculty upload assignments with due dates; students submit work via uploads/links. Supports auto-reminders and graded feedback.",
            icon: LayoutList, // Lucide icon
        },
        {
            title: "Chatbot for FAQ",
            description:
                "An AI-powered chatbot trained on institutional policies, academic queries, and college FAQs. Provides 24/7 instant assistance.",
            icon: MessageCircle, // Lucide icon
        },
    ];

    // For the 3-column layout, we will display a subset or choose the most impactful ones.
    // Let's display the first 6 to fill a 2x3 grid, which looks good.
    const featuresToShow = trackademyFeatures.slice(0, 6);
    return (
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <Header />
            <div className="min-h-screen flex flex-col mx-auto px-16 py-6 md:py-20">
                {/* Increased padding around main content sections for a spacious feel */}
                <div className="mx-auto w-full">
                    {/* Hero Section */}
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text"
                        {...animations.fadeInScale}
                    >
                        <div className="space-y-4 mt-10 md:mt-20">
                            <h1 className="text-7xl md:text-7xl font-black text-light-highlight dark:text-dark-highlight tracking-tight">
                                Trackademy
                                <span className="block text-xl md:text-5xl text-light-text dark:text-dark-text mt-4">
                                    Empower Growth Through Efficient Student
                                    Management
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-light-text dark:text-dark-text">
                                Simplify student tracking, boost engagement, and
                                empower educators with Trackademy—your
                                all-in-one platform for seamless academic
                                management and growth.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4">
                                <Link
                                    href="/login"
                                    className="px-6 py-3 flex items-center justify-center text-center bg-light-highlight text-dark-muted-text rounded-lg hover:bg-primary-darker transition-colors duration-200 font-semibold border-2 border-light-highlight dark:border-dark-highlight dark:bg-dark-highlight dark:text-dark-muted-text hover:border-light-highlight dark:hover:border-dark-highlight text-lg hover:scale-105"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href="/about-us"
                                    className="px-6 py-3 flex items-center justify-center text-center text-light-text dark:text-dark-text rounded-lg border-2 border-light-muted-background bg-light-muted-background dark:border-dark-muted-background dark:bg-dark-muted-background hover:bg-primary-darker transition-colors duration-200 text-md font-bold hover:border-light-highlight dark:hover:border-dark-highlight text-lg hover:scale-105"
                                >
                                    How It Works
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-56 md:h-[450px]">
                            <Image
                                src={
                                    isDarkMode
                                        ? DarkHeroElement
                                        : LightHeroElement
                                }
                                alt="Reflectify Hero Element"
                                fill
                                className="object-contain transition-colors duration-300"
                            />
                        </div>
                    </motion.div>

                    {/* Features Section */}
                    <motion.div
                        className="py-10 sm:py-16 md:py-20 lg:py-24 xl:py-28"
                        {...featureAnimations.fadeInUp}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuresToShow.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={index}
                                        className="bg-light-muted-background dark:bg-dark-muted-background p-6 sm:p-8 rounded-xl shadow-md
                                                           hover:shadow-xl transform hover:scale-105 transition-transform duration-300
                                                           flex flex-col items-start text-left"
                                    >
                                        <div className="text-light-highlight dark:text-dark-highlight mb-4">
                                            <Icon className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />{" "}
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-light-text dark:text-dark-text mb-2 leading-tight">
                                            {feature.title}
                                        </h3>
                                        <p className="text-base sm:text-base text-light-muted-text dark:text-dark-muted-text leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
                {/* Tech Stack Section */}
                <div className="bg-light-background dark:bg-dark-background overflow-hidden">
                    <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold text-light-highlight dark:text-dark-highlight mb-12 text-center tracking-tight">
                        Underlying Technologies
                    </h2>
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear" as const,
                            repeatType: "loop",
                        }}
                        className="flex space-x-48 text-light-text dark:text-dark-text
                                    group-hover:text-light-highlight dark:group-hover:text-dark-highlight"
                    >
                        {[...techStack, ...techStack].map((tech, index) => {
                            // Cast the icon component to a React.ElementType that explicitly accepts a className
                            const IconComponent =
                                tech.icon as React.ElementType<{
                                    className?: string;
                                }>;
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col items-center gap-3 group flex-shrink-0 w-24 sm:w-32 md:w-40"
                                >
                                    <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-light-text dark:text-dark-text group-hover:text-light-highlight dark:group-hover:text-dark-highlight transition-colors transform group-hover:scale-110 duration-300" />
                                    <span className="text-base sm:text-lg font-medium text-light-text dark:text-dark-text">
                                        {tech.name}
                                    </span>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

// Home page wrapped with public route
export default function HomePage() {
    return (
        <PublicRoute>
            <HomePageContent />
        </PublicRoute>
    );
}
