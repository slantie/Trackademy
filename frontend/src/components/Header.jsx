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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../constants/roles";

// Helper function to get navigation items based on role
const getNavItems = (role) => {
  switch (role) {
    case Role.STUDENT:
      return [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Assignments", path: "/assignments" },
        { name: "Certificates", path: "/certificates" },
        { name: "Internships", path: "/internships" },
      ];
    case Role.FACULTY:
      return [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Courses", path: "/courses" },
        { name: "Assignments", path: "/assignments" },
        { name: "Students", path: "/students" },
      ];
    case Role.ADMIN:
      return [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Colleges", path: "/college" },
        { name: "Academic Years", path: "/academic-year" },
        { name: "Departments", path: "/department" },
        { name: "Subjects", path: "/subject" },
        { name: "Faculty", path: "/faculty" },
        { name: "Semesters", path: "/semester" },
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
