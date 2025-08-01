/**
 * @file src/providers/QueryProvider.tsx
 * @description Provides the TanStack Query client to the entire application.
 */
"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface QueryProviderProps {
    children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
    // Create a new QueryClient instance.
    // Using useState ensures that the client is only created once per component instance.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Default settings for all queries
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        refetchOnWindowFocus: false, // Optional: disable refetching on window focus
                        retry: 1, // Retry failed requests once
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* The devtools are only included in development builds */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
