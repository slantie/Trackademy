import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoutes;
