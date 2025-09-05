// src/pages/faculty/FacultyAssignmentDetailsPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Link,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Grade as GradeIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useGetAssignment } from "../../hooks/useAssignments";
import {
  useGetSubmissionsByAssignment,
  useGradeSubmission,
} from "../../hooks/useSubmissions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const FacultyAssignmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gradeDialog, setGradeDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({
    marksAwarded: "",
    feedback: "",
  });
  const [activeTab, setActiveTab] = useState(0);

  // Fetch assignment details
  const {
    data: assignmentData,
    isLoading: assignmentLoading,
    isError: assignmentError,
  } = useGetAssignment(id);

  // Fetch submissions for this assignment
  const {
    data: submissionsData,
    isLoading: submissionsLoading,
    isError: submissionsError,
  } = useGetSubmissionsByAssignment(id);

  const gradeSubmissionMutation = useGradeSubmission();

  const assignment = assignmentData?.data?.assignment;
  const submissions = submissionsData?.data?.submissions?.data || [];

  // Categorize submissions
  const submittedSubmissions = submissions.filter(
    (sub) => sub.status === "SUBMITTED"
  );
  const gradedSubmissions = submissions.filter(
    (sub) => sub.status === "GRADED"
  );

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setGradeData({
      marksAwarded: submission.marksAwarded || "",
      feedback: submission.feedback || "",
    });
    setGradeDialog(true);
  };

  const handleCloseGradeDialog = () => {
    setGradeDialog(false);
    setSelectedSubmission(null);
    setGradeData({
      marksAwarded: "",
      feedback: "",
    });
  };

  const handleSubmitGrade = async () => {
    try {
      await gradeSubmissionMutation.mutateAsync({
        submissionId: selectedSubmission.id,
        submissionData: {
          marksAwarded: parseInt(gradeData.marksAwarded),
          feedback: gradeData.feedback,
          status: "GRADED",
        },
      });
      handleCloseGradeDialog();
    } catch (error) {
      console.error("Failed to grade submission:", error);
    }
  };

  const handleViewSubmission = (submission) => {
    if (submission.filePath) {
      window.open(submission.filePath, "_blank");
    }
  };

  const getSubmissionStatusIcon = (status) => {
    switch (status) {
      case "SUBMITTED":
        return <PendingIcon color="warning" />;
      case "GRADED":
        return <CheckIcon color="success" />;
      case "PENDING_REVIEW":
        return <PendingIcon color="info" />;
      default:
        return <ErrorIcon color="error" />;
    }
  };

  const getSubmissionStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "warning";
      case "GRADED":
        return "success";
      case "PENDING_REVIEW":
        return "info";
      default:
        return "error";
    }
  };

  const SubmissionTable = ({ submissions, showGradeButton = false }) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Student</TableCell>
            <TableCell>Submitted At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Marks</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2">
                    {submission.student?.fullName || "Unknown Student"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {submission.student?.enrollmentNumber || "N/A"}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">
                    {dayjs(submission.submittedAt).format("MMM D, YYYY h:mm A")}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dayjs(submission.submittedAt).fromNow()}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  icon={getSubmissionStatusIcon(submission.status)}
                  label={submission.status.replace("_", " ")}
                  color={getSubmissionStatusColor(submission.status)}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                {submission.marksAwarded !== null ? (
                  <Typography variant="body2" fontWeight="bold">
                    {submission.marksAwarded}/{assignment?.totalMarks}
                  </Typography>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not graded
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {(submission.filePath || submission.content) && (
                    <IconButton
                      size="small"
                      onClick={() => handleViewSubmission(submission)}
                      title="View submission"
                    >
                      <ViewIcon />
                    </IconButton>
                  )}
                  {submission.filePath && (
                    <IconButton
                      size="small"
                      onClick={() => window.open(submission.filePath, "_blank")}
                      title="Download file"
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                  {showGradeButton && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<GradeIcon />}
                      onClick={() => handleGradeSubmission(submission)}
                    >
                      Grade
                    </Button>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {submissions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ py: 2 }}
                >
                  No submissions yet
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (assignmentLoading || submissionsLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (assignmentError || submissionsError || !assignment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Failed to load assignment details. Please try again later.
        </Alert>
      </Container>
    );
  }

  const isDuePassed = dayjs().isAfter(dayjs(assignment.dueDate));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton
          onClick={() => navigate("/faculty/assignment")}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <AssignmentIcon sx={{ mr: 2, fontSize: 32, color: "primary.main" }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {assignment.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {assignment.course?.subject?.name} -{" "}
            {assignment.course?.division?.name}
          </Typography>
        </Box>
        <Chip
          label={isDuePassed ? "Past Due" : "Active"}
          color={isDuePassed ? "error" : "success"}
          variant="outlined"
        />
      </Box>

      {/* Assignment Details */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assignment Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" paragraph>
                  {assignment.description || "No description provided."}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TimeIcon color="primary" />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Due Date
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(assignment.dueDate).format("MMM D, YYYY h:mm A")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(assignment.dueDate).fromNow()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GradeIcon color="primary" />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        Total Marks
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assignment.totalMarks} points
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PeopleIcon />
                Submission Summary
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Total Submissions</span>
                        <Badge
                          badgeContent={submissions.length}
                          color="primary"
                        />
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Pending Grading</span>
                        <Badge
                          badgeContent={submittedSubmissions.length}
                          color="warning"
                        />
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Graded</span>
                        <Badge
                          badgeContent={gradedSubmissions.length}
                          color="success"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Submissions Tabs */}
      <Card>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
            >
              <Tab
                label={
                  <Badge
                    badgeContent={submittedSubmissions.length}
                    color="warning"
                  >
                    Pending Grading
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge
                    badgeContent={gradedSubmissions.length}
                    color="success"
                  >
                    Graded
                  </Badge>
                }
              />
              <Tab
                label={
                  <Badge badgeContent={submissions.length} color="primary">
                    All Submissions
                  </Badge>
                }
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {activeTab === 0 && (
            <SubmissionTable
              submissions={submittedSubmissions}
              showGradeButton={true}
            />
          )}
          {activeTab === 1 && (
            <SubmissionTable
              submissions={gradedSubmissions}
              showGradeButton={true}
            />
          )}
          {activeTab === 2 && (
            <SubmissionTable submissions={submissions} showGradeButton={true} />
          )}
        </CardContent>
      </Card>

      {/* Grading Dialog */}
      <Dialog
        open={gradeDialog}
        onClose={handleCloseGradeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Grade Submission: {selectedSubmission?.student?.fullName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {selectedSubmission?.content && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Text Submission:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="body2">
                    {selectedSubmission.content}
                  </Typography>
                </Paper>
              </Box>
            )}

            {selectedSubmission?.filePath && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  File Submission:
                </Typography>
                <Link
                  href={selectedSubmission.filePath}
                  target="_blank"
                  rel="noopener"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <DownloadIcon />
                  View/Download File
                </Link>
              </Box>
            )}

            <TextField
              fullWidth
              label="Marks Awarded"
              type="number"
              value={gradeData.marksAwarded}
              onChange={(e) =>
                setGradeData((prev) => ({
                  ...prev,
                  marksAwarded: e.target.value,
                }))
              }
              inputProps={{ min: 0, max: assignment?.totalMarks }}
              helperText={`Out of ${assignment?.totalMarks} marks`}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Feedback (Optional)"
              value={gradeData.feedback}
              onChange={(e) =>
                setGradeData((prev) => ({ ...prev, feedback: e.target.value }))
              }
              placeholder="Provide feedback to the student..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGradeDialog}>Cancel</Button>
          <Button
            onClick={handleSubmitGrade}
            variant="contained"
            disabled={
              gradeSubmissionMutation.isLoading ||
              !gradeData.marksAwarded ||
              parseInt(gradeData.marksAwarded) > assignment?.totalMarks
            }
          >
            {gradeSubmissionMutation.isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Grading...
              </>
            ) : (
              "Submit Grade"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FacultyAssignmentDetailsPage;
