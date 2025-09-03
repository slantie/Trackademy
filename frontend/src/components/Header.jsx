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
      ];
    case Role.ADMIN:
      return [
        { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
        { name: "Colleges", path: "/college", icon: BusinessIcon },
        { name: "Academic Years", path: "/academic-year", icon: SchoolIcon },
        { name: "Departments", path: "/department", icon: BusinessIcon },
        { name: "Subjects", path: "/subject", icon: AssignmentIcon },
        { name: "Faculty", path: "/faculty", icon: PersonIcon },
        { name: "Semesters", path: "/semester", icon: SchoolIcon },
        { name: "Divisions", path: "/division", icon: SchoolIcon },
        { name: "Students", path: "/student", icon: SchoolIcon },
        { name: "Courses", path: "/course", icon: SchoolIcon },
      ];
    default:
      return [];
  }
};

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const _isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = isAuthenticated ? getNavItems(user?.role) : [];

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  // Logo component
  const Logo = () => (
    <Box
      component={Link}
      to="/"
      sx={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          background: "linear-gradient(135deg, #8155c6 0%, #667eea 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
          fontSize: "1.2rem",
        }}
      >
        T
      </Box>
      <Typography
        variant="h5"
        component="div"
        sx={{
          color: "primary.main",
          fontWeight: 800,
          fontSize: { xs: "1.3rem", md: "1.5rem" },
          background: "linear-gradient(135deg, #8155c6 0%, #667eea 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Trackademy
      </Typography>
    </Box>
  );

  // Desktop Navigation
  const DesktopNav = () => (
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, ml: 4 }}>
      {navItems.map((item, index) => (
        <Button
          key={index}
          component={Link}
          to={item.path}
          startIcon={<item.icon />}
          sx={{
            color: isActive(item.path) ? "primary.main" : "text.primary",
            fontWeight: isActive(item.path) ? 700 : 500,
            px: 2,
            py: 1,
            borderRadius: 3,
            background: isActive(item.path)
              ? (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(129, 85, 198, 0.1)"
                    : "rgba(129, 85, 198, 0.05)"
              : "transparent",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(129, 85, 198, 0.15)"
                  : "rgba(129, 85, 198, 0.08)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {item.name}
        </Button>
      ))}
    </Box>
  );

  // User Menu for authenticated users
  const UserMenu = () => (
    <>
      <Tooltip title="Toggle theme" arrow>
        <IconButton
          onClick={toggleTheme}
          sx={{
            mr: 1,
            color: "text.primary",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.03)",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          {mode === "dark" ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Chip
          label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
        <IconButton
          onClick={handleUserMenuOpen}
          sx={{
            p: 0.5,
            "&:hover": {
              background: "transparent",
            },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "primary.main",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 200,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            border: "1px solid",
            borderColor: "divider",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {user?.name || "User"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, gap: 1 }}>
          <LogoutIcon fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </>
  );

  // Mobile Drawer
  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      PaperProps={{
        sx: {
          width: 280,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(27, 27, 31, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Logo />
          <IconButton onClick={toggleMobileMenu}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isAuthenticated && (
          <>
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                background: "rgba(129, 85, 198, 0.05)",
              }}
            >
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.name || "User"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={
                    user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)
                  }
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
            <Divider sx={{ mb: 1 }} />
          </>
        )}

        <List>
          {navItems.map((item, index) => (
            <ListItem
              key={index}
              component={Link}
              to={item.path}
              onClick={toggleMobileMenu}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                background: isActive(item.path)
                  ? "rgba(129, 85, 198, 0.1)"
                  : "transparent",
                color: isActive(item.path) ? "primary.main" : "text.primary",
                "&:hover": {
                  background: "rgba(129, 85, 198, 0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
              />
            </ListItem>
          ))}

          {isAuthenticated && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem
                onClick={() => {
                  toggleTheme();
                  toggleMobileMenu();
                }}
                sx={{
                  borderRadius: 2,
                  "&:hover": {
                    background: "rgba(129, 85, 198, 0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {mode === "dark" ? <LightMode /> : <DarkMode />}
                </ListItemIcon>
                <ListItemText
                  primary={`Switch to ${
                    mode === "dark" ? "Light" : "Dark"
                  } Mode`}
                />
              </ListItem>

              <ListItem
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                sx={{
                  borderRadius: 2,
                  color: "error.main",
                  "&:hover": {
                    background: "rgba(245, 87, 108, 0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(27, 27, 31, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <Logo />

          {isAuthenticated && <DesktopNav />}

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Actions */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Tooltip title="Toggle theme" arrow>
                  <IconButton
                    onClick={toggleTheme}
                    sx={{
                      mr: 2,
                      color: "text.primary",
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.03)",
                    }}
                  >
                    {mode === "dark" ? <LightMode /> : <DarkMode />}
                  </IconButton>
                </Tooltip>
                <Button
                  component={Link}
                  to="/auth"
                  variant="contained"
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, #8155c6 0%, #667eea 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #6d47b3 0%, #5866d1 100%)",
                    },
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {!isAuthenticated && (
              <Tooltip title="Toggle theme" arrow>
                <IconButton
                  onClick={toggleTheme}
                  sx={{
                    color: "text.primary",
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                  }}
                >
                  {mode === "dark" ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            )}

            {isAuthenticated ? (
              <>
                <UserMenu />
                <IconButton
                  onClick={toggleMobileMenu}
                  sx={{ ml: 1, color: "text.primary" }}
                >
                  <MenuIcon />
                </IconButton>
              </>
            ) : (
              <Button
                component={Link}
                to="/auth"
                variant="contained"
                size="small"
                sx={{
                  px: 2,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #8155c6 0%, #667eea 100%)",
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <MobileDrawer />
    </>
  );
};

export default Header;
