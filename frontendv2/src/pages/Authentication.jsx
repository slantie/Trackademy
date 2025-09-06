import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { showToast } from "../utils/toast";

const Authentication = () => {
  const [view, setView] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("view") === "signup") {
      setView("signup");
    } else {
      setView("login");
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const identifier = e.target.identifier.value;
    const password = e.target.password.value;

    console.log("Authentication page: Starting login process...");
    try {
      const success = await login(identifier, password);
      console.log("Authentication page: Login result:", success);

      if (success) {
        showToast.success("Login successful! Welcome back.");
        console.log("Authentication page: Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        showToast.error("Invalid credentials. Please try again.");
      }
    } catch (err) {
      showToast.error("Login failed. Please check the console for details.");
      console.error("Authentication page: Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    showToast.info("Sign-up functionality is not yet implemented.");
    // Placeholder for signup logic
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-2xl shadow-2xl border border-border/20">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">
          {view === "login" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {view === "login"
            ? "Sign in to access your dashboard."
            : "Join us to simplify your academic life."}
        </p>
      </div>
      {view === "login" ? (
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          onSwitchView={() => setView("signup")}
        />
      ) : (
        <SignupForm
          onSubmit={handleSignup}
          isLoading={isLoading}
          onSwitchView={() => setView("login")}
        />
      )}
    </div>
  );
};

const LoginForm = ({ onSubmit, isLoading, onSwitchView }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="identifier"
          className="block text-sm font-medium text-muted-foreground"
        >
          Email or Enrollment Number
        </label>
        <div className="mt-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-muted/50 focus:ring-1 focus:ring-light-highlight dark:focus:ring-dark-highlight focus:border-light-highlight dark:focus:border-dark-highlight outline-none transition"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-muted-foreground"
        >
          Password
        </label>
        <div className="mt-1 relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-muted/50 focus:ring-1 focus:ring-light-highlight dark:focus:ring-dark-highlight focus:border-light-highlight dark:focus:border-dark-highlight outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
      >
        {isLoading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
        )}
        {isLoading ? "Signing In..." : "Sign In"}
      </button>
      <p className="text-sm text-center text-muted-foreground">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchView}
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  );
};

// NOTE: Signup form is a placeholder as the logic is not implemented yet.
const SignupForm = ({ onSubmit, isLoading, onSwitchView }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div>
      <label
        htmlFor="name"
        className="block text-sm font-medium text-muted-foreground"
      >
        Full Name
      </label>
      <div className="mt-1 relative">
        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-muted/50 focus:ring-1 focus:ring-light-highlight dark:focus:ring-dark-highlight focus:border-light-highlight dark:focus:border-dark-highlight outline-none transition"
        />
      </div>
    </div>
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-muted-foreground"
      >
        Email
      </label>
      <div className="mt-1 relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-muted/50 focus:ring-1 focus:ring-light-highlight dark:focus:ring-dark-highlight focus:border-light-highlight dark:focus:border-dark-highlight outline-none transition"
        />
      </div>
    </div>
    <button
      type="submit"
      disabled={isLoading}
      className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
    >
      {isLoading && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
      )}
      {isLoading ? "Creating..." : "Create Account"}
    </button>
    <p className="text-sm text-center text-muted-foreground">
      Already have an account?{" "}
      <button
        type="button"
        onClick={onSwitchView}
        className="font-medium text-primary hover:underline"
      >
        Sign in
      </button>
    </p>
  </form>
);

export default Authentication;
