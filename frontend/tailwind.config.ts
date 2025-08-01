/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
            colors: {
                light: {
                    text: "#020817",
                    background: "#FFFFFF",
                    highlight: "#155DFC",
                    hover: "#1447E6",
                    muted: {
                        text: "#64748B",
                        background: "#F1F5F9",
                    },
                    primary: {
                        lighter: "#E0E9FF",
                        light: "#A8C1FF",
                        main: "#155DFC",
                        dark: "#1447E6",
                        darker: "#0F34A8",
                    },
                    secondary: {
                        lighter: "#E3E0FD",
                        light: "#BDB6FA",
                        main: "#4F39F6",
                        dark: "#432DD7",
                        darker: "#31219C",
                    },
                    positive: {
                        lighter: "#D1FAE5",
                        light: "#6EE7B7",
                        main: "#10B981",
                        dark: "#059669",
                        darker: "#047857",
                    },
                    warning: {
                        lighter: "#FEF3C7",
                        light: "#FCD34D",
                        main: "#F59E0B",
                        dark: "#D97706",
                        darker: "#B45309",
                    },
                    negative: {
                        lighter: "#FEE2E2",
                        light: "#FCA5A5",
                        main: "#EF4444",
                        dark: "#DC2626",
                        darker: "#B91C1C",
                    },
                    highlight1: {
                        lighter: "#CCFBF1",
                        light: "#99F6E4",
                        main: "#2DD4BF",
                        dark: "#14B8A6",
                        darker: "#0D9488",
                    },
                    highlight2: {
                        lighter: "#FCE7F3",
                        light: "#F9A8D4",
                        main: "#EC4899",
                        dark: "#DB2777",
                        darker: "#BE185D",
                    },
                },
                dark: {
                    text: "#F8FAFC",
                    background: "#020817",
                    highlight: "#3B82F6",
                    hover: "#60A5FA",
                    muted: {
                        text: "#94A3B8",
                        background: "#1E293B",
                    },
                    primary: {
                        lighter: "#1E3A8A",
                        light: "#2563EB",
                        main: "#3B82F6",
                        dark: "#60A5FA",
                        darker: "#93C5FD",
                    },
                    secondary: {
                        lighter: "#4338CA",
                        light: "#6D28D9",
                        main: "#8B5CF6",
                        dark: "#A78BFA",
                        darker: "#C4B5FD",
                    },
                    positive: {
                        lighter: "#059669",
                        light: "#10B981",
                        main: "#34D399",
                        dark: "#6EE7B7",
                        darker: "#A7F3D0",
                    },
                    warning: {
                        lighter: "#D97706",
                        light: "#F59E0B",
                        main: "#FBBF24",
                        dark: "#FCD34D",
                        darker: "#FEF3C7",
                    },
                    negative: {
                        lighter: "#DC2626",
                        light: "#EF4444",
                        main: "#F87171",
                        dark: "#FCA5A5",
                        darker: "#FECACA",
                    },
                    highlight1: {
                        lighter: "#14B8A6",
                        light: "#2DD4BF",
                        main: "#5EEAD4",
                        dark: "#99F6E4",
                        darker: "#CCFBF1",
                    },
                    highlight2: {
                        lighter: "#DB2777",
                        light: "#EC4899",
                        main: "#F472B6",
                        dark: "#F9A8D4",
                        darker: "#FCE7F3",
                    },
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
