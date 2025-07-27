// src/components/providers/ToastProvider.tsx

"use client";

import { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            {children}
            {mounted && (
                <Toaster
                    position="bottom-right"
                    reverseOrder={false}
                    gutter={8}
                    containerStyle={{
                        top: 20,
                        right: 20,
                    }}
                    toastOptions={{
                        duration: 5000,
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                        success: {
                            duration: 5000,
                        },
                        error: {
                            duration: 20000,
                        },
                        loading: {
                            duration: Infinity,
                        },
                    }}
                />
            )}
        </>
    );
}
