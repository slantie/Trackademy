// src/pages/student/StudentAssignmentsPage.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  AccessTime as TimeIcon,
  Upload as UploadIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useGetStudentAssignments } from "../../hooks/useAssignments";
import { useCreateSubmissionWithFile } from "../../hooks/useSubmissions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const StudentAssignmentsPage = () => {
  const [submissionDialog, setSubmissionDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    type: "text", // "text" or "file"
    content: "",
    file: null,
  });

  const {
    data: assignmentsData,
    isLoading,
    isError,
    error,
  } = useGetStudentAssignments();

  const createSubmissionMutation = useCreateSubmissionWithFile();

  const assignments = assignmentsData?.data?.assignments?.data || [];

  // Categorize assignments
  const upcomingAssignments = assignments.filter((assignment) => {
    const dueDate = dayjs(assignment.dueDate);
    return dueDate.isAfter(dayjs()) && !assignment.submissions?.[0];
  });

  const submittedAssignments = assignments.filter((assignment) => {
    return assignment.submissions?.[0];
  });

  const overdueAssignments = assignments.filter((assignment) => {
    const dueDate = dayjs(assignment.dueDate);
    return dueDate.isBefore(dayjs()) && !assignment.submissions?.[0];
  });

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionDialog(true);
  };

  const handleCloseSubmissionDialog = () => {
    setSubmissionDialog(false);
    setSelectedAssignment(null);
    setSubmissionData({
      type: "text",
      content: "",
      file: null,
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSubmissionData((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleSubmitSubmission = async () => {
    try {
      const submissionPayload = {
        assignmentId: selectedAssignment.id,
      };

      if (submissionData.type === "text") {
        submissionPayload.content = submissionData.content;
      } else if (submissionData.type === "file" && submissionData.file) {
        submissionPayload.file = submissionData.file;
      }

      await createSubmissionMutation.mutateAsync(submissionPayload);

      // Show success message or handle success
      handleCloseSubmissionDialog();
    } catch (error) {
      console.error("Submission failed:", error);
      // Handle error - could show a snackbar or error message
    }
  };

  const getSubmissionStatus = (assignment) => {
    const submission = assignment.submissions?.[0];
    if (!submission) return null;

    switch (submission.status) {
      case "SUBMITTED":
        return {
          color: "primary",
          label: "Submitted",
          icon: <CheckIcon fontSize="small" />,
        };
      case "GRADED":
        return {
          color: "success",
          label: `Graded (${submission.marksAwarded || "N/A"}/${
            assignment.totalMarks
          })`,
          icon: <CheckIcon fontSize="small" />,
        };
      case "PENDING_REVIEW":
        return {
          color: "warning",
          label: "Under Review",
          icon: <WarningIcon fontSize="small" />,
        };
      default:
        return {
          color: "default",
          label: submission.status,
          icon: <CheckIcon fontSize="small" />,
        };
    }
  };

  const getDueDateColor = (dueDate) => {
    const due = dayjs(dueDate);
    const now = dayjs();
    const hoursUntilDue = due.diff(now, "hours");

    if (hoursUntilDue <= 0) return "error";
    if (hoursUntilDue <= 24) return "error";
    if (hoursUntilDue <= 72) return "warning";
    return "success";
  };

  const AssignmentCard = ({
    assignment,
    showSubmitButton = false,
    status = null,
  }) => {
    const submissionStatus = getSubmissionStatus(assignment);
    const dueDateColor = getDueDateColor(assignment.dueDate);

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h3" fontWeight="bold">
              {assignment.title}
            </Typography>
            {submissionStatus && (
              <Chip
                icon={submissionStatus.icon}
                label={submissionStatus.label}
                color={submissionStatus.color}
                variant="outlined"
              />
            )}
            {status && <Chip label={status} color="error" variant="outlined" />}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Course:</strong>{" "}
            {assignment.course?.subject?.name || "Unknown Course"}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Faculty:</strong>{" "}
            {assignment.course?.faculty?.fullName || "Unknown Faculty"}
          </Typography>

          {assignment.description && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              {assignment.description}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 16, color: `${dueDateColor}.main` }} />
              <Typography
                variant="body2"
                color={`${dueDateColor}.main`}
                fontWeight="medium"
              >
                Due: {dayjs(assignment.dueDate).format("MMM D, YYYY h:mm A")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({dayjs(assignment.dueDate).fromNow()})
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              <strong>Total Marks:</strong> {assignment.totalMarks}
            </Typography>
          </Box>

          {showSubmitButton && (
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => handleSubmitAssignment(assignment)}
              disabled={dayjs(assignment.dueDate).isBefore(dayjs())}
            >
              Submit Assignment
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Failed to load assignments:{" "}
          {error?.message || "Please try again later."}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <AssignmentIcon sx={{ mr: 2, fontSize: 32, color: "primary.main" }} />
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Assignments
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Upcoming Assignments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Upcoming Assignments
                <Chip
                  label={upcomingAssignments.length}
                  size="small"
                  color="primary"
                  sx={{ ml: 1 }}
                />
              </Typography>
              {upcomingAssignments.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  No upcoming assignments at this time.
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {upcomingAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      showSubmitButton={true}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Submitted Assignments */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Submitted Assignments
                <Chip
                  label={submittedAssignments.length}
                  size="small"
                  color="success"
                  sx={{ ml: 1 }}
                />
              </Typography>
              {submittedAssignments.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  No submitted assignments yet.
                </Typography>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {submittedAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Overdue Assignments */}
        {overdueAssignments.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  color="error"
                >
                  Overdue Assignments
                  <Chip
                    label={overdueAssignments.length}
                    size="small"
                    color="error"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {overdueAssignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      status="Overdue"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Submission Dialog */}
      <Dialog
        open={submissionDialog}
        onClose={handleCloseSubmissionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Submit Assignment: {selectedAssignment?.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Submission Type</InputLabel>
              <Select
                value={submissionData.type}
                label="Submission Type"
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
              >
                <MenuItem value="text">Text Submission</MenuItem>
                <MenuItem value="file">File Upload</MenuItem>
              </Select>
            </FormControl>

            {submissionData.type === "text" ? (
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Assignment Content"
                value={submissionData.content}
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Enter your assignment content here..."
              />
            ) : (
              <Box>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ marginBottom: 16 }}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                {submissionData.file && (
                  <Typography variant="body2" color="text.secondary">
                    Selected: {submissionData.file.name}
                  </Typography>
                )}
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Due Date:</strong>{" "}
              {dayjs(selectedAssignment?.dueDate).format("MMM D, YYYY h:mm A")}
              <br />
              <strong>Total Marks:</strong> {selectedAssignment?.totalMarks}
            </Alert>

            {createSubmissionMutation.isError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {createSubmissionMutation.error?.message ||
                  "Failed to submit assignment. Please try again."}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmissionDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitSubmission}
            variant="contained"
            disabled={
              createSubmissionMutation.isLoading ||
              (submissionData.type === "text"
                ? !submissionData.content.trim()
                : !submissionData.file)
            }
          >
            {createSubmissionMutation.isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : (
              "Submit Assignment"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentAssignmentsPage;
