// src/components/widgets/StudentAssignmentsWidget.jsx
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
  Divider,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { useGetStudentAssignments } from "../../hooks/useAssignments";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const StudentAssignmentsWidget = () => {
  const {
    data: assignmentsData,
    isLoading,
    isError,
    error,
  } = useGetStudentAssignments();

  // Extract assignments from nested data structure
  const assignments =
    assignmentsData?.data?.assignments?.data ||
    assignmentsData?.data?.assignments ||
    assignmentsData?.data ||
    [];

  console.log("StudentAssignmentsWidget - Assignments data:", assignmentsData);
  console.log("StudentAssignmentsWidget - Assignments array:", assignments);

  // Filter for upcoming assignments (not past due)
  const upcomingAssignments = assignments
    .filter((assignment) => {
      const dueDate = dayjs(assignment.dueDate);
      return dueDate.isAfter(dayjs());
    })
    .sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)));

  if (isLoading) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            Upcoming Assignments
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
            Upcoming Assignments
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load assignments:{" "}
            {error?.message || "Please try again later."}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getSubmissionStatus = (assignment) => {
    if (assignment.submission) {
      const status = assignment.submission.status;
      switch (status) {
        case "SUBMITTED":
          return { color: "success", label: "Submitted" };
        case "GRADED":
          return {
            color: "info",
            label: `Graded (${assignment.submission.grade || "N/A"})`,
          };
        case "LATE":
          return { color: "warning", label: "Late Submission" };
        default:
          return { color: "default", label: status };
      }
    }
    return null;
  };

  const getDueDateColor = (dueDate) => {
    const due = dayjs(dueDate);
    const now = dayjs();
    const hoursUntilDue = due.diff(now, "hours");

    if (hoursUntilDue <= 24) return "error";
    if (hoursUntilDue <= 72) return "warning";
    return "success";
  };

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" component="h2">
            Upcoming Assignments
          </Typography>
          <Chip
            label={upcomingAssignments.length}
            size="small"
            color="primary"
            sx={{ ml: "auto" }}
          />
        </Box>

        {upcomingAssignments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No upcoming assignments at this time.
          </Typography>
        ) : (
          <List dense>
            {upcomingAssignments.map((assignment, index) => {
              const submissionStatus = getSubmissionStatus(assignment);
              const dueDateColor = getDueDateColor(assignment.dueDate);

              return (
                <React.Fragment key={assignment.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="subtitle1" fontWeight="medium">
                            {assignment.title}
                          </Typography>
                          {submissionStatus && (
                            <Chip
                              label={submissionStatus.label}
                              color={submissionStatus.color}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Course:{" "}
                            {assignment.course?.subject?.name ||
                              "Unknown Course"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mt: 0.5,
                            }}
                          >
                            <TimeIcon
                              sx={{
                                fontSize: 16,
                                color: `${dueDateColor}.main`,
                              }}
                            />
                            <Typography
                              variant="body2"
                              color={`${dueDateColor}.main`}
                              fontWeight="medium"
                            >
                              Due:{" "}
                              {dayjs(assignment.dueDate).format(
                                "MMM D, YYYY h:mm A"
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ({dayjs(assignment.dueDate).fromNow()})
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            Total Marks: {assignment.totalMarks || "N/A"}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < upcomingAssignments.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAssignmentsWidget;
