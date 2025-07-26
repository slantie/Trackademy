import axios from 'axios';
import { AUTH_ENDPOINTS } from '../constants/apiEndpoints';
import {
    LoginRequest,
    LoginResponse,
    RegisterStudentRequest,
    RegisterFacultyRequest,
    RegisterAdminRequest,
    RegisterResponse,
    User
} from '../interfaces/auth';

// Create an Axios instance for API calls
const api = axios.create({
    baseURL: '/', // The base URL is already part of the endpoint constants
});

/**
 * Sets the authorization token for all subsequent API requests.
 * @param token - The JWT token.
 */
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

/**
 * Service for handling authentication-related API calls.
 */
export const AuthService = {
    /**
     * Logs in a user.
     * @param credentials - The user's identifier and password.
     * @returns A promise that resolves with the login response data.
     */
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
        return response.data;
    },

    /**
     * Fetches the current authenticated user's profile.
     * @returns A promise that resolves with the user data.
     */
    getMe: async (): Promise<User> => {
        const response = await api.get<User>(AUTH_ENDPOINTS.ME);
        return response.data;
    },

    /**
     * Registers a new student.
     * @param data - The student registration details.
     * @returns A promise that resolves with the registration response.
     */
    registerStudent: async (data: RegisterStudentRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>(AUTH_ENDPOINTS.STUDENT_REGISTER, data);
        return response.data;
    },

    /**
     * Registers a new faculty member.
     * @param data - The faculty registration details.
     * @returns A promise that resolves with the registration response.
     */
    registerFaculty: async (data: RegisterFacultyRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>(AUTH_ENDPOINTS.FACULTY_REGISTER, data);
        return response.data;
    },

    /**
     * Registers a new admin. (Requires admin privileges)
     * @param data - The admin registration details.
     * @returns A promise that resolves with the registration response.
     */
    registerAdmin: async (data: RegisterAdminRequest): Promise<RegisterResponse> => {
        const response = await api.post<RegisterResponse>(AUTH_ENDPOINTS.ADMIN_REGISTER, data);
        return response.data;
    },
};
