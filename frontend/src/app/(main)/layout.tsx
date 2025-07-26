/**
 * @file src/app/(main)/layout.tsx
 * @description Main layout component with header and footer
 */

import React from "react";
import { Metadata } from "next";
import { Header } from "../../components/ui/Header";
import { Footer } from "../../components/ui/Footer";

// Metadata for the main group layout
export const metadata: Metadata = {
    title: "Trackademy",
    description: "Main pages of the Trackademy application",
    keywords: [
        "main",
        "trackademy",
        "student",
        "management",
        "college",
        "ldrpitr",
    ],
    authors: [
        { name: "Kandarp Gajjar", url: "https://github.com/slantie" },
        { name: "Harsh Dodiya", url: "https://github.com/harshDodiya1" },
    ],
    icons: {
        icon: "/favicon.ico",
    },
};

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
