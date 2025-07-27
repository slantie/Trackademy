"use client";

import { useAuth } from "@/contexts/authContext"; // Ensure this path is correct
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion } from "framer-motion";
import { Menu, X, LogOut, Loader } from "lucide-react"; // Added LogOut and Loader icons
import Image from "next/image";
import logo from "../../../public/Trackademy2.svg";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast"; // Ensure showToast is imported correctly
import { Role } from "@/interfaces/auth"; // Assuming Role enum is defined here

// Helper component for navigation links
const HeaderRoute = ({ route, label }: { route: string; label: string }) => {
    return (
        <Link
            href={route}
            className="text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight transition-colors duration-200 font-semibold text-sm lg:text-base whitespace-nowrap hover:scale-105"
        >
            {label}
        </Link>
    );
};

export function Header() {
    const router = useRouter();
    const { user, logout, loading } = useAuth(); // 'loading' is from AuthContextType, renamed it to isLoading if needed to align
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when user state changes (e.g., after login/logout)
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [user]);

    // Handle logout action
    const handleLogout = async () => {
        try {
            await logout();
            setIsMobileMenuOpen(false); // Close mobile menu on successful logout
        } catch (error: any) {
            // Error handling is primarily done in AuthContext, but this catches re-thrown errors
            showToast.error(
                "Logout failed: " +
                    (error.message || "An unexpected error occurred.")
            );
        }
    };

    // Toggle mobile menu visibility
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Framer Motion variants
    const headerVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    // Logo pulse animation
    const logoVariants = {
        animate: {
            opacity: [0.8, 1, 0.8],
        },
        transition: {
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
        },
    };

    // Display a simple loading header while authentication is being checked
    if (loading) {
        return (
            <motion.header
                initial="initial"
                animate="animate"
                variants={headerVariants}
                className="fixed top-0 left-0 w-full bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text shadow-md z-50 py-4"
            >
                <div className="max-w-[1920px] mx-auto px-6 flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <Image
                            src={logo}
                            alt="Trackademy Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                        <span className="lg:text-3xl md:text-xl font-bold text-light-highlight dark:text-dark-highlight">
                            Trackademy
                        </span>
                    </div>
                    <span className="text-sm text-light-muted-text dark:text-dark-muted-text">
                        Checking authentication...
                    </span>
                </div>
            </motion.header>
        );
    }

    return (
        <>
            <motion.header
                initial="initial"
                animate="animate"
                variants={headerVariants}
                className="sticky top-0 left-0 w-full bg-white dark:bg-dark-background border-b border-light-text/10 dark:border-dark-text/5 text-light-text dark:text-dark-text shadow-sm z-50"
            >
                <nav className="mx-auto max-w-[1920px] px-6 py-4 flex items-center justify-between">
                    {/* Logo / Site Title */}
                    <motion.div
                        className="text-2xl font-bold whitespace-nowrap"
                        variants={logoVariants}
                        initial="animate" // Set initial to animate to start the loop immediately
                    >
                        <div className="flex items-center gap-2">
                            <Link
                                href="/"
                                className="flex items-center gap-2 group"
                            >
                                <Image
                                    src={logo}
                                    alt="Trackademy Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 transition-transform"
                                    priority // Mark as high priority for LCP
                                />
                                <span className="lg:text-3xl md:text-xl font-black">
                                    <span className="text-light-highlight dark:text-dark-highlight">
                                        Trackademy
                                    </span>
                                </span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        {" "}
                        {/* Increased gap for spacing */}
                        {!user && (
                            <>
                                <HeaderRoute route="/" label="Home" />
                                <HeaderRoute
                                    route="/about-us"
                                    label="About Us"
                                />
                                <HeaderRoute route="/contact" label="Contact" />
                                <ThemeToggle />
                                <button
                                    onClick={() => router.push("/register")}
                                    className="px-6 py-1.5 rounded-lg border-2 font-semibold text-md transition-all duration-200
                                                border-light-muted-background bg-light-muted-background text-light-text
                                                hover:bg-light-highlight hover:text-dark-text hover:border-light-highlight
                                                dark:border-dark-muted-background dark:bg-dark-muted-background dark:text-dark-text
                                                dark:hover:bg-dark-highlight dark:hover:text-dark-text dark:hover:border-dark-highlight"
                                >
                                    Register
                                </button>
                                <button
                                    onClick={() => router.push("/login")}
                                    className="px-6 py-1.5 rounded-lg font-semibold text-md transition-all duration-200
                                                bg-light-highlight text-dark-text hover:bg-light-hover border-2 border-light-highlight
                                                dark:bg-dark-highlight dark:text-dark-text dark:hover:bg-dark-hover dark:border-dark-highlight"
                                >
                                    Login
                                </button>
                            </>
                        )}
                        {user && (
                            <div className="flex items-center gap-4">
                                <HeaderRoute
                                    route="/dashboard"
                                    label="Dashboard"
                                />

                                {user.role === Role.ADMIN && ( // Using triple equals for strict comparison
                                    <HeaderRoute
                                        route="/upload"
                                        label="Upload"
                                    />
                                )}
                                {(user.role === Role.ADMIN ||
                                    user.role === Role.FACULTY) && (
                                    <HeaderRoute
                                        route="/feedback-forms"
                                        label="Feedback Forms"
                                    /> // Assuming Faculty can also access feedback forms
                                )}
                                {user.role === Role.ADMIN && (
                                    <HeaderRoute
                                        route="/analytics"
                                        label="Analytics"
                                    />
                                )}

                                <ThemeToggle />

                                <button
                                    onClick={handleLogout}
                                    disabled={loading} // Disable during logout process
                                    className="px-6 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 font-semibold text-sm
                                               dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? ( // Show loading spinner and text when loading
                                        <>
                                            <Loader className="animate-spin h-4 w-4" />
                                            Logging Out...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="h-4 w-4" />{" "}
                                            {/* Lucide LogOut icon */}
                                            Logout
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button (Hamburger) */}
                    <div className="md:hidden flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={toggleMobileMenu}
                            className="p-2 text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-light-highlight dark:focus:ring-dark-highlight rounded-md"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* Optional Backdrop for smoother UX */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
                    aria-hidden="true"
                    onClick={toggleMobileMenu}
                />
            )}

            {/* Mobile Menu (Outside Header) */}
            <motion.div
                id="mobile-menu"
                initial={false} // Use false to control animation with 'animate' prop
                animate={isMobileMenuOpen ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, y: 0, display: "block" },
                    closed: {
                        opacity: 0,
                        y: "-100%",
                        transitionEnd: { display: "none" }, // Hide element completely after animation
                    },
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="md:hidden fixed top-16 left-0 w-full bg-white dark:bg-dark-background shadow-lg border-t border-light-text/10 dark:border-dark-text/5 overflow-hidden z-40 py-4 px-6" // Adjusted top, padding
            >
                <div className="flex flex-col space-y-3">
                    {!user && (
                        <>
                            <Link
                                href="/about-us"
                                className="block text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight py-2 font-semibold text-base"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/contact"
                                className="block text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight py-2 font-semibold text-base"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <button
                                onClick={() => {
                                    router.push("/register");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-center px-4 py-2 rounded-lg border-2 font-semibold text-base transition-all duration-200
                                                border-light-muted-background bg-light-muted-background text-light-text
                                                hover:bg-light-highlight hover:text-white hover:border-light-highlight
                                                dark:border-dark-muted-background dark:bg-dark-muted-background dark:text-dark-text
                                                dark:hover:bg-dark-highlight dark:hover:text-white dark:hover:border-dark-highlight"
                            >
                                Register
                            </button>
                            <button
                                onClick={() => {
                                    router.push("/login");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-center px-4 py-2 rounded-lg font-semibold text-base transition-all duration-200
                                                bg-light-highlight text-white hover:bg-light-hover border-2 border-light-highlight
                                                dark:bg-dark-highlight dark:text-white dark:hover:bg-dark-hover dark:border-dark-highlight"
                            >
                                Login
                            </button>
                        </>
                    )}

                    {user && (
                        <>
                            <span className="block text-light-text dark:text-dark-text py-2 font-semibold text-base">
                                Hello,{" "}
                                <span className="text-light-highlight dark:text-dark-highlight font-bold">
                                    {user.fullName}
                                </span>
                            </span>
                            <Link
                                href="/dashboard"
                                className="block text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight py-2 font-semibold text-base"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            {(user.role === Role.FACULTY ||
                                user.role === Role.ADMIN) && (
                                <Link
                                    href="/upload"
                                    className="block text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight py-2 font-semibold text-base"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Upload
                                </Link>
                            )}
                            {user.role === Role.ADMIN && (
                                <Link
                                    href="/analytics"
                                    className="block text-light-text dark:text-dark-text hover:text-light-highlight dark:hover:text-dark-highlight py-2 font-semibold text-base"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Analytics
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                type="button"
                                disabled={loading}
                                className="w-full mt-2 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 font-semibold text-base
                                           dark:bg-red-700 dark:hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin h-4 w-4" />
                                        Logging Out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Optional: Prevents scroll when mobile menu is open */}
            {isMobileMenuOpen && (
                <style jsx global>{`
                    body {
                        overflow: hidden;
                    }
                `}</style>
            )}
        </>
    );
}

export default Header;
