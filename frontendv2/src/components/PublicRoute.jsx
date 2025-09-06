import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

const PublicRoute = ({ children, redirectPath = "/dashboard" }) => {
  // Check if user is already authenticated using authService
  const isAuthenticated = authService.isAuthenticated();

  // If user is authenticated, redirect them away from login/signup pages
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If not authenticated, show the public page (login/signup)
  return children;
};

export default PublicRoute;
