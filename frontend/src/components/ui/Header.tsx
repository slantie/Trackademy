/**
 * @file src/components/ui/Header.tsx
 * @description Main header component with navigation and theme toggle
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
    User,
    LogIn,
    UserPlus,
    Home,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Role } from "@/interfaces/auth";

export function Header() {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Define navigation items based on user role
    const navItems = useMemo(() => {
        const baseNav = [{ href: "/home", label: "Home", icon: Home }];

        if (user) {
            // Authenticated user nav items
            const authenticatedNav = [...baseNav];
            if (user.role === Role.ADMIN) {
                authenticatedNav.push({
                    href: "/admin/dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                });
            } else if (user.role === Role.FACULTY) {
                authenticatedNav.push({
                    href: "/faculty/dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                });
            } else if (user.role === Role.STUDENT) {
                authenticatedNav.push({
                    href: "/student/dashboard",
                    label: "Dashboard",
                    icon: LayoutDashboard,
                });
            }
            return authenticatedNav;
        } else {
            // Public nav items
            return [
                ...baseNav,
                { href: "/login", label: "Login", icon: LogIn },
                { href: "/register", label: "Register", icon: UserPlus },
            ];
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const renderNavLinks = (isMobile: boolean) => (
        <>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => isMobile && setIsMobileMenuOpen(false)}
                        className={cn(
                            "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isMobile && "w-full text-left",
                            isActive
                                ? "bg-light-highlight text-white dark:bg-dark-highlight"
                                : "text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight hover:bg-light-muted-background dark:hover:bg-dark-muted-background"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </>
    );

    const renderUserActions = (isMobile: boolean) => {
        if (!user) return null;

        return (
            <>
                {isMobile && (
                    <div className="pt-2 border-t border-light-muted-background dark:border-dark-muted-background">
                        <p className="px-3 py-2 text-sm text-light-muted-text dark:text-dark-muted-text">
                            Welcome, {user.fullName}
                        </p>
                        <p className="px-3 py-1 text-xs text-light-muted-text dark:text-dark-muted-text capitalize">
                            Role: {user.role.toLowerCase()}
                        </p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isMobile ? "w-full text-left" : "",
                        "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    )}
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
            </>
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-light-muted-background dark:border-dark-muted-background bg-light-background/95 dark:bg-dark-background/95 backdrop-blur supports-[backdrop-filter]:bg-light-background/60 dark:supports-[backdrop-filter]:bg-dark-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link
                    href="/home"
                    className="flex items-center space-x-2 text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors"
                >
                    <User className="h-6 w-6" />
                    <span className="font-bold text-xl">Trackademy</span>
                </Link>

                {/* Desktop Navigation & Actions */}
                <nav className="hidden md:flex items-center space-x-6">
                    {!isLoading && (
                        <>
                            {renderNavLinks(false)}
                            {renderUserActions(false)}
                        </>
                    )}
                </nav>

                {/* Theme Toggle & Mobile Menu Button */}
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-light-text dark:text-dark-text hover:bg-light-muted-background dark:hover:bg-dark-muted-background"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-light-muted-background dark:border-dark-muted-background bg-light-background dark:bg-dark-background">
                    <nav className="flex flex-col p-4 space-y-2">
                        {!isLoading && (
                            <>
                                {renderNavLinks(true)}
                                {renderUserActions(true)}
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
