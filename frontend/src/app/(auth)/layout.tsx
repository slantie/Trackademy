/**
 * @file src/app/(auth)/layout.tsx
 * @description Authentication layout component for login and register pages
 */

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { User } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            {/* Simple Header for Auth Pages */}
            <header className="flex items-center justify-between p-4 border-b border-light-muted-background dark:border-dark-muted-background">
                <Link
                    href="/home"
                    className="flex items-center space-x-2 text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                >
                    <User className="h-6 w-6" />
                    <span className="font-bold text-xl">StudentPortal</span>
                </Link>
                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="p-4 text-center text-sm text-light-muted-text dark:text-dark-muted-text border-t border-light-muted-background dark:border-dark-muted-background">
                © {new Date().getFullYear()} StudentPortal. All rights reserved.
            </footer>
        </div>
    );
}
