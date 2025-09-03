import React from "react";
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Paper,
  useTheme,
} from "@mui/material";
import {
  Assessment as AssessmentIcon,
  CoPresent as CoPresentIcon,
  Assignment as AssignmentIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  StarBorder as StarIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const theme = useTheme();
  
  const features = [
    {
      icon: <AssessmentIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Results & Analytics",
      description:
        "Publish and view results instantly. Gain insights with powerful performance analytics and detailed reporting.",
      color: "primary",
    },
    {
      icon: <CoPresentIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
      title: "Attendance Monitoring",
      description: "Real-time attendance tracking with automated notifications to keep students and faculty connected.",
      color: "secondary",
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 48, color: "success.main" }} />,
      title: "Assignments & Submissions",
      description:
        "Streamlined workflow for creating, submitting, and grading assignments with deadline management.",
      color: "success",
    },
    {
      icon: <WorkspacePremiumIcon sx={{ fontSize: 48, color: "warning.main" }} />,
      title: "Portfolio Building",
      description:
        "Track internships, certificates, and achievements to build comprehensive professional portfolios.",
      color: "warning",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Students", icon: PeopleIcon },
    { number: "500+", label: "Faculty Members", icon: CoPresentIcon },
    { number: "98%", label: "Success Rate", icon: TrendingUpIcon },
    { number: "24/7", label: "Support", icon: SecurityIcon },
  ];

  const benefits = [
    {
      icon: <SpeedIcon sx={{ color: 'primary.main', fontSize: 40 }} />,
      title: "Lightning Fast",
      description: "Optimized performance for instant loading and seamless user experience."
    },
    {
      icon: <SecurityIcon sx={{ color: 'success.main', fontSize: 40 }} />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee."
    },
    {
      icon: <TrendingUpIcon sx={{ color: 'secondary.main', fontSize: 40 }} />,
      title: "Data-Driven Insights",
      description: "Advanced analytics to track progress and improve outcomes."
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh" }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 6, md: 10 },
          }}
        >
          <Chip
            label="🚀 New Features Available"
            sx={{
              mb: 3,
              bgcolor: 'rgba(129, 85, 198, 0.1)',
              color: 'primary.main',
              fontWeight: 600,
              px: 2,
              py: 0.5,
            }}
          />
          
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: "2.5rem", md: "4rem", lg: "4.5rem" },
              lineHeight: 1.1,
            }}
          >
            Your Academic Journey,
            <br />
            Simplified & Smart
          </Typography>
          
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: 700,
              mx: "auto",
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              lineHeight: 1.6,
            }}
          >
            The all-in-one platform for students and faculty to manage results,
            track attendance, collaborate on assignments, and build professional portfolios.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/auth"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(129, 85, 198, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(129, 85, 198, 0.4)',
                  background: 'linear-gradient(135deg, #6d47b3 0%, #5866d1 100%)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get Started Free
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Watch Demo
            </Button>
          </Box>
        </Box>

        {/* Stats Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(129, 85, 198, 0.05)' 
              : 'rgba(129, 85, 198, 0.03)',
            border: '1px solid',
            borderColor: 'divider',
            mb: { xs: 8, md: 12 },
          }}
        >
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <stat.icon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: 'primary.main',
                      mb: 0.5,
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: 'text.primary',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Powerful Features for Modern Education
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Everything you need to manage academic workflows, track progress, and enhance learning outcomes.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: '1px solid',
                  borderColor: 'divider',
                  background: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.02)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                    borderColor: `${feature.color}.main`,
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      background: (theme) => `linear-gradient(135deg, ${theme.palette[feature.color].main}15, ${theme.palette[feature.color].main}05)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      mb: 2,
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, rgba(129, 85, 198, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(129, 85, 198, 0.03) 0%, rgba(102, 126, 234, 0.03) 100%)',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Why Choose Trackademy?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Built with cutting-edge technology and designed for the future of education.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    borderRadius: 3,
                    background: (theme) => theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.02)' 
                      : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 16px 32px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #8155c6 0%, #667eea 100%)',
            color: 'white',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Ready to Transform Your Academic Experience?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Join thousands of students and educators who have already revolutionized their academic workflows.
          </Typography>
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              backgroundColor: 'white',
              color: 'primary.main',
              borderRadius: 3,
              fontWeight: 700,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Your Journey Today
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

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
