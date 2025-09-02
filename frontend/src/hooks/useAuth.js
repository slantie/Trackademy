import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextBase";

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  console.log("🪝 useAuth hook called");
  const context = useContext(AuthContext);
  console.log("📦 Context value:", context);

  if (!context) {
    console.error("❌ useAuth called outside of AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
