import React, { useState, useEffect, createContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { loginUser, getUserProfile } from "../api/auth";
import { authKeys } from "../hooks/useAuthQueries";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();
      const user = authService.getUser();
      const isAuth = authService.isAuthenticated();

      if (token && isAuth) {
        try {
          // If we have user data in localStorage, use it first
          if (user) {
            setAuthState({
              isAuthenticated: true,
              user: user,
              loading: false,
            });
          } else {
            // Otherwise, fetch from API
            const response = await getUserProfile();
            const fetchedUser =
              response.data?.user || response.user || response;
            authService.saveUser(fetchedUser);
            setAuthState({
              isAuthenticated: true,
              user: fetchedUser,
              loading: false,
            });
          }
        } catch (error) {
          console.error(error);
          authService.removeToken();
          queryClient.removeQueries({ queryKey: authKeys.all });
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    initializeAuth();
  }, [queryClient]);

  const login = async (identifier, password) => {
    try {
      console.log("Login attempt started...");
      const response = await loginUser({ identifier, password });
      console.log("Login response received:", response);

      const token = response.token;
      const user = response.data?.user || response.user;

      console.log("Extracted token:", token);
      console.log("Extracted user:", user);

      if (!token || !user) {
        console.error("Missing token or user data in response");
        return false;
      }

      // Save token and user data to localStorage
      authService.saveToken(token);
      authService.saveUser(user);

      queryClient.setQueryData(authKeys.profile(), user);

      setAuthState({
        isAuthenticated: true,
        user: user,
        loading: false,
      });

      console.log("Login successful, auth state updated");
      return true;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    authService.removeToken();
    queryClient.removeQueries({ queryKey: authKeys.all });
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  const value = {
    ...authState,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
