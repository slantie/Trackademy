// src/components/Header.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Fade,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AccountCircle,
  Menu as MenuIcon,
  DarkMode,
  LightMode,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useThemeMode } from "../contexts/ThemeContext";
import { Role } from "../constants/roles";

// Helper function to get navigation items based on role
const getNavItems = (role) => {
  switch (role) {
    case Role.STUDENT:
      return [
        { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
        { name: "Assignments", path: "/assignments", icon: AssignmentIcon },
        { name: "Certificates", path: "/certificates", icon: SchoolIcon },
        { name: "Internships", path: "/internships", icon: BusinessIcon },
      ];
    case Role.FACULTY:
      return [
        { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
        { name: "Courses", path: "/courses", icon: SchoolIcon },
        { name: "Assignments", path: "/assignments", icon: AssignmentIcon },
        { name: "Students", path: "/students", icon: GroupsIcon },
      ];ADMIN
    case Role.ADMIN:
      return [
        { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
        { name: "Colleges", path: "/college", icon: BusinessIcon },
        { name: "Academic Years", path: "/academic-year", icon: SchoolIcon },
        { name: "Departments", path: "/department", icon: BusinessIcon },
        { name: "Subjects", path: "/subject", icon: AssignmentIcon },
        { name: "Faculty", path: "/faculty", icon: PersonIcon },
        { name: "Semesters", path: "/semester", icon: SchoolIcon },
        { name: "Course", path: "/course", icon: SchoolIcon },
        { name: "Division", path: "/division", icon: SchoolIcon },
        { name: "Student", path: "/student", icon: SchoolIcon },
      ];
    default:
      return [];
  }
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/auth");
  };

  const navItems = isAuthenticated ? getNavItems(user?.role) : [];

  // Debug logging to check role processing
  console.log("Header - isAuthenticated:", isAuthenticated);
  console.log("Header - user:", user);
  console.log("Header - user role:", user?.role);
  console.log("Header - navItems:", navItems);

  const renderDesktopNav = (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "none", md: "flex" },
        justifyContent: "center",
        gap: 1,
      }}
    >
      {navItems.map((item) => (
        <Button
          key={item.name}
          component={Link}
          to={item.path}
          sx={{
            my: 2,
            color: "white",
            px: 2,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              transform: "translateY(-1px)",
            },
            "&.active": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          {item.name}
        </Button>
      ))}
    </Box>
  );

  const renderUserMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <Typography variant="body1">{user?.fullName || "User"}</Typography>
      </MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {navItems.map((item) => (
        <MenuItem
          key={item.name}
          onClick={handleMobileMenuClose}
          component={Link}
          to={item.path}
        >
          {item.name}
        </MenuItem>
      ))}
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography
          variant="h4"
          component={Link}
          to={isAuthenticated ? "/dashboard" : "/"}
          sx={{
            flexGrow: { xs: 1, md: 0 },
            color: "white",
            fontWeight: 700,
            textDecoration: "none",
            mr: { md: 4 },
            background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          Trackademy
        </Typography>
        {isAuthenticated && !isMobile && renderDesktopNav}
        {isAuthenticated ? (
          <>
            {isMobile ? (
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls="menu-mobile"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <AccountCircle />
              </IconButton>
            )}
          </>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "primary.main",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "#f8f9fa",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px 0 rgba(0,0,0,0.15)",
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
      {renderUserMenu}
      {renderMobileMenu}
    </AppBar>
  );
};

export default Header;
