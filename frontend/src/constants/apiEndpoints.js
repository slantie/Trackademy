export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    PROFILE: "/auth/me",
    UPDATE_PASSWORD: "/auth/update-password",
    REGISTER_FACULTY: "/auth/register/faculty",
    REGISTER_ADMIN: "/auth/register/admin",
  },
  ASSIGNMENTS: {
    BASE: "/assignments",
    STATISTICS: "/assignments/statistics",
    BY_ID: (id) => `/assignments/${id}`,
  },
  SUBMISSIONS: {
    BASE: "/submissions",
    BY_ID: (id) => `/submissions/${id}`,
  },
  INTERNSHIPS: {
    BASE: "/internships",
    BY_ID: (id) => `/internships/${id}`,
  },
  CERTIFICATES: {
    BASE: "/certificates",
    BY_ID: (id) => `/certificates/${id}`,
  },
  COLLEGES: {
    BASE: "/colleges",
    BY_ID: (id) => `/colleges/${id}`,
  },
  ACADEMIC_YEARS: {
    BASE: "/academic-years",
    BY_ID: (id) => `/academic-years/${id}`,
  },
  DEPARTMENTS: {
    BASE: "/departments",
    BY_ID: (id) => `/departments/${id}`,
  },
  SEMESTERS: {
    BASE: "/semesters",
    BY_ID: (id) => `/semesters/${id}`,
  },
  DIVISIONS: {
    BASE: "/divisions",
    BY_ID: (id) => `/divisions/${id}`,
  },
  SUBJECTS: {
    BASE: "/subjects",
    BY_ID: (id) => `/subjects/${id}`,
  },
  FACULTIES: {
    BASE: "/faculties",
    BY_ID: (id) => `/faculties/${id}`,
  },
  STUDENTS: {
    BASE: "/students",
    BY_ID: (id) => `/students/${id}`,
  },
  COURSES: {
    BASE: "/courses",
    BY_ID: (id) => `/courses/${id}`,
  },
  EXAMS: {
    BASE: "/exams",
    BY_ID: (id) => `/exams/${id}`,
  },
  EXAM_RESULTS: {
    BASE: "/exam-results",
    BY_ID: (id) => `/exam-results/${id}`,
  },
  ATTENDANCE: {
    BASE: "/attendance",
    BY_ID: (id) => `/attendance/${id}`,
  },
  DASHBOARD: {
    BASE: "/dashboard",
  },
  ANALYTICS: {
    BASE: "/analytics",
  },
  DATABASE: {
    BASE: "/database",
  },
  SERVICE: {
    BASE: "/service",
  },
  UPLOAD: {
    BASE: "/upload",
  },
  PROTECTED: {
    BASE: "/protected",
  },
};
