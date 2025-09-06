import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../hooks/useAuth";
import { Role } from "../../constants/roles";
import { showToast } from "../../utils/toast";

const getNavItems = (role) => {
  switch (role) {
    case Role.STUDENT:
      return [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/student/assignment", label: "Assignments" },
        { path: "/student/result", label: "Results" },
        { path: "/student/certificate", label: "Certificates" },
        { path: "/student/internship", label: "Internships" },
      ];
    case Role.FACULTY:
      return [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/faculty/assignment", label: "Assignments" },
        { path: "/faculty/attendance", label: "Attendance" },
      ];
    case Role.ADMIN:
      return [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/admin/academic-year", label: "Academic Years" },
        { path: "/admin/college", label: "Colleges" },
        { path: "/admin/department", label: "Departments" },
        { path: "/admin/semester", label: "Semesters" },
        { path: "/admin/division", label: "Divisions" },
        { path: "/admin/faculty", label: "Faculty" },
        { path: "/admin/course", label: "Courses" },
        { path: "/admin/exam", label: "Exam" },
        { path: "/admin/student", label: "Students" },
        { path: "/admin/upload", label: "Upload" },
      ];
    default:
      return [{ path: "/", label: "Home" }];
  }
};

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const navItems = isAuthenticated
    ? getNavItems(user?.role)
    : [
        { path: "/", label: "Home" },
        { path: "/setup", label: "Setup" },
      ];

  const handleLogout = () => {
    logout();
    showToast.success("You have been logged out.");
    navigate("/");
  };

  const _handleNavClick = () => {
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest(".mobile-menu-container")) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileMenu]);

  return (
    <header className="p-4 flex justify-between items-center border-b-2 border-border relative">
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/Logo.png" alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl md:text-2xl font-semibold tracking-wide hover:text-primary truncate">
          Trackademy
        </h1>
      </div>

      <div className="hidden lg:flex items-center space-x-4">
        <nav>
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `relative text-md tracking-wider text-foreground hover:text-primary transition-colors duration-300 pb-2 ${
                      isActive ? "text-primary" : ""
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-2">
          <span className="h-10 border-l-2 border-border"></span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-muted border-2 border-border hover:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 tracking-wider font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <>
              <NavLink
                to="/auth?view=login"
                className="bg-muted border-2 border-border hover:border-primary tracking-wider font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Login
              </NavLink>
              <NavLink
                to="/auth?view=signup"
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-2 border-transparent tracking-wider font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div className="flex lg:hidden items-center space-x-3">
        <ThemeToggle />
        <div className="mobile-menu-container">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 bg-muted border-2 border-border hover:border-primary rounded-lg transition-all duration-300"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={({ isActive }) =>
                      `block py-2 px-4 rounded-lg transition-colors duration-300 ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile Auth Section */}
            {isAuthenticated && user ? (
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 py-2 px-4 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <NavLink
                  to="/auth?view=login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full text-center bg-muted border border-border py-2 px-4 rounded-lg font-bold transition-colors hover:border-primary"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/auth?view=signup"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full text-center bg-primary text-primary-foreground py-2 px-4 rounded-lg font-bold transition-all shadow hover:shadow-lg"
                >
                  Sign Up
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
