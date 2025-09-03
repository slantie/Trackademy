// src/constants/apiEndpoints.js

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    PROFILE: "/auth/me",
  },
  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
  },
  ANALYTICS: {
    RESULTS: "/analytics/results",
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
  ATTENDANCE: {
    LIST: "/attendance",
    UPDATE: (attendanceId) => `/attendance/${attendanceId}`,
    UPLOAD: "/upload/attendance",
  },
  ASSIGNMENTS: {
    LIST_CREATE: "/assignments",
    DETAILS: (assignmentId) => `/assignments/${assignmentId}`,
    UPDATE: (assignmentId) => `/assignments/${assignmentId}`,
    DELETE: (assignmentId) => `/assignments/${assignmentId}`,
  },
  SUBMISSIONS: {
    LIST_CREATE: "/submissions",
    GRADE: (submissionId) => `/submissions/${submissionId}/grade`,
    FOR_ASSIGNMENT: (assignmentId) => `/submissions/assignment/${assignmentId}`,
  },
  UPLOAD: {
    FACULTY_DATA: "/upload/faculty",
    STUDENT_DATA: "/upload/students",
    ATTENDANCE_DATA: "/upload/attendance",
    FACULTY_MATRIX: "/upload/faculty-matrix",
    RESULTS_DATA: "/upload/results",
  },
};
