// src/components/widgets/StudentAttendanceWidget.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Box,
  LinearProgress,
  Chip,
} from "@mui/material";
import { EventNote as AttendanceIcon } from "@mui/icons-material";
import { useGetStudentAttendanceSummary } from "../../hooks/useAttendance";
import { useAuth } from "../../hooks/useAuth";

const StudentAttendanceWidget = () => {
  const { user } = useAuth();

  // Get semesterId from user details
  const semesterId = user?.details?.semesterId || user?.semesterId;

  const {
    data: attendanceData,
    isLoading,
    isError,
    error,
  } = useGetStudentAttendanceSummary(semesterId);

  // Extract attendance summary from nested data structure
  const attendanceSummary =
    attendanceData?.data?.summary || attendanceData?.data || [];

  console.log("StudentAttendanceWidget - User:", user);
  console.log("StudentAttendanceWidget - SemesterId:", semesterId);
  console.log("StudentAttendanceWidget - Attendance data:", attendanceData);
  console.log("StudentAttendanceWidget - Summary array:", attendanceSummary);

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Attendance Summary
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Attendance Summary
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load attendance data:{" "}
            {error?.message || "Please try again later."}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!semesterId) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Attendance Summary
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Semester information not available. Please contact your
            administrator.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "success";
    if (percentage >= 60) return "warning";
    return "error";
  };

  const calculateOverallAttendance = () => {
    if (attendanceSummary.length === 0) return 0;

    const totalClasses = attendanceSummary.reduce(
      (sum, course) => sum + (course.totalClasses || 0),
      0
    );
    const totalAttended = attendanceSummary.reduce(
      (sum, course) => sum + (course.attendedClasses || 0),
      0
    );

    return totalClasses > 0
      ? Math.round((totalAttended / totalClasses) * 100)
      : 0;
  };

  const overallAttendance = calculateOverallAttendance();

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AttendanceIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="h2">
            Attendance Summary
          </Typography>
          <Chip
            label={`Overall: ${overallAttendance}%`}
            color={getAttendanceColor(overallAttendance)}
            size="small"
            sx={{ ml: "auto" }}
          />
        </Box>

        {attendanceSummary.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No attendance data available for this semester.
          </Typography>
        ) : (
          <>
            {/* Overall Progress Bar */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Overall Attendance
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {overallAttendance}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={overallAttendance}
                color={getAttendanceColor(overallAttendance)}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            {/* Course-wise Attendance */}
            <List dense>
              {attendanceSummary.map((courseAttendance) => {
                const percentage = courseAttendance.attendancePercentage || 0;
                const attendanceColor = getAttendanceColor(percentage);

                return (
                  <ListItem
                    key={courseAttendance.course?.id || Math.random()}
                    divider
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="medium">
                            {courseAttendance.course?.subject?.name ||
                              "Unknown Course"}
                          </Typography>
                          <Chip
                            label={`${Math.round(percentage)}%`}
                            color={attendanceColor}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Code:{" "}
                            {courseAttendance.course?.subject?.code || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Classes: {courseAttendance.attendedClasses || 0} /{" "}
                            {courseAttendance.totalClasses || 0}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              color={attendanceColor}
                              sx={{ height: 4, borderRadius: 2 }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceWidget;
