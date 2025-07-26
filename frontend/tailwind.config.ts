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
                sans: ["Inter"],
            },
        },
        colors: {
            dark: {
                text: "#E5E5E5",
                background: "#171717",
                highlight: "#155DFC",
                muted: {
                    text: "#E5E5E5",
                    background: "#262626",
                },
                hover: "#2B7FFF",
                secondary: "#4F39F6",
                tertiary: "#615FFF",
            },
            light: {
                text: "#171717",
                background: "#F5F5F5",
                highlight: "#155DFC",
                muted: {
                    text: "#262626",
                    background: "#E5E5E5",
                },
                hover: "#1447E6",
                secondary: "#4F39F6",
                tertiary: "#432DD7",
            },
        },
    },
    plugins: [],
};
