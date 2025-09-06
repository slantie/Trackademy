// src/constants/roles.js

/**
 * Defines the user roles used throughout the application.
 * This is a single source of truth to prevent typos and
 * ensure consistent role-based access control.
 * @readonly
 * @enum {string}
 */
export const Role = {
  STUDENT: "STUDENT",
  FACULTY: "FACULTY",
  ADMIN: "ADMIN",
};

/**
 * Defines navigation links for each user role.
 * This helps centralize the application's routing logic
 * and makes the Header component cleaner.
 * @readonly
 */
export const NAV_ITEMS = {
  [Role.STUDENT]: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Assignments", path: "/assignments" },
    { name: "Certificates", path: "/certificates" },
    { name: "Internships", path: "/internships" },
  ],
  [Role.FACULTY]: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Courses", path: "/courses" },
    { name: "Assignments", path: "/assignments" },
    { name: "Students", path: "/students" },
  ],
  [Role.ADMIN]: [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Colleges", path: "/college" },
    { name: "Academic Years", path: "/academic-year" },
    { name: "Departments", path: "/department" },
    { name: "Subjects", path: "/subject" },
    { name: "Faculty", path: "/faculty" },
    { name: "Semesters", path: "/semester" },
  ],
};
