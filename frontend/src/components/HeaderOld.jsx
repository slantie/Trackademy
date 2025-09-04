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
  AccountCircle, // Kept for consistency if needed elsewhere, though Avatar is used
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
        // Added transition for smoother interaction
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box
        sx={{
          width: 36, // Slightly reduced size for a sleeker look
          height: 36,
          borderRadius: 1.5, // Slightly less rounded
          background: "linear-gradient(135deg, #8155c6 0%, #667eea 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 800,
          fontSize: "1.1rem", // Adjusted font size
          boxShadow: "0 4px 12px rgba(129, 85, 198, 0.3)", // Softer shadow
        }}
      >
        T
      </Box>
      <Typography
        variant="h6" // Changed to h6 for better semantic hierarchy in header
        component="div"
        sx={{
          color: "primary.main",
          fontWeight: 700, // Slightly less bold for h6
          fontSize: { xs: "1.2rem", md: "1.35rem" }, // Adjusted font sizes
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
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, ml: 3 }}>
      {navItems.map((item, index) => (
        <Button
          key={index}
          component={Link}
          to={item.path}
          startIcon={<item.icon />}
          sx={{
            color: isActive(item.path) ? "primary.main" : "text.secondary", // Use text.secondary for subtle inactive links
            fontWeight: isActive(item.path) ? 700 : 500,
            px: 1.5, // Reduced padding for compactness
            py: 0.8,
            borderRadius: 2, // Slightly less rounded buttons
            background: isActive(item.path)
              ? (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(129, 85, 198, 0.12)" // Slightly more prominent active background
                    : "rgba(129, 85, 198, 0.08)"
              : "transparent",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(129, 85, 198, 0.15)"
                  : "rgba(129, 85, 198, 0.08)",
              transform: "translateY(-1px)",
              color: "primary.main", // Hover to primary color
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
                ? "rgba(255, 255, 255, 0.08)" // Slightly more visible background
                : "rgba(0, 0, 0, 0.05)",
            borderRadius: 2, // Consistent border radius
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.08)",
              transform: "translateY(-1px)", // Subtle hover effect
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {mode === "dark" ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />} {/* Smaller icon */}
        </IconButton>
      </Tooltip>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Chip
          label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600, borderRadius: 1.5 }} // Refined chip style
        />
        <IconButton
          onClick={handleUserMenuOpen}
          sx={{
            p: 0, // No padding on IconButton for Avatar, Avatar has its own size
            "&:hover": {
              background: "transparent",
            },
          }}
        >
          <Avatar
            sx={{
              width: 32, // Slightly smaller avatar
              height: 32,
              bgcolor: "primary.main",
              fontSize: "0.85rem", // Adjusted font size
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(129, 85, 198, 0.2)", // Softer shadow
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)", // Slight scale on hover
              },
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
            mt: 1.5, // Adjusted margin top for a clean separation
            borderRadius: 2,
            minWidth: 220, // Slightly wider menu
            boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)', // Enhanced shadow
            border: "1px solid",
            borderColor: theme.palette.divider,
            background: theme.palette.background.paper, // Ensure background matches theme
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
            borderColor: theme.palette.divider,
            mb: 0.5, // Added margin bottom for separation
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} color="text.primary"> {/* Enhanced typography */}
            {user?.name || "User"}
          </Typography>
          <Typography variant="body2" color="text.secondary"> {/* Enhanced typography */}
            {user?.email}
          </Typography>
        </Box>
        <MenuItem onClick={handleLogout} sx={{ py: 1.2, gap: 1, borderRadius: 1.5, mx: 1, mb: 0.5, '&:hover': { background: theme.palette.action.hover } }}>
          <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
          <Typography color="error.main">Logout</Typography> {/* Explicitly set logout color */}
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
              ? "rgba(27, 27, 31, 0.9)" // Slightly more opaque
              : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(15px)", // Slightly less blur
          boxShadow: theme.palette.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)', // Added shadow
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
                background: theme.palette.action.selected, // Use theme's action.selected for a subtle background
                border: `1px solid ${theme.palette.divider}`, // Added a subtle border
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} color="text.primary">
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
                  sx={{ borderRadius: 1.5 }}
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
                  ? theme.palette.action.selected
                  : "transparent",
                color: isActive(item.path) ? "primary.main" : "text.primary",
                "&:hover": {
                  background: theme.palette.action.hover, // Use theme's hover state
                  color: "primary.main", // Ensure hover also goes to primary color
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
                    background: theme.palette.action.hover,
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
                    background: "rgba(245, 87, 108, 0.08)", // Specific hover for logout
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
              ? "rgba(27, 27, 31, 0.85)" // Slightly more opaque
              : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(18px)", // Adjusted blur
          borderBottom: "1px solid",
          borderColor: theme.palette.divider, // Use theme divider color
          py: 0.5, // Slight vertical padding for the AppBar itself
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
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(0, 0, 0, 0.05)",
                      borderRadius: 2,
                      "&:hover": {
                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.15)"
                            : "rgba(0, 0, 0, 0.08)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    {mode === "dark" ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Button
                  component={Link}
                  to="/auth"
                  variant="contained"
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: 2.5, // Slightly less rounded for a modern look
                    background:
                      "linear-gradient(135deg, #8155c6 0%, #667eea 100%)",
                    fontSize: '0.9rem', // Adjusted font size
                    fontWeight: 600,
                    boxShadow: "0 6px 20px rgba(129, 85, 198, 0.3)", // Stronger but softer shadow
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #6d47b3 0%, #5866d1 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 30px rgba(129, 85, 198, 0.4)", // Even stronger shadow on hover
                    },
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button & Actions */}
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
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)",
                    borderRadius: 2,
                    "&:hover": {
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(0, 0, 0, 0.08)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {mode === "dark" ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </IconButton>
              </Tooltip>
            )}

            {isAuthenticated ? (
              <>
                {/* Mobile UserMenu without theme toggle, as theme toggle is before it now */}
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{
                    p: 0,
                    "&:hover": {
                      background: "transparent",
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "primary.main",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                </IconButton>
                {/* Re-render the Menu component for the mobile avatar */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 220,
                      boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
                      border: "1px solid",
                      borderColor: theme.palette.divider,
                      background: theme.palette.background.paper,
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
                      borderColor: theme.palette.divider,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                      {user?.name || "User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>
                  <MenuItem onClick={handleLogout} sx={{ py: 1.2, gap: 1, borderRadius: 1.5, mx: 1, mb: 0.5, '&:hover': { background: theme.palette.action.hover } }}>
                    <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
                    <Typography color="error.main">Logout</Typography>
                  </MenuItem>
                </Menu>

                <IconButton
                  onClick={toggleMobileMenu}
                  sx={{
                    ml: 0.5, // Adjusted margin
                    color: "text.primary",
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)",
                    borderRadius: 2,
                    "&:hover": {
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.15)"
                          : "rgba(0, 0, 0, 0.08)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
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
                  py: 0.7, // Adjusted padding for smaller button
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #8155c6 0%, #667eea 100%)",
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(129, 85, 198, 0.3)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #6d47b3 0%, #5866d1 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 18px rgba(129, 85, 198, 0.4)",
                  },
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