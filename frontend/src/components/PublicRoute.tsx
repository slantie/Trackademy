"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/LoadingSpinner";

interface PublicRouteProps {
    children: React.ReactNode;
    redirectPath?: string;
}

export function PublicRoute({
    children,
    redirectPath = "/home",
}: PublicRouteProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // While the authentication state is being determined, show a loader.
    // This is the key to preventing flickers and premature redirects.
    if (isLoading) {
        return <PageLoader text="Loading..." />;
    }

    // If loading is complete and the user is authenticated, redirect them.
    if (user) {
        router.replace(redirectPath);
        // Return a loader while redirecting to prevent the public page from flashing.
        return <PageLoader text="Redirecting..." />;
    }

    // If loading is complete and there is no user, render the public page.
    return <>{children}</>;
}
