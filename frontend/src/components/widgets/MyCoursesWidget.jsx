// src/components/widgets/MyCoursesWidget.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { useGetFacultyCourses } from "../../hooks/useCourses";
import { useAuth } from "../../hooks/useAuth";

const MyCoursesWidget = () => {
  const { user } = useAuth();

  const {
    data: coursesData,
    isLoading,
    isError,
    error,
  } = useGetFacultyCourses(user?.id);

  // Extract courses from nested data structure: coursesData.data.courses.data
  const courses = coursesData?.data?.courses?.data || [];

  console.log("MyCoursesWidget - Courses data:", coursesData);
  console.log("MyCoursesWidget - Courses array:", courses);

  if (isLoading) {
    return (
      <Card>
        <CardHeader
          title="My Courses"
          titleTypographyProps={{ variant: "h6" }}
          avatar={<SchoolIcon />}
        />
        <CardContent>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader
          title="My Courses"
          titleTypographyProps={{ variant: "h6" }}
          avatar={<SchoolIcon />}
        />
        <CardContent>
          <Alert severity="error">
            Failed to load courses: {error?.message || "Unknown error"}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="My Courses"
        titleTypographyProps={{ variant: "h6" }}
        avatar={<SchoolIcon />}
        subheader={`${courses.length} course${
          courses.length !== 1 ? "s" : ""
        } assigned`}
      />
      <CardContent>
        {courses.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={2}
          >
            You are not currently assigned to any courses.
          </Typography>
        ) : (
          <List dense>
            {courses.map((course) => (
              <ListItem key={course.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">
                        {course.subject?.name || "Unknown Subject"}
                      </Typography>
                      <Chip
                        label={course.subject?.code || "N/A"}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  }
                  secondary={
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        Division: {course.division?.name || "N/A"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {course.lectureType} • Semester{" "}
                        {course.semester?.semesterNumber || "N/A"}
                        {course.batch && ` • Batch ${course.batch}`}
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

export default MyCoursesWidget;
