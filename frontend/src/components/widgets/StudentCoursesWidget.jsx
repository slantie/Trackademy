// src/components/widgets/StudentCoursesWidget.jsx
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
  Chip,
} from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { useGetStudentCourses } from "../../hooks/useCourses";

const StudentCoursesWidget = () => {
  const {
    data: coursesData,
    isLoading,
    isError,
    error,
  } = useGetStudentCourses();

  // Extract courses from nested data structure
  const courses =
    coursesData?.data?.courses?.data ||
    coursesData?.data?.courses ||
    coursesData?.data ||
    [];

  console.log("StudentCoursesWidget - Courses data:", coursesData);
  console.log("StudentCoursesWidget - Courses array:", courses);

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            My Courses
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
            My Courses
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load courses:{" "}
            {error?.message || "Please try again later."}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="h2">
            My Courses
          </Typography>
          <Chip
            label={courses.length}
            size="small"
            color="primary"
            sx={{ ml: "auto" }}
          />
        </Box>

        {courses.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You are not currently enrolled in any courses.
          </Typography>
        ) : (
          <List dense>
            {courses.map((course) => (
              <ListItem key={course.id} divider>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="medium">
                      {course.subject?.name || "Unknown Subject"}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Code: {course.subject?.code || "N/A"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Faculty: {course.faculty?.fullName || "Not Assigned"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Division: {course.division?.name || "N/A"} • Type:{" "}
                        {course.lectureType || "N/A"}
                        {course.batch && ` • Batch: ${course.batch}`}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCoursesWidget;
