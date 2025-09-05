import React, { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

const AuthPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerCollege, setRegisterCollege] = useState("");
  const [registerDepartment, setRegisterDepartment] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = useCallback((event, newValue) => {
    setTabValue(newValue);
    setError("");
  }, []);

  const handleLoginSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const success = await login(loginIdentifier, loginPassword);

        if (success) {
          navigate("/dashboard");
        } else {
          setError("Invalid credentials. Please try again.");
        }
      } catch (err) {
        setError("Login failed. Please try again.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [loginIdentifier, loginPassword, login, navigate]
  );

  const handleRegisterSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      if (registerPassword !== registerConfirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      try {
        // Add registration logic here
        setError("Registration functionality coming soon!");
      } catch (err) {
        setError("Registration failed. Please try again.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
    [registerPassword, registerConfirmPassword]
  );

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
      }}
    >
      <Container maxWidth="sm">
        {/* Header with Back Button */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            component={Link}
            to="/"
            sx={{
              background:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.03)",
              border:
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
              "&:hover": {
                background:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.08)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Back to Home
          </Typography>
        </Box>

        <Card
          sx={{
            maxWidth: 480,
            mx: "auto",
            borderRadius: 4,
            background:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.02)"
                : "#ffffff",
            backdropFilter: "blur(20px)",
            border:
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 20px 60px rgba(0, 0, 0, 0.3)"
                : "0 20px 60px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {/* Logo and Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  mx: "auto",
                  mb: 2,
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                }}
              >
                T
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  mb: 1,
                  fontSize: { xs: "1.75rem", md: "2rem" },
                }}
              >
                Welcome to Trackademy
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "1rem",
                }}
              >
                {tabValue === 0
                  ? "Sign in to continue to your dashboard"
                  : "Create your account to get started"}
              </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                    height: 3,
                    borderRadius: 2,
                  },
                  "& .MuiTab-root": {
                    borderRadius: 2,
                    mx: 1,
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    "&.Mui-selected": {
                      color: "primary.main",
                    },
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                    },
                  },
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(244, 67, 54, 0.2)"
                      : "1px solid rgba(244, 67, 54, 0.1)",
                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(244, 67, 54, 0.05)"
                      : "rgba(244, 67, 54, 0.05)",
                  "& .MuiAlert-message": {
                    fontSize: "0.9rem",
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Login Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleLoginSubmit} noValidate>
                <TextField
                  fullWidth
                  label="Email or Username"
                  variant="outlined"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  type="text" // Added type="text" for explicit clarity
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "text.secondary" }}
                          type="button"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  type="button"
                  sx={{
                    color: "text.secondary",
                    textTransform: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    "&:hover": {
                      background:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  Forgot your password?
                </Button>
              </Box>
            </TabPanel>

            {/* Registration Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleRegisterSubmit} noValidate>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  type="text" // Added type="text"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="College/Institution"
                  variant="outlined"
                  value={registerCollege}
                  onChange={(e) => setRegisterCollege(e.target.value)}
                  type="text" // Added type="text"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Department"
                  variant="outlined"
                  value={registerDepartment}
                  onChange={(e) => setRegisterDepartment(e.target.value)}
                  type="text" // Added type="text"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "text.secondary" }}
                          type="button"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "rgba(255, 255, 255, 0.3)"
                              : "rgba(0, 0, 0, 0.3)",
                        },
                      },
                      "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderWidth: 2,
                        },
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          sx={{ color: "text.secondary" }}
                          type="button"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: 3,
                    textTransform: "none",
                    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Box>
            </TabPanel>

            <Divider sx={{ my: 3 }}>
              <Chip
                label="or"
                size="small"
                sx={{
                  bgcolor: "background.paper",
                  color: "text.secondary",
                  fontSize: "0.8rem",
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid rgba(0, 0, 0, 0.08)",
                }}
              />
            </Divider>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              By signing in, you agree to our{" "}
              <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                  color: "primary.main",
                  fontWeight: 500,
                }}
              >
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button
                variant="text"
                size="small"
                sx={{
                  textTransform: "none",
                  p: 0,
                  minWidth: "auto",
                  color: "primary.main",
                  fontWeight: 500,
                }}
              >
                Privacy Policy
              </Button>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AuthPage;
