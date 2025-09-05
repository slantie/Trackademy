// src/pages/student/StudentDashboardPage.jsx
import React from "react";
import { Box, Container, Typography, Grid, Alert } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import StudentCoursesWidget from "../../components/widgets/StudentCoursesWidget";
import StudentAssignmentsWidget from "../../components/widgets/StudentAssignmentsWidget";
import StudentAttendanceWidget from "../../components/widgets/StudentAttendanceWidget";

const StudentDashboardPage = () => {
  const { user } = useAuth();

  console.log("StudentDashboardPage - User:", user);

  if (!user) {
    return (
      <Container maxWidth="2xl" sx={{ py: 4 }}>
        <Alert severity="error">User authentication required.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="2xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.fullName}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Here's an overview of your academic progress and upcoming tasks.
        </Typography>

        <Grid container spacing={3}>
          {/* Student Courses Widget */}
          <Grid item xs={12} lg={4}>
            <StudentCoursesWidget />
          </Grid>

          {/* Student Assignments Widget */}
          <Grid item xs={12} lg={4}>
            <StudentAssignmentsWidget />
          </Grid>

          {/* Student Attendance Widget */}
          <Grid item xs={12} lg={4}>
            <StudentAttendanceWidget />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentDashboardPage;
