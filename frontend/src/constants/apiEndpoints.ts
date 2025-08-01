// Environment and base URLs
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

export const API_V1_URL = `${BASE_URL}/api/v1`;

// --- Authentication Endpoints ---
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_V1_URL}/auth/login`,
    ME: `${API_V1_URL}/auth/me`,
    UPDATE_PASSWORD: `${API_V1_URL}/auth/update-password`,
    ADMIN_REGISTER: `${API_V1_URL}/auth/register/admin`, // Kept for admin creation
};

// --- Master Data Endpoints ---
export const COLLEGE_ENDPOINTS = {
    BASE: `${API_V1_URL}/colleges`,
    BY_ID: (id: string) => `${API_V1_URL}/colleges/${id}`,
};

export const DEPARTMENT_ENDPOINTS = {
    BASE: `${API_V1_URL}/departments`,
    BY_ID: (id: string) => `${API_V1_URL}/departments/${id}`,
};

export const SUBJECT_ENDPOINTS = {
    BASE: `${API_V1_URL}/subjects`,
    BY_ID: (id: string) => `${API_V1_URL}/subjects/${id}`,
};

export const FACULTY_ENDPOINTS = {
    BASE: `${API_V1_URL}/faculties`, // Now used for creation as well
    BY_ID: (id: string) => `${API_V1_URL}/faculties/${id}`,
};

// --- Instance Data Endpoints ---
export const ACADEMIC_YEAR_ENDPOINTS = {
    BASE: `${API_V1_URL}/academic-years`,
    ACTIVE: `${API_V1_URL}/academic-years/active`,
    BY_ID: (id: string) => `${API_V1_URL}/academic-years/${id}`,
};

export const SEMESTER_ENDPOINTS = {
    BASE: `${API_V1_URL}/semesters`,
    BY_ID: (id: string) => `${API_V1_URL}/semesters/${id}`,
};

export const DIVISION_ENDPOINTS = {
    BASE: `${API_V1_URL}/divisions`,
    BY_ID: (id: string) => `${API_V1_URL}/divisions/${id}`,
};

export const STUDENT_ENDPOINTS = {
    BASE: `${API_V1_URL}/students`,
    BY_ID: (id: string) => `${API_V1_URL}/students/${id}`,
};

export const COURSE_ENDPOINTS = {
    BASE: `${API_V1_URL}/courses`,
    BY_ID: (id: string) => `${API_V1_URL}/courses/${id}`,
};

// --- Results & Attendance Endpoints ---
export const EXAM_ENDPOINTS = {
    BASE: `${API_V1_URL}/exams`,
    BY_ID: (id: string) => `${API_V1_URL}/exams/${id}`,
};

export const EXAM_RESULT_ENDPOINTS = {
    BASE: `${API_V1_URL}/exam-results`,
    BY_ID: (id: string) => `${API_V1_URL}/exam-results/${id}`,
};

export const ATTENDANCE_ENDPOINTS = {
    BASE: `${API_V1_URL}/attendance`,
    BY_ID: (id: string) => `${API_V1_URL}/attendance/${id}`,
};

// --- Upload Endpoints ---
export const UPLOAD_ENDPOINTS = {
    FACULTY: `${API_V1_URL}/upload/faculty`,
    STUDENTS: `${API_V1_URL}/upload/students`,
    SUBJECTS: `${API_V1_URL}/upload/subjects`,
    FACULTY_MATRIX: `${API_V1_URL}/upload/faculty-matrix`,
    RESULTS: `${API_V1_URL}/upload/results`,
    ATTENDANCE: `${API_V1_URL}/upload/attendance`,
};
