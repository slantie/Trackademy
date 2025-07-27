/**
@file src/components/landing/Features.tsx
@description Features section for the Trackademy landing page.
*/

"use client";

import { motion } from "framer-motion";
import {
    Award,
    UserCheck,
    BarChart3,
    Briefcase,
    FileText,
    LayoutList,
    MessageCircle,
    GitFork,
} from "lucide-react"; // Import necessary Lucide icons

// Animation variants for framer-motion
const animations = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3, duration: 0.6, ease: "easeOut" as const }, // Adjusted delay for sequential components
    },
};

// Features section component
export function Features() {
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
                "Uses machine learning to analyze student performance trends, identify weak areas, predict academic risk, and recommend interventions.",
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
        <motion.div
            className="py-10 sm:py-16 md:py-20 lg:py-24 xl:py-28" // Consistent section padding
            {...animations.fadeInUp}
        >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-10 sm:mb-12 lg:mb-16 tracking-tight">
                Key Features for Enhanced Academic Management
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                {featuresToShow.map((feature, index) => {
                    const Icon = feature.icon; // Use capitalized Icon for component rendering
                    return (
                        <div
                            key={index}
                            className="bg-light-secondary dark:bg-dark-secondary p-6 sm:p-8 rounded-xl shadow-md
                                       hover:shadow-xl transform hover:scale-105 transition-transform duration-300
                                       flex flex-col items-start text-left" // Ensure content aligns left
                        >
                            <div className="text-light-highlight dark:text-dark-highlight mb-4">
                                <Icon className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />{" "}
                                {/* Responsive icon size */}
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold text-light-text dark:text-dark-text mb-2 leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-base sm:text-lg text-light-muted-text dark:text-dark-muted-text leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
