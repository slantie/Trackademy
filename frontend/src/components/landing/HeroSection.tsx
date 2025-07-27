/**
@file src/components/landing/HeroSection.tsx
@description Hero section for the Trackademy landing page.
*/

"use client";

import Image from "next/image";
import Link from "next/link";
// Assuming these images exist and are relevant for Trackademy
import LightHeroElement from "../../../public/LightHeroElement.svg";
import DarkHeroElement from "../../../public/DarkHeroElement.svg";
import { useTheme } from "@/providers/ThemeProvider"; // Assuming ThemeProvider exists
import { motion } from "framer-motion"; // Assuming framer-motion is installed

// Animation variants for framer-motion
const animations = {
    fadeInScale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 1, ease: "easeOut" as const },
    },
};

// Hero section component
export function HeroSection() {
    const isDarkMode = useTheme();

    return (
        <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center
                       bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text
                       py-10 sm:py-16 md:py-20 lg:py-24 xl:py-28" // Adjusted vertical padding
            {...animations.fadeInScale}
        >
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                {" "}
                {/* Aligned text left on large screens */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl 2xl:text-8xl font-black text-light-highlight dark:text-dark-highlight tracking-tight leading-tight">
                    Trackademy
                    <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-light-text dark:text-dark-text mt-4 font-normal">
                        {" "}
                        {/* Smaller, normal weight for tagline */}
                        Your Comprehensive Student Management Portal
                    </span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-light-text dark:text-dark-text max-w-3xl lg:max-w-none mx-auto lg:mx-0 leading-relaxed">
                    A comprehensive web-based platform designed to digitize and
                    streamline core academic operations for students, faculty,
                    and administrators. Seamlessly manage results, internships,
                    attendance, certificates, and more, powered by AI analytics
                    and privacy-first ML techniques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                    {" "}
                    {/* Aligned buttons left on large screens */}
                    <Link
                        href="/login" // Or relevant "explore" page
                        className="px-8 py-4 sm:px-10 sm:py-5 bg-light-highlight dark:bg-dark-highlight rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform focus:outline-none focus:ring-4 focus:ring-light-highlight/50 dark:focus:ring-dark-highlight/50"
                    >
                        Explore Features
                    </Link>
                    <Link
                        href="/about-us" // Or relevant "learn more" page
                        className="px-8 py-4 sm:px-10 sm:py-5 border-2 border-light-highlight dark:border-dark-highlight text-light-highlight dark:text-dark-highlight rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-light-highlight hover:text-white dark:hover:bg-dark-highlight dark:hover:text-white transform focus:outline-none focus:ring-4 focus:ring-light-highlight/50 dark:focus:ring-dark-highlight/50"
                    >
                        Learn More
                    </Link>
                </div>
            </div>
            <div className="relative h-[650px] w-full">
                {" "}
                {/* Adjusted responsive heights for image */}
                <Image
                    src={isDarkMode ? DarkHeroElement : LightHeroElement}
                    alt="Trackademy Hero Element"
                    fill
                    className="object-contain transition-colors duration-300"
                    sizes="(max-width: 1024px) 100vw, 50vw" // Image optimization for responsiveness
                />
            </div>
        </motion.div>
    );
}
