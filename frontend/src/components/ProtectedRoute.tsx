"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { showToast } from "@/lib/toast";
import { Role } from "@/interfaces/auth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: Role[];
    fallbackPath?: string;
}

export function ProtectedRoute({
    children,
    roles = [],
    fallbackPath = "/login",
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait until loading is finished before running any checks.
        if (isLoading) {
            return;
        }

        // 1. Check for authentication
        if (!user) {
            showToast.error("You need to be logged in to access this page.");
            router.replace(fallbackPath);
            return;
        }

        // 2. Check for role permissions if roles are specified
        if (roles.length > 0 && !roles.includes(user.role)) {
            showToast.error("You don't have permission to access this page.");
            router.replace("/home"); // Redirect to a safe default page like home
            return;
        }
    }, [user, isLoading, roles, fallbackPath, router]);

    // While loading, or if the user is not yet defined and we are not done loading, show a loader.
    if (isLoading || !user) {
        return <PageLoader text="Verifying access..." />;
    }

    // If the user has the required role (or no roles are required), render the children.
    // This check prevents rendering children for a frame before the effect redirects.
    if (roles.length > 0 && !roles.includes(user.role)) {
        return <PageLoader text="Verifying access..." />;
    }

    // If all checks pass, render the protected content.
    return <>{children}</>;
}
