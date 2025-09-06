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
  Button,
  Stack,
} from "@mui/material";
import { useDashboardData } from "../../hooks/useDashboardData";
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
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Analytics as AnalyticsIcon,
} from "@mui/icons-material";

const StatCard = ({ title, value, icon, change = null, subtitle = "" }) => {
  const theme = useTheme();

  const isPositiveChange = change && change.startsWith("+");

  return (
    <Card
      sx={{
        height: "100%",
        background:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.02)"
            : "#ffffff",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
          border:
            theme.palette.mode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.12)"
              : "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              width: 48,
              height: 48,
              "& svg": {
                color: theme.palette.text.secondary,
                fontSize: 24,
              },
            }}
          >
            {icon}
          </Avatar>
          {change && (
            <Chip
              icon={isPositiveChange ? <ArrowUpIcon /> : <ArrowDownIcon />}
              label={change}
              size="small"
              sx={{
                bgcolor: isPositiveChange
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(244, 67, 54, 0.1)",
                color: isPositiveChange ? "#4caf50" : "#f44336",
                border: `1px solid ${
                  isPositiveChange
                    ? "rgba(76, 175, 80, 0.2)"
                    : "rgba(244, 67, 54, 0.2)"
                }`,
                fontWeight: 600,
                fontSize: "0.75rem",
                height: 24,
              }}
            />
          )}
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 0.5,
            fontSize: "2rem",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 600,
            mb: subtitle ? 0.5 : 0,
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.875rem",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ title, data, icon }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        background:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.02)"
            : "#ffffff",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              mr: 2,
              width: 40,
              height: 40,
              "& svg": {
                color: theme.palette.text.secondary,
                fontSize: 20,
              },
            }}
          >
            {icon}
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: "1.1rem",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Stack spacing={2}>
          {data.map((item, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: item.color || theme.palette.text.primary,
                    fontSize: "1.1rem",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
              {item.percentage && (
                <LinearProgress
                  variant="determinate"
                  value={parseFloat(item.percentage)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.05)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 3,
                      bgcolor: item.color || theme.palette.primary.main,
                    },
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const PerformanceCard = () => {
  const theme = useTheme();

  const metrics = [
    { label: "Student Engagement", value: 87, color: "#4caf50" },
    { label: "Course Completion", value: 92, color: "#2196f3" },
    { label: "Faculty Satisfaction", value: 78, color: "#ff9800" },
    { label: "System Uptime", value: 99, color: "#9c27b0" },
  ];

  return (
    <Card
      sx={{
        height: "100%",
        background:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.02)"
            : "#ffffff",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            <SpeedIcon
              sx={{ color: theme.palette.text.secondary, fontSize: 20 }}
            />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: "1.1rem",
            }}
          >
            Performance Metrics
          </Typography>
        </Box>

        <Stack spacing={3}>
          {metrics.map((metric, index) => (
            <Box key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
                  {metric.label}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: metric.color,
                    fontSize: "0.95rem",
                  }}
                >
                  {metric.value}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metric.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.05)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    bgcolor: metric.color,
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const QuickActionsCard = () => {
  const theme = useTheme();

  const actions = [
    {
      title: "Add Student",
      icon: GroupsIcon,
      description: "Register new student",
    },
    {
      title: "Create Course",
      icon: SubjectIcon,
      description: "Add new course",
    },
    {
      title: "View Reports",
      icon: AssessmentIcon,
      description: "Analytics dashboard",
    },
    {
      title: "Manage Users",
      icon: BusinessIcon,
      description: "User management",
    },
  ];

  return (
    <Card
      sx={{
        height: "100%",
        background:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.02)"
            : "#ffffff",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.04)",
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            <GraphIcon
              sx={{ color: theme.palette.text.secondary, fontSize: 20 }}
            />
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: "1.1rem",
            }}
          >
            Quick Actions
          </Typography>
        </Box>

        <Stack spacing={1.5}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outlined"
              startIcon={<action.icon />}
              sx={{
                justifyContent: "flex-start",
                textAlign: "left",
                py: 1.5,
                px: 2,
                border:
                  theme.palette.mode === "dark"
                    ? "1px solid rgba(255, 255, 255, 0.08)"
                    : "1px solid rgba(0, 0, 0, 0.08)",
                borderRadius: 2,
                color: theme.palette.text.primary,
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.02)",
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.12)"
                      : "1px solid rgba(0, 0, 0, 0.12)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {action.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.8rem",
                  }}
                >
                  {action.description}
                </Typography>
              </Box>
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const AnalyticsOverview = ({
  // _totalStudents,
  // _totalFaculties,
  passCount,
  failCount,
  avgSpi,
  avgCpi,
}) => {
  const theme = useTheme();
  const totalResults = passCount + failCount;
  const passRate =
    totalResults > 0 ? ((passCount / totalResults) * 100).toFixed(1) : 0;

  return (
    <Card
      sx={{
        background:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.02)"
            : "#ffffff",
        border:
          theme.palette.mode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.08)"
            : "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
              fontSize: "1.75rem",
            }}
          >
            Academic Performance Overview
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Comprehensive analytics of institutional performance and student
            outcomes
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              title: "Students Passed",
              value: passCount.toLocaleString(),
              subtitle: `${passRate}% Success Rate`,
              color: "#4caf50",
              icon: "✓",
            },
            {
              title: "Need Support",
              value: failCount.toLocaleString(),
              subtitle: "Intervention Required",
              color: "#f44336",
              icon: "!",
            },
            {
              title: "Average SPI",
              value: avgSpi,
              subtitle: "Semester Performance",
              color: "#2196f3",
              icon: "📊",
            },
            {
              title: "Average CPI",
              value: avgCpi,
              subtitle: "Cumulative Performance",
              color: "#9c27b0",
              icon: "🎯",
            },
          ].map((metric, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  textAlign: "center",
                  p: 3,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.02)"
                      : "#fafafa",
                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.05)"
                      : "1px solid rgba(0, 0, 0, 0.05)",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.04)"
                        : "#f5f5f5",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography variant="h4" sx={{ mb: 1, fontSize: "1.5rem" }}>
                  {metric.icon}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: metric.color,
                    mb: 1,
                    fontSize: "1.75rem",
                  }}
                >
                  {metric.value}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    color: theme.palette.text.primary,
                    fontSize: "1rem",
                  }}
                >
                  {metric.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  {metric.subtitle}
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
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
              : "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        }}
      >
        <Stack alignItems="center" spacing={3}>
          <CircularProgress
            size={48}
            sx={{
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Loading Dashboard...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (summaryError || analyticsError) {
    return (
      <Container maxWidth="2xl" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            border: "1px solid rgba(244, 67, 54, 0.2)",
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
  const _totalSemesters = summaryData?.data?.semesters || 0;

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
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        minHeight: "100vh",
        py: 4,
        px: 3,
      }}
    >
      <Container maxWidth="2xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 1,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Dashboard
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "1rem",
            }}
          >
            Welcome back! Here's what's happening with your institution today.
          </Typography>
        </Box>

        {/* Main Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Students"
              value={totalStudents.toLocaleString()}
              icon={<GroupsIcon />}
              change="+12%"
              subtitle="Active learners"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Faculty Members"
              value={totalFaculties.toLocaleString()}
              icon={<SchoolIcon />}
              change="+5%"
              subtitle="Teaching staff"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Active Courses"
              value={totalCourses.toLocaleString()}
              icon={<SubjectIcon />}
              change="+8%"
              subtitle="This semester"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Departments"
              value={totalDepartments.toLocaleString()}
              icon={<DepartmentIcon />}
              subtitle="Academic divisions"
            />
          </Grid>
        </Grid>

        {/* Secondary Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid xs={12} sm={6} md={4}>
            <StatCard
              title="Total Subjects"
              value={totalSubjects.toLocaleString()}
              icon={<AssignmentIcon />}
              subtitle="Course offerings"
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <StatCard
              title="Assignments"
              value={totalAssignments.toLocaleString()}
              icon={<GradingIcon />}
              subtitle="Active evaluations"
            />
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <StatCard
              title="Colleges"
              value={totalColleges.toLocaleString()}
              icon={<BusinessIcon />}
              subtitle="Institutional units"
            />
          </Grid>
        </Grid>

        {/* Analytics Overview */}
        <Box sx={{ mb: 4 }}>
          <AnalyticsOverview
            totalStudents={totalStudents}
            totalFaculties={totalFaculties}
            passCount={passCount}
            failCount={failCount}
            avgSpi={avgSpi}
            avgCpi={avgCpi}
          />
        </Box>

        {/* Bottom Section */}
        <Grid container spacing={3}>
          <Grid xs={12} md={4}>
            <MetricCard
              title="Academic Performance"
              icon={<AssessmentIcon />}
              data={[
                {
                  label: "Students Passed",
                  value: passCount.toLocaleString(),
                  color: "#4caf50",
                  percentage: passRate,
                },
                {
                  label: "Need Support",
                  value: failCount.toLocaleString(),
                  color: "#f44336",
                  percentage: failRate,
                },
                {
                  label: "Average SPI",
                  value: avgSpi,
                  color: "#2196f3",
                },
                {
                  label: "Average CPI",
                  value: avgCpi,
                  color: "#9c27b0",
                },
              ]}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <PerformanceCard />
          </Grid>

          <Grid xs={12} md={4}>
            <QuickActionsCard />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
