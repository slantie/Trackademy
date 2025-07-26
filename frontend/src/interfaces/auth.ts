export enum Role {
    STUDENT = "STUDENT",
    FACULTY = "FACULTY",
    ADMIN = "ADMIN"
}

export interface User {
    id: string;
    role: Role;
    fullName: string;
}

export interface LoginRequest {
    identifier: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        role: Role;
        fullName: string;
    };
}

export interface StudentRegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    studentId: string;
    program: string;
    yearLevel: number;
}

export interface FacultyRegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department: string;
    position: string;
}

export interface AdminRegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    department: string;
}

export interface RegisterStudentRequest {
    email: string;
    password: string;
    enrollmentNumber: string;
    fullName: string;
    divisionId: string;
}

export interface RegisterFacultyRequest {
    email: string;
    password: string;
    fullName: string;
    designation: string;
    departmentId: string;
}

export interface RegisterAdminRequest {
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: string;
        email: string;
        role: Role;
    };
}