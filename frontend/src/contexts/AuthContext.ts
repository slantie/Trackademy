import { createContext, useContext } from 'react';
import {
    User,
    LoginRequest,
    RegisterStudentRequest,
    RegisterFacultyRequest,
    RegisterAdminRequest,
    RegisterResponse
} from '../interfaces/auth';

// Define the shape of the authentication context
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    registerStudent: (data: RegisterStudentRequest) => Promise<RegisterResponse>;
    registerFaculty: (data: RegisterFacultyRequest) => Promise<RegisterResponse>;
    registerAdmin: (data: RegisterAdminRequest) => Promise<RegisterResponse>;
}

// Create the authentication context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the authentication context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
