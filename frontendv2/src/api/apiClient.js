import axios from "axios";
import { authService } from "../services/authService";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors, especially 401
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors by clearing token and redirecting to login
    if (error.response?.status === 401) {
      authService.removeToken();
      // This will trigger the AuthProvider to re-evaluate and redirect
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
