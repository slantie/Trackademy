/**
 * @file src/services/auth.service.ts
 * @description Service layer for handling authentication-related API calls.
 */

import axiosInstance from "../lib/axiosInstance";
import { AUTH_ENDPOINTS } from "../constants/apiEndpoints";
import {
    LoginRequest,
    LoginResponse,
    GetMeResponse,
    User,
} from "../interfaces/auth.types";

class AuthService {
    /**
     * Logs in a user.
     * @param credentials - The user's identifier and password.
     * @returns A promise that resolves with the full login response from the API.
     */
    public async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await axiosInstance.post<LoginResponse>(
            AUTH_ENDPOINTS.LOGIN,
            credentials
        );
        return response.data;
    }

    /**
     * Fetches the profile of the currently authenticated user.
     * @returns A promise that resolves with the user's profile data.
     */
    public async getMe(): Promise<User> {
        const response = await axiosInstance.get<GetMeResponse>(
            AUTH_ENDPOINTS.ME
        );
        return response.data.data.user;
    }
}

export const authService = new AuthService();
