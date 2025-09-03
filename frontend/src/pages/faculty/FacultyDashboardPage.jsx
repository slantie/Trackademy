// src/pages/faculty/FacultyDashboardPage.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
// import { useGetAssignments } from "../../hooks/useAssignments";

const FacultyDashboardPage = () => {
  const { user } = useAuth();

  // Example of fetching faculty-specific data
  // You would need to update the hook to support filtering by facultyId
  // const { data: assignmentsData, isLoading: assignmentsLoading, isError: assignmentsError } = useGetAssignments({ facultyId: user.id });

  //   const assignmentsData = { data: { assignments: [] } };
  const assignmentsLoading = false;
  const assignmentsError = false;

  if (assignmentsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (assignmentsError) {
    console.error("Assignments data fetch error:", assignmentsError);
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load assignments.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.fullName}!
        </Typography>
        <Grid container spacing={3}>
          {/* My Courses Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  My Courses
                </Typography>
                {/* Replace with a real list of courses taught by the faculty member */}
                <Typography variant="body1">
                  You are not currently assigned to any courses.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Submissions Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Pending Submissions
                </Typography>
                {/* Replace with a real count of pending submissions */}
                <Typography variant="body1">
                  You have no pending submissions to grade.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FacultyDashboardPage;
