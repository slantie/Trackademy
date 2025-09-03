// src/pages/DashboardHub.jsx
import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../constants/roles";
import StudentDashboardPage from "./student/StudentDashboardPage";
import FacultyDashboardPage from "./faculty/FacultyDashboardPage";
import DashboardPage from "./DashboardPage";

const DashboardHub = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user || !user.role) {
    // Fallback or handle unauthenticated state (though ProtectedRoutes should handle this)
    return null;
  }

  // Render the appropriate dashboard based on the user's role
  switch (user.role) {
    case Role.STUDENT:
      return <StudentDashboardPage />;
    case Role.FACULTY:
      return <FacultyDashboardPage />;
    case Role.ADMIN:
      return <DashboardPage />;
    default:
      return null;
  }
};

export default DashboardHub;
