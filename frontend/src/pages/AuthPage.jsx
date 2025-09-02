import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";

const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  // const [registerData, setRegisterData] = useState({
  //   name: "",
  //   email: "",
  //   password: "",
  // });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(""); // Clear errors when switching tabs
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 Form submitted with data:", {
      identifier: loginData.identifier,
      password: "***",
    });

    setLoading(true);
    setError("");

    try {
      console.log("🔄 Calling login function...");
      const success = await login(loginData.identifier, loginData.password);
      console.log("📊 Login result:", success);

      if (success) {
        console.log("✅ Login successful, navigating to dashboard");
        navigate("/dashboard");
      } else {
        console.log("❌ Login failed, showing error message");
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.log("💥 Exception during login:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const handleRegisterSubmit = (e) => {
  //   e.preventDefault();
  //   setError("Registration functionality will be implemented soon.");
  // };

  const TabPanel = ({ children, value, index }) => {
    return (
      <div hidden={value !== index}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "light.muted.background",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            maxWidth: 400,
            mx: "auto",
            p: 2,
            boxShadow: "0 8px 32px rgba(129, 85, 198, 0.15)",
          }}
        >
          <CardContent>
            {/* Logo/Title */}
            <Typography
              variant="h4"
              component="h1"
              sx={{
                textAlign: "center",
                mb: 3,
                color: "primary.main",
                fontWeight: 700,
              }}
            >
              Trackademy
            </Typography>

            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                mb: 2,
                "& .MuiTabs-indicator": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              <Tab
                label="Login"
                sx={{
                  fontWeight: 600,
                  "&.Mui-selected": {
                    color: "primary.main",
                  },
                }}
              />
              <Tab
                label="Register"
                sx={{
                  fontWeight: 600,
                  "&.Mui-selected": {
                    color: "primary.main",
                  },
                }}
              />
            </Tabs>

            {/* Login Tab Panel */}
            <TabPanel value={tabValue} index={0}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 3,
                  color: "light.text",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Welcome Back!
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleLoginSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Email or Enrollment Number"
                  variant="outlined"
                  value={loginData.identifier}
                  onChange={(e) =>
                    setLoginData({ ...loginData, identifier: e.target.value })
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main",
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                  sx={{
                    backgroundColor: "primary.main",
                    mt: 2,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      opacity: 0.9,
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </Box>
            </TabPanel>

            {/* Register Tab Panel */}
            <TabPanel value={tabValue} index={1}>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  mb: 3,
                  color: "light.text",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Faculty Registration
              </Typography>

              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "primary.main",
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "primary.main",
                    mt: 2,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "primary.main",
                      opacity: 0.9,
                    },
                  }}
                  onClick={() => console.log("Create Account clicked")}
                >
                  Create Account
                </Button>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AuthPage;
