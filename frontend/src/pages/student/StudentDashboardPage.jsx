// src/pages/student/StudentDashboardPage.jsx
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

const StudentDashboardPage = () => {
  const { user } = useAuth();

  // Example of fetching student-specific data
  // You would need to update the hook to support filtering by studentId
  // const { data: assignmentsData, isLoading: assignmentsLoading, isError: assignmentsError } = useGetAssignments({ studentId: user.id });

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
          {/* Upcoming Assignments Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Upcoming Assignments
                </Typography>
                {/* Replace with a real list of assignments fetched from the API */}
                <Typography variant="body1">
                  You have no upcoming assignments.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Results Card */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Recent Results
                </Typography>
                {/* Replace with a real list of recent results fetched from the API */}
                <Typography variant="body1">
                  No recent results available.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default StudentDashboardPage;
