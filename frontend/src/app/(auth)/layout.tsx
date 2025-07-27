/**
 * @file src/app/(auth)/layout.tsx
 * @description Authentication layout component for login and register pages
 */

export const metadata = {
    title: "Authentication - Trackademy",
    description: "Login or Register pages",
    keywords: ["auth", "login", "register", "trackademy"],
    authors: [
        { name: "Kandarp Gajjar", url: "https://github.com/slantie" },
        { name: "Harsh Dodiya", url: "https://github.com/harshDodiya1" },
    ],
    icons: {
        icon: "/favicon.ico",
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div>{children}</div>;
}
