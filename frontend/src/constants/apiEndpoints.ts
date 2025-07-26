// Environment and base URLs
export const API_ENV = process.env.NEXT_PUBLIC_API_ENV || "production";

export const NEXT_PUBLIC_BACKEND_DEV_URL =
    process.env.NEXT_PUBLIC_BACKEND_DEV_URL || "http://localhost:4000";

export const NEXT_PUBLIC_BACKEND_API_URL =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "https://trackademy.onrender.com";

export const BASE_URL =
    API_ENV === "development"
        ? NEXT_PUBLIC_BACKEND_DEV_URL
        : NEXT_PUBLIC_BACKEND_API_URL;

export const API_V1_URL = `${BASE_URL}/api`;

// Authentication endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_V1_URL}/auth/login`,
    STUDENT_REGISTER: `${API_V1_URL}/auth/register/student`,
    FACULTY_REGISTER: `${API_V1_URL}/auth/register/faculty`,
    ADMIN_REGISTER: `${API_V1_URL}/auth/register/admin`,
    ME: `${API_V1_URL}/auth/me`,
    UPDATE_PASSWORD: `${API_V1_URL}/auth/update-password`,
};
