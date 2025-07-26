/**
 * @file src/components/ui/Footer.tsx
 * @description Main footer component with links and information
 */

import Link from "next/link";
import { Github, Mail, ExternalLink } from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-light-muted-background dark:border-dark-muted-background bg-light-background dark:bg-dark-background">
            <div className="mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
                            StudentPortal
                        </h3>
                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            A comprehensive student management system for
                            educational institutions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/home"
                                    className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/login"
                                    className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/register"
                                    className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                >
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                            Support
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="#"
                                    className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                >
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                >
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                >
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-light-text dark:text-dark-text">
                            Connect
                        </h4>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-light-muted-text dark:text-dark-muted-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                                aria-label="External Link"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-light-muted-background dark:border-dark-muted-background">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text">
                            © {currentYear} StudentPortal. All rights reserved.
                        </p>
                        <p className="text-sm text-light-muted-text dark:text-dark-muted-text mt-2 md:mt-0">
                            Built with Next.js and Tailwind CSS
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
