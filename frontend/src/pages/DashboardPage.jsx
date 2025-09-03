import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
} from "@mui/material";
import { useDashboardData } from "../hooks/useDashboardData";
import {
  Groups as GroupsIcon,
  School as SchoolIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Grading as GradingIcon,
  Business as BusinessIcon,
  AccountBalance as DepartmentIcon,
  MenuBook as SubjectIcon,
  Event as SemesterIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  AutoGraph as GraphIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";

const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
  trend = null,
  subtitle = "",
  size = "normal",
}) => {
  const theme = useTheme();
  
  const getGradientColors = (colorType) => {
    switch (colorType) {
      case "primary":
        return theme.palette.mode === 'dark' 
          ? "linear-gradient(145deg, #1e293b 0%, #334155 50%, #475569 100%)"
          : "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)";
      case "secondary":
        return theme.palette.mode === 'dark'
          ? "linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)"
          : "linear-gradient(145deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)";
      case "success":
        return theme.palette.mode === 'dark'
          ? "linear-gradient(145deg, #14532d 0%, #166534 50%, #15803d 100%)"
          : "linear-gradient(145deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)";
      case "warning":
        return theme.palette.mode === 'dark'
          ? "linear-gradient(145deg, #451a03 0%, #78350f 50%, #92400e 100%)"
          : "linear-gradient(145deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)";
      case "info":
        return theme.palette.mode === 'dark'
          ? "linear-gradient(145deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)"
          : "linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)";
      default:
        return theme.palette.mode === 'dark'
          ? "linear-gradient(145deg, #1e293b 0%, #334155 50%, #475569 100%)"
          : "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)";
    }
  };

  const getAccentColor = (colorType) => {
    switch (colorType) {
      case "primary": return theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af';
      case "secondary": return theme.palette.mode === 'dark' ? '#8b5cf6' : '#7c3aed';
      case "success": return theme.palette.mode === 'dark' ? '#10b981' : '#059669';
      case "warning": return theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706';
      case "info": return theme.palette.mode === 'dark' ? '#06b6d4' : '#0891b2';
      default: return theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af';
    }
  };

  return (
    <Card
      sx={{
        height: size === "large" ? 240 : 200,
        background: getGradientColors(color),
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        boxShadow: theme.palette.mode === 'dark' 
          ? "0 4px 20px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: theme.palette.mode === 'dark' 
            ? "0 20px 40px rgba(0,0,0,0.4)"
            : "0 20px 40px rgba(0,0,0,0.12)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${getAccentColor(color)}, ${getAccentColor(color)}CC)`,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 20,
          right: 20,
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${getAccentColor(color)}20, transparent)`,
        },
      }}
    >
      <CardContent
        sx={{ 
          position: "relative", 
          zIndex: 1, 
          p: size === "large" ? 4 : 3, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between' 
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: size === "large" ? 2 : 1,
          }}
        >
          <Avatar
            sx={{
              bgcolor: `${getAccentColor(color)}15`,
              width: size === "large" ? 64 : 52,
              height: size === "large" ? 64 : 52,
              border: `2px solid ${getAccentColor(color)}30`,
              "& > svg": {
                fontSize: size === "large" ? 32 : 26,
                color: getAccentColor(color),
              },
            }}
          >
            {icon}
          </Avatar>
          {trend && (
            <Chip
              icon={<TrendingUpIcon />}
              label={trend}
              size="small"
              sx={{
                bgcolor: `${getAccentColor(color)}20`,
                color: getAccentColor(color),
                border: `1px solid ${getAccentColor(color)}30`,
                "& .MuiChip-icon": { color: getAccentColor(color) },
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>
        
        <Box>
          <Typography
            variant={size === "large" ? "h2" : "h3"}
            sx={{
              fontWeight: 800,
              mb: 1,
              color: theme.palette.text.primary,
              fontSize: size === "large" ? '2.5rem' : '2rem',
            }}
          >
            {value}
          </Typography>
          <Typography
            variant={size === "large" ? "h5" : "h6"}
            sx={{ 
              color: theme.palette.text.primary, 
              mb: 0.5, 
              fontWeight: 600,
              fontSize: size === "large" ? '1.25rem' : '1.1rem',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant={size === "large" ? "body1" : "body2"}
              sx={{ 
                color: theme.palette.text.secondary,
                fontSize: size === "large" ? '1rem' : '0.875rem',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const AnalyticsCard = ({ title, data, icon, color = "primary" }) => {
  const theme = useTheme();
  
  const getColorByType = (colorType) => {
    switch (colorType) {
      case "primary":
        return theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af';
      case "success":
        return theme.palette.mode === 'dark' ? '#10b981' : '#059669';
      case "secondary":
        return theme.palette.mode === 'dark' ? '#8b5cf6' : '#7c3aed';
      default:
        return theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af';
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[800]} 100%)`
          : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, #f8fafc 100%)`,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        backdropFilter: "blur(20px)",
        boxShadow: theme.palette.mode === 'dark' 
          ? "0 4px 20px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: theme.palette.mode === 'dark' 
            ? "0 20px 40px rgba(0,0,0,0.4)"
            : "0 20px 40px rgba(0,0,0,0.12)",
          border: `1px solid ${getColorByType(color)}30`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${getColorByType(color)}, ${getColorByType(color)}80)`,
        },
      }}
    >
      <CardContent sx={{ p: 3, position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? `${getColorByType(color)}20` : `${getColorByType(color)}10`,
              color: getColorByType(color),
              mr: 2,
              width: 48,
              height: 48,
              border: `2px solid ${getColorByType(color)}30`,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            {title}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {data.map((item, index) => (
            <Grid xs={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  textAlign: "center",
                  p: 2.5,
                  bgcolor: theme.palette.mode === 'dark' 
                    ? `linear-gradient(145deg, ${theme.palette.grey[700]} 0%, ${theme.palette.grey[800]} 100%)`
                    : `linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)`,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[200]}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.palette.mode === 'dark' 
                      ? "0 8px 25px rgba(0,0,0,0.3)"
                      : "0 8px 25px rgba(0,0,0,0.1)",
                    border: `1px solid ${item.color || getColorByType(color)}40`,
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: item.color || getColorByType(color),
                    mb: 1,
                    fontSize: '1.8rem',
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600, mb: item.percentage ? 1 : 0 }}
                >
                  {item.label}
                </Typography>
                {item.percentage && (
                  <Chip
                    label={`${item.percentage}%`}
                    size="small"
                    sx={{
                      bgcolor: `${item.color || getColorByType(color)}15`,
                      color: item.color || getColorByType(color),
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      border: `1px solid ${item.color || getColorByType(color)}30`,
                    }}
                  />
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const QuickStatsCard = ({ title, stats, icon }) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        height: "100%",
        background: theme.palette.mode === 'dark' 
          ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[800]} 100%)`
          : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, #f8fafc 100%)`,
        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        backdropFilter: "blur(20px)",
        boxShadow: theme.palette.mode === 'dark' 
          ? "0 4px 20px rgba(0,0,0,0.3)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: theme.palette.mode === 'dark' 
            ? "0 20px 40px rgba(0,0,0,0.4)"
            : "0 20px 40px rgba(0,0,0,0.12)",
          border: `1px solid ${theme.palette.mode === 'dark' ? '#10b981' : '#059669'}30`,
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, ${theme.palette.mode === 'dark' ? '#10b981' : '#059669'}, ${theme.palette.mode === 'dark' ? '#10b981' : '#059669'}80)`,
        },
      }}
    >
      <CardContent sx={{ p: 3, position: "relative" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.mode === 'dark' ? '#10b98120' : '#05966910',
              color: theme.palette.mode === 'dark' ? '#10b981' : '#059669',
              mr: 2,
              width: 48,
              height: 48,
              border: `2px solid ${theme.palette.mode === 'dark' ? '#10b981' : '#059669'}30`,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
            {title}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {stats.map((stat, index) => (
            <Grid xs={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  textAlign: "center",
                  p: 2.5,
                  bgcolor: theme.palette.mode === 'dark' 
                    ? `linear-gradient(145deg, ${theme.palette.grey[700]} 0%, ${theme.palette.grey[800]} 100%)`
                    : `linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)`,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[200]}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.palette.mode === 'dark' 
                      ? "0 8px 25px rgba(0,0,0,0.3)"
                      : "0 8px 25px rgba(0,0,0,0.1)",
                    border: `1px solid ${theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af'}40`,
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af',
                    mb: 0.5,
                    fontSize: '1.8rem',
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const {
    summaryData,
    summaryIsLoading,
    summaryError,
    analyticsData,
    analyticsIsLoading,
    analyticsError,
  } = useDashboardData();

  if (summaryIsLoading || analyticsIsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1B1B1F 0%, #161618 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: theme.palette.primary.main,
              mb: 2,
            }} 
          />
          <Typography variant="h6" color="text.secondary">
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (summaryError || analyticsError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 2,
            bgcolor: theme.palette.mode === 'dark' ? theme.palette.error.dark : theme.palette.error.light,
            color: theme.palette.mode === 'dark' ? theme.palette.error.contrastText : theme.palette.error.main,
          }}
        >
          Failed to load dashboard data. Please try again later.
        </Alert>
      </Container>
    );
  }

  // Calculate analytics from real data
  const totalStudents = summaryData?.data?.students || 0;
  const totalFaculties = summaryData?.data?.faculties || 0;
  const totalCourses = summaryData?.data?.courses || 0;
  const totalDepartments = summaryData?.data?.departments || 0;
  const totalSubjects = summaryData?.data?.subjects || 0;
  const totalAssignments = summaryData?.data?.assignments || 0;
  const totalColleges = summaryData?.data?.colleges || 0;
  const totalSemesters = summaryData?.data?.semesters || 0;

  const passCount = analyticsData?.data?.statistics?.passCount || 0;
  const failCount = analyticsData?.data?.statistics?.failCount || 0;
  const totalResults = passCount + failCount;
  const passRate =
    totalResults > 0 ? ((passCount / totalResults) * 100).toFixed(1) : 0;
  const failRate =
    totalResults > 0 ? ((failCount / totalResults) * 100).toFixed(1) : 0;

  const avgSpi = analyticsData?.data?.statistics?.averageSpi || 0;
  const avgCpi = analyticsData?.data?.statistics?.averageCpi || 0;

  return (
    <Box 
      sx={{ 
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
          : 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
        minHeight: "100vh", 
        py: 4,
        px: 3,
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: '1600px', mx: 'auto' }}>
        {/* Page Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: theme.palette.text.primary,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              fontWeight: 500,
              maxWidth: 600,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          >
            Welcome back! Here's a comprehensive overview of your institution's performance and metrics.
          </Typography>
        </Box>

        {/* Enhanced Bento Grid Layout */}
        <Grid container spacing={3}>
          {/* Hero Stats - Main Focus */}
          <Grid xs={12} sm={6} md={6}>
            <StatCard
              title="Total Students"
              value={totalStudents.toLocaleString()}
              icon={<GroupsIcon />}
              color="primary"
              trend="+12%"
              subtitle="Active learners growing every semester"
              size="large"
            />
          </Grid>
          <Grid xs={12} sm={6} md={6}>
            <StatCard
              title="Faculty Members"
              value={totalFaculties.toLocaleString()}
              icon={<SchoolIcon />}
              color="secondary"
              trend="+5%"
              subtitle="Dedicated teaching professionals"
              size="large"
            />
          </Grid>

          {/* Secondary Metrics Row */}
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Active Courses"
              value={totalCourses.toLocaleString()}
              icon={<SubjectIcon />}
              color="success"
              trend="+8%"
              subtitle="This academic year"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Departments"
              value={totalDepartments.toLocaleString()}
              icon={<DepartmentIcon />}
              color="warning"
              subtitle="Academic divisions"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Subjects"
              value={totalSubjects.toLocaleString()}
              icon={<AssignmentIcon />}
              color="info"
              subtitle="Course offerings"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Assignments"
              value={totalAssignments.toLocaleString()}
              icon={<GradingIcon />}
              color="success"
              subtitle="Active evaluations"
            />
          </Grid>

          {/* Analytics Dashboard Section */}
          <Grid xs={12} md={4}>
            <AnalyticsCard
              title="Academic Performance"
              icon={<AssessmentIcon />}
              color="success"
              data={[
                {
                  label: "Students Passed",
                  value: passCount.toLocaleString(),
                  color: theme.palette.success.main,
                  percentage: passRate,
                },
                {
                  label: "Need Support",
                  value: failCount.toLocaleString(),
                  color: theme.palette.error.main,
                  percentage: failRate,
                },
                {
                  label: "Average SPI",
                  value: avgSpi,
                  color: theme.palette.primary.main,
                },
                {
                  label: "Average CPI",
                  value: avgCpi,
                  color: theme.palette.secondary.main,
                },
              ]}
            />
          </Grid>

          {/* Institutional Overview */}
          <Grid xs={12} md={4}>
            <QuickStatsCard
              title="Institutional Overview"
              icon={<BusinessIcon />}
              stats={[
                {
                  label: "Colleges",
                  value: totalColleges.toLocaleString(),
                },
                {
                  label: "Semesters",
                  value: totalSemesters.toLocaleString(),
                },
                {
                  label: "Total Faculty",
                  value: totalFaculties.toLocaleString(),
                },
                {
                  label: "All Subjects",
                  value: totalSubjects.toLocaleString(),
                },
              ]}
            />
          </Grid>

          {/* Enhanced Performance Metrics */}
          <Grid xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                background: theme.palette.mode === 'dark' 
                  ? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[800]} 100%)`
                  : `linear-gradient(145deg, ${theme.palette.background.paper} 0%, #f8fafc 100%)`,
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                backdropFilter: "blur(20px)",
                boxShadow: theme.palette.mode === 'dark' 
                  ? "0 4px 20px rgba(0,0,0,0.3)"
                  : "0 4px 20px rgba(0,0,0,0.08)",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: theme.palette.mode === 'dark' 
                    ? "0 20px 40px rgba(0,0,0,0.4)"
                    : "0 20px 40px rgba(0,0,0,0.12)",
                  border: `1px solid ${theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706'}30`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: `linear-gradient(90deg, ${theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706'}, ${theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706'}80)`,
                },
              }}
            >
              <CardContent sx={{ p: 3, position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' ? '#f59e0b20' : '#d9770610',
                      color: theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706',
                      mr: 2,
                      width: 48,
                      height: 48,
                      border: `2px solid ${theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706'}30`,
                    }}
                  >
                    <SpeedIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    Performance Metrics
                  </Typography>
                </Box>

                {[
                  { 
                    label: "Student Pass Rate", 
                    value: passRate, 
                    color: theme.palette.mode === 'dark' ? '#10b981' : '#059669'
                  },
                  { 
                    label: "Faculty Engagement", 
                    value: 78, 
                    color: theme.palette.mode === 'dark' ? '#f59e0b' : '#d97706'
                  },
                  { 
                    label: "Assignment Completion", 
                    value: totalAssignments > 0 ? Math.round(totalAssignments * 0.82) : 82, 
                    color: theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af'
                  },
                  { 
                    label: "System Health", 
                    value: 95, 
                    color: theme.palette.mode === 'dark' ? '#06b6d4' : '#0891b2'
                  },
                ].map((metric, index) => (
                  <Box key={index} sx={{ mb: index === 3 ? 0 : 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                        {metric.label}
                      </Typography>
                      <Chip
                        label={`${metric.value}%`}
                        size="small"
                        sx={{
                          bgcolor: `${metric.color}15`,
                          color: metric.color,
                          fontWeight: 700,
                          minWidth: 50,
                          border: `1px solid ${metric.color}30`,
                        }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={parseFloat(metric.value)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          background: `linear-gradient(90deg, ${metric.color}, ${metric.color}CC)`,
                        },
                      }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Enhanced Academic Performance Showcase - Full Width */}
          <Grid xs={12}>
            <Card
              sx={{
                background: theme.palette.mode === 'dark'
                  ? "linear-gradient(145deg, #1e293b 0%, #334155 50%, #475569 100%)"
                  : "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
                border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                backdropFilter: "blur(20px)",
                boxShadow: theme.palette.mode === 'dark' 
                  ? "0 8px 30px rgba(0,0,0,0.4)"
                  : "0 8px 30px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: theme.palette.mode === 'dark' 
                    ? "0 20px 50px rgba(0,0,0,0.5)"
                    : "0 20px 50px rgba(0,0,0,0.15)",
                },
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, ${theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af'}, ${theme.palette.mode === 'dark' ? '#8b5cf6' : '#7c3aed'})`,
                },
              }}
            >
              <CardContent sx={{ p: 5, position: "relative", zIndex: 1 }}>
                <Box sx={{ textAlign: "center", mb: 5 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      color: theme.palette.text.primary,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                    }}
                  >
                    📊 Academic Performance Analytics
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.secondary,
                      maxWidth: 700,
                      mx: "auto",
                      fontWeight: 500,
                      fontSize: { xs: '1rem', md: '1.25rem' },
                    }}
                  >
                    Comprehensive insights into student performance, faculty engagement, and institutional growth metrics
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  {[
                    {
                      icon: "🎓",
                      title: "Students Passed",
                      value: passCount.toLocaleString(),
                      subtitle: `${passRate}% Success Rate`,
                      description: "Academic achievements",
                      color: theme.palette.mode === 'dark' ? '#10b981' : '#059669'
                    },
                    {
                      icon: "📚",
                      title: "Need Support",
                      value: failCount.toLocaleString(),
                      subtitle: `${failRate}% Require Help`,
                      description: "Intervention opportunities",
                      color: theme.palette.mode === 'dark' ? '#ef4444' : '#dc2626'
                    },
                    {
                      icon: "📈",
                      title: "Average SPI",
                      value: avgSpi,
                      subtitle: "Semester Performance",
                      description: "Current academic standing",
                      color: theme.palette.mode === 'dark' ? '#3b82f6' : '#1e40af'
                    },
                    {
                      icon: "🏆",
                      title: "Average CPI",
                      value: avgCpi,
                      subtitle: "Cumulative Performance",
                      description: "Overall academic progress",
                      color: theme.palette.mode === 'dark' ? '#8b5cf6' : '#7c3aed'
                    },
                  ].map((metric, index) => (
                    <Grid xs={12} sm={6} md={3} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          textAlign: "center",
                          p: 3,
                          bgcolor: theme.palette.mode === 'dark' 
                            ? `linear-gradient(145deg, ${theme.palette.grey[700]} 0%, ${theme.palette.grey[800]} 100%)`
                            : `linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)`,
                          borderRadius: 4,
                          border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[200]}`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: theme.palette.mode === 'dark' 
                              ? "0 12px 30px rgba(0,0,0,0.3)"
                              : "0 12px 30px rgba(0,0,0,0.1)",
                            border: `1px solid ${metric.color}40`,
                          },
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{ mb: 2, fontSize: "2.5rem" }}
                        >
                          {metric.icon}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            mb: 1,
                            color: metric.color,
                            fontSize: '2rem',
                          }}
                        >
                          {metric.value}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 1, color: theme.palette.text.primary }}
                        >
                          {metric.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ color: theme.palette.text.secondary, mb: 1, fontWeight: 600 }}
                        >
                          {metric.subtitle}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {metric.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions Hub */}
          <Grid xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                background: theme.palette.mode === 'dark' 
                  ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[800]} 100%)`
                  : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                border: `2px solid ${theme.palette.primary.main}20`,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                backdropFilter: "blur(20px)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: theme.palette.mode === 'dark' 
                    ? `0 20px 40px ${theme.palette.primary.main}30`
                    : `0 20px 40px ${theme.palette.primary.main}20`,
                  border: `2px solid ${theme.palette.primary.main}40`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      mr: 2,
                      width: 48,
                      height: 48,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <GraphIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    Quick Actions Hub
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {[
                    { 
                      title: "Add Student", 
                      subtitle: "Register new learners", 
                      icon: GroupsIcon, 
                      gradient: theme.palette.mode === 'dark' 
                        ? "linear-gradient(135deg, #8155c6 0%, #667eea 100%)"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    },
                    { 
                      title: "Create Course", 
                      subtitle: "Add new programs", 
                      icon: SubjectIcon, 
                      gradient: theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                        : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    },
                    { 
                      title: "View Reports", 
                      subtitle: "Analytics & insights", 
                      icon: AssessmentIcon, 
                      gradient: theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                        : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    },
                    { 
                      title: "Manage Settings", 
                      subtitle: "System configuration", 
                      icon: BusinessIcon, 
                      gradient: theme.palette.mode === 'dark'
                        ? "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                        : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                    },
                  ].map((action, index) => (
                    <Grid xs={12} sm={6} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2.5,
                          background: action.gradient,
                          color: "white",
                          borderRadius: 3,
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px) scale(1.05)",
                            boxShadow: theme.palette.mode === 'dark' 
                              ? "0 12px 25px rgba(0,0,0,0.4)"
                              : "0 12px 25px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                          <action.icon sx={{ mr: 1.5, fontSize: 24 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {action.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                          {action.subtitle}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Enhanced System Summary */}
          <Grid xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                background: theme.palette.mode === 'dark' 
                  ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[800]} 100%)`
                  : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                border: `2px solid ${theme.palette.info.main}20`,
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                backdropFilter: "blur(20px)",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.02)",
                  boxShadow: theme.palette.mode === 'dark' 
                    ? `0 20px 40px ${theme.palette.info.main}30`
                    : `0 20px 40px ${theme.palette.info.main}20`,
                  border: `2px solid ${theme.palette.info.main}40`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${theme.palette.info.main}15`,
                      color: theme.palette.info.main,
                      mr: 2,
                      width: 48,
                      height: 48,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <VerifiedIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                    System Overview
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  {[
                    {
                      label: "Total Users",
                      value: (totalStudents + totalFaculties).toLocaleString(),
                      color: theme.palette.primary.main,
                      icon: "👥"
                    },
                    {
                      label: "Total Results",
                      value: totalResults.toLocaleString(),
                      color: theme.palette.success.main,
                      icon: "📊"
                    }
                  ].map((stat, index) => (
                    <Grid xs={6} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          textAlign: "center",
                          p: 2.5,
                          bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[200]}`,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: theme.palette.mode === 'dark' 
                              ? "0 8px 25px rgba(0,0,0,0.3)"
                              : "0 8px 25px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        <Typography variant="h2" sx={{ mb: 1 }}>
                          {stat.icon}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            color: stat.color,
                            mb: 0.5,
                            background: `linear-gradient(45deg, ${stat.color}, ${stat.color}CC)`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600 }}
                        >
                          {stat.label}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}

                  <Grid xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        textAlign: "center",
                        p: 3,
                        background: theme.palette.mode === 'dark'
                          ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
                          : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        borderRadius: 3,
                        color: "white",
                        mt: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        🏛️
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          mb: 1,
                          textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                      >
                        {(totalColleges + totalDepartments + totalSemesters).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Academic Entities
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Colleges • Departments • Semesters
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
