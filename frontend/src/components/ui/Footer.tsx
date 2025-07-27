// src/components/layout/Footer.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Mail,
    MapPin,
    Github,
} from "lucide-react";

// Quick links data
const quickLinks = [
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
    // { name: "Features", href: "/features" }, // Commented as per original
    // { name: "Privacy Policy", href: "/privacy" }, // Commented as per original
];

// Resources links data
const resources = [
    { name: "Documentation", href: "/docs" },
    // { name: "Help Center", href: "/help" }, // Commented as per original
    { name: "FAQs", href: "/faqs" },
    { name: "Assets", href: "/assets" },
    // { name: "Support", href: "/support" }, // Commented as per original
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-dark-background border-t border-light-text/10"
        >
            <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-12 py-12 sm:py-16">
                    {/* Brand Section */}
                    <div className="space-y-6 sm:col-span-2 lg:col-span-1">
                        <motion.div
                            className="text-2xl sm:text-3xl font-bold"
                            animate={{
                                opacity: [0.8, 1, 0.8],
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeInOut",
                                repeat: Infinity,
                            }}
                        >
                            <span className="text-light-highlight dark:text-dark-highlight">
                                Trackademy
                            </span>
                        </motion.div>
                        <p className="text-light-text dark:text-dark-text leading-relaxed text-sm sm:text-base">
                            Empowering educational institutions with
                            comprehensive student management solutions for a
                            better and more efficient experience.
                        </p>
                        <div className="flex space-x-4 sm:space-x-5">
                            {[
                                { icon: Facebook, href: "#" },
                                { icon: Twitter, href: "#" },
                                { icon: Instagram, href: "#" },
                                { icon: Linkedin, href: "#" },
                            ].map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.href}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 rounded-full text-light-highlight dark:text-dark-highlight transition-colors bg-light-highlight/10 dark:bg-dark-highlight/10"
                                >
                                    <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-base sm:text-lg font-semibold text-secondary-darker dark:text-dark-text">
                            Quick Links
                        </h3>
                        <ul className="space-y-3 sm:space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href}>
                                        <motion.span
                                            className="text-sm sm:text-base text-light-muted-text dark:text-dark-muted-text hover:text-primary-dark dark:hover:text-primary-light cursor-pointer inline-block"
                                            whileHover={{ x: 5 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                        >
                                            {link.name}
                                        </motion.span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-base sm:text-lg font-semibold text-secondary-darker dark:text-dark-text">
                            Resources
                        </h3>
                        <ul className="space-y-3 sm:space-y-4">
                            {resources.map((resource) => (
                                <li key={resource.name}>
                                    <Link href={resource.href}>
                                        <motion.span
                                            className="text-sm sm:text-base text-light-muted-text dark:text-dark-muted-text hover:text-primary-dark dark:hover:text-primary-light cursor-pointer inline-block"
                                            whileHover={{ x: 5 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 300,
                                            }}
                                        >
                                            {resource.name}
                                        </motion.span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 sm:space-y-6">
                        <h3 className="text-base sm:text-lg font-semibold text-secondary-darker dark:text-dark-text">
                            Contact Us
                        </h3>
                        <ul className="space-y-3 sm:space-y-4">
                            <li className="flex items-start space-x-3">
                                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-light-highlight dark:text-dark-highlight transition-colors mt-1 shrink-0" />
                                <span className="text-sm sm:text-base text-light-muted-text dark:text-dark-muted-text break-all">
                                    trackademy.ldrp@gmail.com
                                </span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-light-highlight dark:text-dark-highlight transition-colors mt-1 shrink-0" />
                                <span className="text-sm sm:text-base text-light-muted-text dark:text-dark-muted-text">
                                    LDRP Institute of Technology & Research,
                                    <br />
                                    Near KH-5, Sector-15,
                                    <br />
                                    Gandhinagar, Gujarat 382015
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-light-text/10 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 text-center sm:text-left">
                        {typeof window !== "undefined" && (
                            <p className="text-sm sm:text-base text-light-text dark:text-dark-text">
                                © {currentYear} Trackademy. All rights reserved.
                            </p>
                        )}
                        <motion.div className="flex items-center justify-center space-x-2 hover:scale-105">
                            <Github className="h-5 w-5" />
                            <Link
                                href="https://github.com/slantie/Trackademy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm sm:text-base text-light-text dark:text-dark-text hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                            >
                                Github
                            </Link>
                        </motion.div>
                        <motion.p
                            className="text-sm sm:text-base text-light-text dark:text-dark-text"
                            whileHover={{ scale: 1.02 }}
                        >
                            Created by Team Trackademy (Kandarp Gajjar, Harsh
                            Dodiya & Parin Dave)
                        </motion.p>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
