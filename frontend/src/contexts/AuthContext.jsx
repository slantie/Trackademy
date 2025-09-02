import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { getUserProfile } from "../api/auth";
import { authKeys } from "../hooks/useAuthQueries";
import { AuthContext } from "./AuthContextBase";

// AuthProvider component
export const AuthProvider = ({ children }) => {
  console.log("🏗️ AuthProvider component initializing...");

  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("🔐 Initializing authentication...");
      const token = authService.getToken();
      console.log("🎫 Token from localStorage:", token ? "Found" : "Not found");

      if (token) {
        try {
          console.log("📡 Verifying token with backend...");

          // Try to get cached user data first
          const cachedUser = queryClient.getQueryData(authKeys.profile());
          if (cachedUser) {
            console.log("💾 Using cached user data:", cachedUser);
            setAuthState({
              isAuthenticated: true,
              user: cachedUser,
              loading: false,
            });
            return;
          }

          // If no cached data, fetch from backend
          const response = await getUserProfile();
          console.log("✅ Token verification successful:", response);

          // Cache the user data
          queryClient.setQueryData(
            authKeys.profile(),
            response.user || response
          );

          setAuthState({
            isAuthenticated: true,
            user: response.user || response,
            loading: false,
          });
        } catch (error) {
          // Token is invalid, remove it and clear cache
          console.log(
            "❌ Token verification failed:",
            error.response?.data || error.message
          );
          authService.removeToken();
          queryClient.removeQueries({ queryKey: authKeys.all });
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } else {
        console.log("🚫 No token found, user not authenticated");
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    initializeAuth();
  }, [queryClient]);

  // Login function that integrates with TanStack Query
  const login = async (identifier, password) => {
    console.log("🔑 Attempting login with TanStack Query integration");

    try {
      // Dynamic import to avoid circular dependencies
      const { loginUser } = await import("../api/auth");
      const response = await loginUser({ identifier, password });
      console.log("📥 Login response from backend:", response);

      const { token, user } = response;
      console.log("🎫 Extracted token:", token ? "Present" : "Missing");
      console.log("👤 Extracted user:", user);

      // Save token to localStorage
      authService.saveToken(token);
      console.log("💾 Token saved to localStorage");

      // Cache user data with TanStack Query
      if (user) {
        queryClient.setQueryData(authKeys.profile(), user);
      }

      // Update auth state
      setAuthState({
        isAuthenticated: true,
        user: user,
        loading: false,
      });
      console.log("✅ Auth state updated successfully");

      return true;
    } catch (error) {
      console.error("❌ Login failed:");
      console.error("Error response:", error.response?.data);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
      return false;
    }
  };

  // Logout function that integrates with TanStack Query
  const logout = () => {
    console.log("👋 Logging out with TanStack Query integration");

    // Remove token from localStorage
    authService.removeToken();

    // Clear all auth-related cache
    queryClient.removeQueries({ queryKey: authKeys.all });

    // Update auth state
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  // Update user profile
  const updateUser = (updatedUser) => {
    console.log("👤 Updating user data:", updatedUser);

    // Update local state
    setAuthState((prev) => ({
      ...prev,
      user: { ...prev.user, ...updatedUser },
    }));

    // Update cached data
    queryClient.setQueryData(authKeys.profile(), (oldData) => ({
      ...oldData,
      ...updatedUser,
    }));
  };

  const value = {
    ...authState,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
