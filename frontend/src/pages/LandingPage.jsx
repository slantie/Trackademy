import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  CoPresent as CoPresentIcon,
  Assignment as AssignmentIcon,
  WorkspacePremium as WorkspacePremiumIcon,
} from "@mui/icons-material";

const LandingPage = () => {
  const features = [
    {
      icon: <AssessmentIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Results & Analytics",
      description:
        "Publish and view results instantly. Gain insights with powerful performance analytics.",
    },
    {
      icon: <CoPresentIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Attendance Monitoring",
      description: "Real-time attendance tracking to keep students on track.",
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Assignments & Submissions",
      description:
        "A seamless workflow for creating assignments and managing student submissions.",
    },
    {
      icon: (
        <WorkspacePremiumIcon sx={{ fontSize: 48, color: "primary.main" }} />
      ),
      title: "Portfolio Building",
      description:
        "Track internships and certificates to build a professional portfolio.",
    },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: "light.background",
      }}
    >
      {/* Header/Navbar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "light.background",
          borderBottom: "1px solid",
          borderColor: "light.secondary",
        }}
      >
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{
              flexGrow: 1,
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            Trackademy
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.main",
                opacity: 0.9,
              },
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: "center",
            py: { xs: 8, md: 12 },
            px: 2,
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              mb: 3,
              color: "light.text",
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 700,
            }}
          >
            Trackademy: Smart, Simple, Seamless.
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              mb: 4,
              color: "light.muted.text",
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.6,
              fontSize: { xs: "1.1rem", md: "1.4rem" },
            }}
          >
            The all-in-one platform for students and faculty to manage results,
            track attendance, and collaborate on academic work. Your entire
            academic life, organized.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "primary.main",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "primary.main",
                opacity: 0.9,
              },
            }}
          >
            Get Started
          </Button>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              textAlign: "center",
              mb: 6,
              color: "light.text",
              fontWeight: 600,
            }}
          >
            Core Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 3,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 30px rgba(129, 85, 198, 0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        mb: 2,
                        color: "light.text",
                        fontWeight: 600,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "light.muted.text",
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: "light.muted.background",
          py: 4,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "light.muted.text",
            }}
          >
            © 2025 Trackademy. All Rights Reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
