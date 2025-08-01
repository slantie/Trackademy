/**
 * @file src/app/layout.tsx
 * @description Root layout for the Reflectify app, sets up global providers and theme.
 */

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { QueryProvider } from "@/providers/QueryProvider";

import { DM_Sans } from "next/font/google";

export const metadata: Metadata = {
    title: "Trackademy - Student Management",
    description: "A comprehensive student management system",
    keywords: ["student", "management", "system"],
    authors: [
        { name: "Kandarp Gajjar", url: "https://github.com/slantie" },
        { name: "Harsh Dodiya", url: "https://github.com/harshDodiya1" },
    ],
    icons: {
        icon: "/favicon.ico",
    },
};

const dmsans = DM_Sans({
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={dmsans.className}>
                <ThemeProvider>
                    <QueryProvider>
                        <AuthProvider>
                            <ToastProvider>{children}</ToastProvider>
                        </AuthProvider>
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
