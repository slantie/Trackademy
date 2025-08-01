/**
 * @file src/lib/axiosInstance.ts
 * @description Centralized Axios instance with robust interceptors for auth and error handling.
 */
"use client";

import axios from "axios";
import { API_V1_URL } from "../constants/apiEndpoints";
import { showToast } from "./toast";

const axiosInstance = axios.create({
    baseURL: API_V1_URL,
});

/**
 * Sets the authorization token for all subsequent API requests.
 * This is called by the AuthProvider upon login or session restoration.
 * @param token - The JWT token.
 */
export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
};

// --- Response Interceptor for Global Error Handling ---
axiosInstance.interceptors.response.use(
    (response) => response, // Simply return successful responses
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            const errorMessage =
                data?.message || "An unexpected error occurred.";

            switch (status) {
                case 401: // Unauthorized
                    showToast.error("Session expired. Please log in again.");
                    // This logic assumes you'll clear auth state elsewhere (e.g., in AuthProvider)
                    // Forcing a redirect is a robust way to handle this.
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("authToken");
                        window.location.href = "/login";
                    }
                    break;
                case 403: // Forbidden
                    showToast.error(
                        "Forbidden: You don't have permission to perform this action."
                    );
                    break;
                case 404: // Not Found
                    showToast.error(
                        "Not Found: The requested resource could not be found."
                    );
                    break;
                case 500: // Internal Server Error
                    showToast.error(`Server Error: ${errorMessage}`);
                    break;
                default:
                    showToast.error(`Error ${status}: ${errorMessage}`);
            }
        } else if (error.request) {
            // The request was made but no response was received
            showToast.error(
                "Network Error: No response from the server. Please check your connection."
            );
        } else {
            // Something happened in setting up the request that triggered an Error
            showToast.error(`Request Error: ${error.message}`);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
