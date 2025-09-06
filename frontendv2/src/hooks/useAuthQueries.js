import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginUser, getUserProfile } from "../api/auth";
import { authService } from "../services/authService";

// Query keys for consistent cache management
export const authKeys = {
  all: ["auth"],
  profile: () => [...authKeys.all, "profile"],
  login: () => [...authKeys.all, "login"],
};

/**
 * Hook for user profile query
 * Only runs when there's a token available
 */
export const useUserProfile = () => {
  const hasToken = authService.isAuthenticated();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: getUserProfile,
    enabled: hasToken, // Only run if user has a token
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors (authentication failures)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Hook for login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("🎯 Login mutation successful:", data);

      // Save token and user to localStorage
      if (data.token) {
        authService.saveToken(data.token);
      }

      const user = data.data?.user || data.user;
      if (user) {
        authService.saveUser(user);
        queryClient.setQueryData(authKeys.profile(), user);
      }

      // Optionally invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error("❌ Login mutation failed:", error);
      // Clear any cached auth data on login failure
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
};

/**
 * Hook for logout functionality
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // No API call needed for logout, just cleanup
      authService.removeToken();
      return Promise.resolve();
    },
    onSuccess: () => {
      console.log("👋 Logout successful");
      // Clear all auth-related queries from cache
      queryClient.removeQueries({ queryKey: authKeys.all });
      // Reset query client to clear all cached data
      queryClient.clear();
    },
  });
};

/**
 * Hook for updating password
 */
// export const useUpdatePassword = () => {
//   return useMutation({
//     mutationFn: updatePassword,
//     onSuccess: (data) => {
//       console.log("🔑 Password updated successfully:", data);
//     },
//     onError: (error) => {
//       console.error("❌ Password update failed:", error);
//     },
//   });
// };
