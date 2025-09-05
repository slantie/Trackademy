// src/components/widgets/UpcomingAssignmentsWidget.jsx
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
  Button,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useGetFacultyAssignments } from "../../hooks/useAssignments";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const UpcomingAssignmentsWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: assignmentsData,
    isLoading,
    isError,
    error,
  } = useGetFacultyAssignments(user?.id);

  // Extract assignments from nested data structure: assignmentsData.data.assignments.data
  const allAssignments = assignmentsData?.data?.assignments?.data || [];

  // Filter for upcoming assignments (not yet due) and sort by due date
  const upcomingAssignments = allAssignments
    .filter((assignment) => dayjs(assignment.dueDate).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())
    .slice(0, 5); // Show only next 5 assignments

  console.log("UpcomingAssignmentsWidget - Assignments data:", assignmentsData);
  console.log("UpcomingAssignmentsWidget - All assignments:", allAssignments);
  console.log(
    "UpcomingAssignmentsWidget - Upcoming assignments:",
    upcomingAssignments
  );

  const formatDueDate = (dueDate) => {
    const due = dayjs(dueDate);
    const now = dayjs();
    const diffDays = due.diff(now, "day");

    if (diffDays === 0) {
      return `Due today at ${due.format("h:mm A")}`;
    } else if (diffDays === 1) {
      return `Due tomorrow at ${due.format("h:mm A")}`;
    } else if (diffDays < 7) {
      return `Due in ${diffDays} days (${due.format("MMM D")})`;
    } else {
      return `Due ${due.format("MMM D, YYYY")}`;
    }
  };

  const getDueDateColor = (dueDate) => {
    const diffDays = dayjs(dueDate).diff(dayjs(), "day");
    if (diffDays <= 1) return "error";
    if (diffDays <= 3) return "warning";
    return "default";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader
          title="Upcoming Assignments"
          titleTypographyProps={{ variant: "h6" }}
          avatar={<AssignmentIcon />}
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
          title="Upcoming Assignments"
          titleTypographyProps={{ variant: "h6" }}
          avatar={<AssignmentIcon />}
        />
        <CardContent>
          <Alert severity="error">
            Failed to load assignments: {error?.message || "Unknown error"}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Upcoming Assignments"
        titleTypographyProps={{ variant: "h6" }}
        avatar={<AssignmentIcon />}
        subheader={`${upcomingAssignments.length} upcoming assignment${
          upcomingAssignments.length !== 1 ? "s" : ""
        }`}
        action={
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate("/faculty/assignments")}
            variant="outlined"
          >
            Create
          </Button>
        }
      />
      <CardContent>
        {upcomingAssignments.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={2}
          >
            {allAssignments.length === 0
              ? "You have not created any assignments yet."
              : "No upcoming assignments. All assignments are past due."}
          </Typography>
        ) : (
          <List dense>
            {upcomingAssignments.map((assignment) => (
              <ListItem
                key={assignment.id}
                divider
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/faculty/assignments/${assignment.id}`)
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2">
                        {assignment.title}
                      </Typography>
                      <Chip
                        label={`${assignment.totalMarks} pts`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </Box>
                  }
                  secondary={
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Chip
                        label={formatDueDate(assignment.dueDate)}
                        size="small"
                        color={getDueDateColor(assignment.dueDate)}
                        variant="filled"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {assignment.course?.subject?.name} -{" "}
                        {assignment.course?.division?.name}
                        {assignment._count?.submissions && (
                          <>
                            {" "}
                            • {assignment._count.submissions} submission
                            {assignment._count.submissions !== 1 ? "s" : ""}
                          </>
                        )}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        {allAssignments.length > upcomingAssignments.length && (
          <Box textAlign="center" mt={2}>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate("/faculty/assignments")}
            >
              View All Assignments ({allAssignments.length})
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignmentsWidget;
