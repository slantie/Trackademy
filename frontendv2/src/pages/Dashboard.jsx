import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../constants/roles";
import StudentDashboardPage from "./student/StudentDashboardPage";
import FacultyDashboardPage from "./faculty/FacultyDashboardPage";
import AdminDashboardPage from "./admin/AdminDashboardPage";

const DashboardHub = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-light-highlight dark:border-dark-highlight"></div>
      </div>
    );
  }

  if (!user || !user.role) {
    return <div>Error: User data not found.</div>;
  }

  // Render the appropriate dashboard based on the user's role
  switch (user.role) {
    case Role.STUDENT:
      return <StudentDashboardPage />;
    case Role.FACULTY:
      return <FacultyDashboardPage />;
    case Role.ADMIN:
      return <AdminDashboardPage />;
    default:
      return <div>Error: Unknown user role.</div>;
  }
};

export default DashboardHub;
