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
} from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
  trend = null,
  subtitle = "",
  size = "normal",
}) => (
  <Card
    sx={{
      height: size === "large" ? 200 : 160,
      background: `linear-gradient(135deg, ${
        color === "primary"
          ? "#667eea 0%, #764ba2 100%"
          : color === "secondary"
          ? "#f093fb 0%, #f5576c 100%"
          : color === "success"
          ? "#4facfe 0%, #00f2fe 100%"
          : color === "warning"
          ? "#43e97b 0%, #38f9d7 100%"
          : color === "info"
          ? "#fa709a 0%, #fee140 100%"
          : "#667eea 0%, #764ba2 100%"
      })`,
      color: "white",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-12px)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        width: size === "large" ? "150px" : "100px",
        height: size === "large" ? "150px" : "100px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
        transform: "translate(30px, -30px)",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.05)",
        transform: "translate(-20px, 20px)",
      },
    }}
  >
    <CardContent
      sx={{ position: "relative", zIndex: 1, p: size === "large" ? 4 : 3 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: size === "large" ? 3 : 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "rgba(255,255,255,0.2)",
            width: size === "large" ? 80 : 60,
            height: size === "large" ? 80 : 60,
            "& > svg": {
              fontSize: size === "large" ? 40 : 30,
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
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              "& .MuiChip-icon": { color: "white" },
              fontWeight: 600,
            }}
          />
        )}
      </Box>
      <Typography
        variant={size === "large" ? "h2" : "h3"}
        sx={{
          fontWeight: 800,
          mb: 1,
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {value}
      </Typography>
      <Typography
        variant={size === "large" ? "h5" : "h6"}
        sx={{ opacity: 0.95, mb: 0.5, fontWeight: 600 }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant={size === "large" ? "body1" : "body2"}
          sx={{ opacity: 0.8 }}
        >
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const AnalyticsCard = ({ title, data, icon, color = "primary" }) => (
  <Card
    sx={{
      height: "100%",
      border: `2px solid ${
        color === "primary"
          ? "#667eea"
          : color === "success"
          ? "#4facfe"
          : "#f093fb"
      }20`,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
      },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: `${
              color === "primary"
                ? "#667eea"
                : color === "success"
                ? "#4facfe"
                : "#f093fb"
            }20`,
            color:
              color === "primary"
                ? "#667eea"
                : color === "success"
                ? "#4facfe"
                : "#f093fb",
            mr: 1.5,
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>

      <Grid container spacing={1.5}>
        {data.map((item, index) => (
          <Grid xs={6} key={index}>
            <Box
              sx={{
                textAlign: "center",
                p: 1.5,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: item.color || "primary.main",
                  mb: 0.5,
                }}
              >
                {item.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {item.label}
              </Typography>
              {item.percentage && (
                <Typography
                  variant="caption"
                  sx={{
                    color: item.color || "primary.main",
                    fontWeight: 600,
                    mt: 0.5,
                    display: "block",
                  }}
                >
                  {item.percentage}%
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

const QuickStatsCard = ({ title, stats, icon }) => (
  <Card
    sx={{
      height: "100%",
      border: "2px solid #43e97b20",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
      },
    }}
  >
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar
          sx={{
            bgcolor: "#43e97b20",
            color: "#43e97b",
            mr: 1.5,
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </Box>
      <Grid container spacing={1.5}>
        {stats.map((stat, index) => (
          <Grid xs={6} key={index}>
            <Box
              sx={{
                textAlign: "center",
                p: 1.5,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  mb: 0.5,
                }}
              >
                {stat.value}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {stat.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

const ActivityCard = ({ title, activities = [] }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {title}
      </Typography>
      <Box sx={{ maxHeight: 300, overflow: "auto" }}>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <Box key={index}>
              <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
                <Avatar
                  sx={{ width: 32, height: 32, mr: 2, bgcolor: "primary.main" }}
                >
                  {activity.type === "assignment"
                    ? "A"
                    : activity.type === "submission"
                    ? "S"
                    : activity.type === "grade"
                    ? "G"
                    : "N"}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {activity.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              </Box>
              {index < activities.length - 1 && <Divider />}
            </Box>
          ))
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            No recent activities
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
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
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (summaryError || analyticsError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
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
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 2 }}>
      <Container maxWidth="xl" sx={{ px: 2 }}>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your institution.
          </Typography>
        </Box>

        {/* Bento Grid Layout */}
        <Grid container spacing={2}>
          {/* Main Stats - Top Row - Bigger Cards */}
          <Grid xs={12} sm={6} md={6}>
            <StatCard
              title="Total Students"
              value={totalStudents.toLocaleString()}
              icon={<GroupsIcon />}
              color="primary"
              trend="+12%"
              subtitle="Active learners in the system"
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

          {/* Secondary Stats Row */}
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Active Courses"
              value={totalCourses.toLocaleString()}
              icon={<SubjectIcon />}
              color="success"
              trend="+8%"
              subtitle="This semester"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Departments"
              value={totalDepartments.toLocaleString()}
              icon={<DepartmentIcon />}
              color="warning"
              subtitle="Academic units"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Total Subjects"
              value={totalSubjects.toLocaleString()}
              icon={<AssignmentIcon />}
              color="info"
              subtitle="Course subjects"
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard
              title="Assignments"
              value={totalAssignments.toLocaleString()}
              icon={<GradingIcon />}
              color="success"
              subtitle="Active assignments"
            />
          </Grid>

          {/* Analytics Section */}
          <Grid xs={12} md={4}>
            <AnalyticsCard
              title="Academic Results"
              icon={<AssessmentIcon />}
              color="success"
              data={[
                {
                  label: "Students Passed",
                  value: passCount.toLocaleString(),
                  color: "success.main",
                  percentage: passRate,
                },
                {
                  label: "Need Support",
                  value: failCount.toLocaleString(),
                  color: "error.main",
                  percentage: failRate,
                },
                {
                  label: "Average SPI",
                  value: avgSpi,
                  color: "primary.main",
                },
                {
                  label: "Average CPI",
                  value: avgCpi,
                  color: "primary.main",
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

          {/* Performance Metrics */}
          <Grid xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                border: "2px solid #f093fb20",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#f093fb20",
                      color: "#f093fb",
                      mr: 1.5,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Performance Metrics
                  </Typography>
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Student Pass Rate
                    </Typography>
                    <Typography
                      variant="body1"
                      color="success.main"
                      sx={{ fontWeight: 700 }}
                    >
                      {passRate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(passRate)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        background:
                          "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Faculty Engagement
                    </Typography>
                    <Typography
                      variant="body1"
                      color="warning.main"
                      sx={{ fontWeight: 700 }}
                    >
                      78%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={78}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        background:
                          "linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Assignment Completion
                    </Typography>
                    <Typography
                      variant="body1"
                      color="primary.main"
                      sx={{ fontWeight: 700 }}
                    >
                      {totalAssignments > 0
                        ? Math.round(totalAssignments * 0.82)
                        : 82}
                      %
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={
                      totalAssignments > 0
                        ? Math.round(totalAssignments * 0.82)
                        : 82
                    }
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        background:
                          "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      System Health
                    </Typography>
                    <Typography
                      variant="body1"
                      color="success.main"
                      sx={{ fontWeight: 700 }}
                    >
                      95%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: "grey.200",
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        background:
                          "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Results Analytics - Full Width */}
          <Grid xs={12}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    Academic Performance Analytics
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      opacity: 0.9,
                      maxWidth: 600,
                      mx: "auto",
                    }}
                  >
                    Comprehensive overview of student performance and
                    institutional metrics
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid xs={12} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "rgba(255,255,255,0.2)",
                          mx: "auto",
                          mb: 1.5,
                          fontSize: "2rem",
                          fontWeight: 800,
                        }}
                      >
                        {passCount.toLocaleString()}
                      </Avatar>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        Students Passed
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {passRate}% Success Rate
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={12} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "rgba(255,255,255,0.2)",
                          mx: "auto",
                          mb: 1.5,
                          fontSize: "2rem",
                          fontWeight: 800,
                        }}
                      >
                        {failCount.toLocaleString()}
                      </Avatar>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        Need Support
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {failRate}% Require Help
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={12} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "rgba(255,255,255,0.2)",
                          mx: "auto",
                          mb: 1.5,
                          fontSize: "2rem",
                          fontWeight: 800,
                        }}
                      >
                        {avgSpi}
                      </Avatar>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        Average SPI
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Semester Performance
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={12} md={3}>
                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: "rgba(255,255,255,0.2)",
                          mx: "auto",
                          mb: 1.5,
                          fontSize: "2rem",
                          fontWeight: 800,
                        }}
                      >
                        {avgCpi}
                      </Avatar>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 0.5 }}
                      >
                        Average CPI
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Cumulative Performance
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Enhanced Quick Actions */}
          <Grid xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                border: "2px solid #667eea20",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#667eea20",
                      color: "#667eea",
                      mr: 1.5,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <TrendingUpIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Quick Actions
                  </Typography>
                </Box>

                <Grid container spacing={1.5}>
                  <Grid xs={12} sm={6}>
                    <Card
                      sx={{
                        p: 2,
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <GroupsIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Add Student
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Register new students
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Card
                      sx={{
                        p: 2,
                        background:
                          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(240, 147, 251, 0.4)",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <SubjectIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Create Course
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Add new courses
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Card
                      sx={{
                        p: 2,
                        background:
                          "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(79, 172, 254, 0.4)",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <AssessmentIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          View Reports
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Analytics & insights
                      </Typography>
                    </Card>
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <Card
                      sx={{
                        p: 2,
                        background:
                          "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(67, 233, 123, 0.4)",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <BusinessIcon sx={{ mr: 1, fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Settings
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        System configuration
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* System Summary */}
          <Grid xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                border: "2px solid #43e97b20",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#43e97b20",
                      color: "#43e97b",
                      mr: 1.5,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <AssessmentIcon />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    System Summary
                  </Typography>
                </Box>

                <Grid container spacing={1.5}>
                  <Grid xs={6}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: "primary.main",
                          mb: 0.5,
                        }}
                      >
                        {(totalStudents + totalFaculties).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Total Users
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={6}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          color: "success.main",
                          mb: 0.5,
                        }}
                      >
                        {totalResults.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Total Results
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid xs={12}>
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 2.5,
                        bgcolor: "primary.main",
                        borderRadius: 2,
                        color: "white",
                        mt: 1,
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          mb: 0.5,
                        }}
                      >
                        {(
                          totalColleges +
                          totalDepartments +
                          totalSemesters
                        ).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        Academic Entities
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Colleges, Departments & Semesters
                      </Typography>
                    </Box>
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
