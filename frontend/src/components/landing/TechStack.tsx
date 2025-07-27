/**
@file src/components/landing/TechStack.tsx
@description Tech stack section for the Trackademy landing page.
*/

"use client";

import { motion } from "framer-motion";
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

// Tech stack section component
export function TechStack() {
    return (
        <>
            <div className="py-16 sm:py-24 md:py-32 lg:py-40 bg-light-background dark:bg-dark-background overflow-hidden">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-light-highlight dark:text-dark-highlight mb-12 text-center tracking-tight">
                    Our Underlying Technologies
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
                    className="flex space-x-24 sm:space-x-32 md:space-x-48 lg:space-x-64 xl:space-x-80 text-light-text dark:text-dark-text
                    group-hover:text-light-highlight dark:group-hover:text-dark-highlight"
                >
                    {[...techStack, ...techStack].map((tech, index) => {
                        // Cast the icon component to a React.ElementType that explicitly accepts a className
                        const IconComponent = tech.icon as React.ElementType<{
                            className?: string;
                        }>;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-3 group flex-shrink-0 w-24 sm:w-32 md:w-40"
                            >
                                <IconComponent className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-light-text dark:text-dark-text group-hover:text-orange-500 transition-colors transform group-hover:scale-110 duration-300" />
                                <span className="text-base sm:text-lg font-medium text-light-text dark:text-dark-text">
                                    {tech.name}
                                </span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </>
    );
}
