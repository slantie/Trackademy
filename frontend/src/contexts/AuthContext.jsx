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

      if (token) {
        try {
          const response = await getUserProfile();
          setAuthState({
            isAuthenticated: true,
            user: response.data?.user || response.user || response,
            loading: false,
          });
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
      const response = await loginUser({ identifier, password });
      const token = response.token;
      const user = response.data?.user || response.user;

      authService.saveToken(token);
      queryClient.setQueryData(authKeys.profile(), user);

      setAuthState({
        isAuthenticated: true,
        user: user,
        loading: false,
      });

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
