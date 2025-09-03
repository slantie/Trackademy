// src/constants/apiEndpoints.js
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
    LIST_CREATE: "/colleges",
    DETAILS: (collegeId) => `/colleges/${collegeId}`,
    UPDATE: (collegeId) => `/colleges/${collegeId}`,
    DELETE: (collegeId) => `/colleges/${collegeId}`,
  },
  ACADEMIC_YEARS: {
    LIST_CREATE: "/academic-years",
    DETAILS: (yearId) => `/academic-years/${yearId}`,
    UPDATE: (yearId) => `/academic-years/${yearId}`,
    DELETE: (yearId) => `/academic-years/${yearId}`,
    ACTIVATE: (yearId) => `/academic-years/${yearId}/activate`,
  },
  DEPARTMENTS: {
    LIST_CREATE: "/departments",
    DETAILS: (departmentId) => `/departments/${departmentId}`,
    UPDATE: (departmentId) => `/departments/${departmentId}`,
    DELETE: (departmentId) => `/departments/${departmentId}`,
  },
  SUBJECTS: {
    LIST_CREATE: "/subjects",
    DETAILS: (subjectId) => `/subjects/${subjectId}`,
    UPDATE: (subjectId) => `/subjects/${subjectId}`,
    DELETE: (subjectId) => `/subjects/${subjectId}`,
  },
  FACULTIES: {
    LIST_CREATE: "/faculties",
    DETAILS: (facultyId) => `/faculties/${facultyId}`,
    UPDATE: (facultyId) => `/faculties/${facultyId}`,
    DELETE: (facultyId) => `/faculties/${facultyId}`,
  },
  SEMESTERS: {
    LIST_CREATE: "/semesters",
    DETAILS: (semesterId) => `/semesters/${semesterId}`,
    UPDATE: (semesterId) => `/semesters/${semesterId}`,
    DELETE: (semesterId) => `/semesters/${semesterId}`,
  },
  DIVISIONS: {
    LIST_CREATE: "/divisions",
    DETAILS: (divisionId) => `/divisions/${divisionId}`,
    UPDATE: (divisionId) => `/divisions/${divisionId}`,
    DELETE: (divisionId) => `/divisions/${divisionId}`,
  },
  STUDENTS: {
    LIST_CREATE: "/students",
    DETAILS: (studentId) => `/students/${studentId}`,
    UPDATE: (studentId) => `/students/${studentId}`,
    DELETE: (studentId) => `/students/${studentId}`,
  },
  COURSES: {
    LIST_CREATE: "/courses",
    DETAILS: (courseId) => `/courses/${courseId}`,
    UPDATE: (courseId) => `/courses/${courseId}`,
    DELETE: (courseId) => `/courses/${courseId}`,
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
    SUMMARY: "/dashboard/summary",
  },
  ANALYTICS: {
    BASE: "/analytics",
    RESULTS: "/analytics/results",
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
