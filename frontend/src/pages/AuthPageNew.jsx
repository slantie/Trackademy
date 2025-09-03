import React, { useState } from "react";
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
  Paper,
  Divider,
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
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(loginData.identifier, loginData.password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Add registration logic here
      setError("Registration functionality coming soon!");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        background: (theme) => theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1B1B1F 0%, #161618 100%)'
          : 'linear-gradient(135deg, #F6F6F7 0%, #EBEBEF 100%)',
      }}
    >
      <Container maxWidth="sm">
        {/* Header with Back Button */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            component={Link} 
            to="/"
            sx={{
              background: (theme) => theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.03)',
              '&:hover': {
                background: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" color="text.secondary">
            Back to Home
          </Typography>
        </Box>

        <Card
          sx={{
            maxWidth: 480,
            mx: "auto",
            borderRadius: 4,
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(32, 33, 39, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                T
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome to Trackademy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 0 
                  ? "Sign in to continue to your dashboard" 
                  : "Create your account to get started"
                }
              </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                centered
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 3,
                    borderRadius: 2,
                  },
                  '& .MuiTab-root': {
                    borderRadius: 2,
                    mx: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&.Mui-selected': {
                      color: 'primary.main',
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
                  '& .MuiAlert-message': {
                    fontSize: '0.9rem',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            {/* Login Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box component="form" onSubmit={handleLoginSubmit}>
                <TextField
                  fullWidth
                  label="Email or Username"
                  variant="outlined"
                  value={loginData.identifier}
                  onChange={(e) =>
                    setLoginData({ ...loginData, identifier: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
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
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
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
                    background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6d47b3 0%, #5866d1 100%)',
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
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                  }}
                >
                  Forgot your password?
                </Button>
              </Box>
            </TabPanel>

            {/* Registration Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box component="form" onSubmit={handleRegisterSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
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
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="College/Institution"
                  variant="outlined"
                  value={registerData.college}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, college: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  required
                />

                <TextField
                  fullWidth
                  label="Department"
                  variant="outlined"
                  value={registerData.department}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, department: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
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
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
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
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, confirmPassword: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                    background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6d47b3 0%, #5866d1 100%)',
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
                  bgcolor: 'background.paper',
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                }} 
              />
            </Divider>

            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ textAlign: 'center' }}
            >
              By signing in, you agree to our{' '}
              <Button variant="text" size="small" sx={{ textTransform: 'none', p: 0 }}>
                Terms of Service
              </Button>
              {' '}and{' '}
              <Button variant="text" size="small" sx={{ textTransform: 'none', p: 0 }}>
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
