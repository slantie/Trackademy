// src/pages/faculty/SubmissionsPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router-dom";
import GradingIcon from "@mui/icons-material/Grading";
import { useGetSubmissionsByAssignment } from "../../hooks/useSubmissions";
import GradeForm from "../../components/forms/GradeForm";

const SubmissionsPage = () => {
  const { assignmentId } = useParams();
  const {
    data: submissionsData,
    isLoading,
    isError,
  } = useGetSubmissionsByAssignment(assignmentId);
  const [openGradeModal, setOpenGradeModal] = useState(false);
  const [submissionToGrade, setSubmissionToGrade] = useState(null);

  const handleOpenGradeModal = (submission) => {
    setSubmissionToGrade(submission);
    setOpenGradeModal(true);
  };

  const handleCloseGradeModal = () => {
    setOpenGradeModal(false);
    setSubmissionToGrade(null);
  };

  const columns = [
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const studentName = params.row.student?.fullName;
        const result = studentName || "N/A";
        console.log(
          "Student name renderCell result:",
          result,
          "for submission:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "enrollmentNumber",
      headerName: "Enrollment No.",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const enrollmentNumber = params.row.student?.enrollmentNumber;
        const result = enrollmentNumber || "N/A";
        console.log(
          "Enrollment renderCell result:",
          result,
          "for submission:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "submittedAt",
      headerName: "Submitted At",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        if (!params || !params.row || !params.row.submittedAt) return "N/A";
        try {
          const result = new Date(params.row.submittedAt).toLocaleString();
          console.log(
            "Submitted at renderCell result:",
            result,
            "for submission:",
            params.row.id
          );
          return result;
        } catch (error) {
          console.error("Error formatting date:", error);
          return "Invalid Date";
        }
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const status = params.row.status || "PENDING";
        console.log(
          "Status renderCell result:",
          status,
          "for submission:",
          params.row.id
        );
        return (
          <Chip
            label={status}
            variant="outlined"
            size="small"
            color={
              status === "GRADED"
                ? "success"
                : status === "SUBMITTED"
                ? "primary"
                : "warning"
            }
          />
        );
      },
    },
    {
      field: "marksAwarded",
      headerName: "Marks",
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const marks = params.row.marksAwarded;
        const result = marks !== null && marks !== undefined ? marks : "N/A";
        console.log(
          "Marks renderCell result:",
          result,
          "for submission:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.6,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => {
        if (!params || !params.row) return null;

        const isGraded = params.row.status === "GRADED";
        console.log(
          "Actions renderCell - isGraded:",
          isGraded,
          "for submission:",
          params.row.id
        );

        return (
          <Box>
            <IconButton
              color="primary"
              onClick={() => handleOpenGradeModal(params.row)}
              disabled={isGraded}
              size="small"
              title={isGraded ? "Already graded" : "Grade submission"}
            >
              <GradingIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Container maxWidth="2xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Submissions
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={60} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (isError) {
    console.error("Submissions data fetch error:", isError);
    return (
      <Container maxWidth="2xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Submissions
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load submissions. Please try refreshing the page.
          </Alert>
        </Box>
      </Container>
    );
  }

  // --- Start of modified line ---
  const submissions = submissionsData?.data?.submissions?.data || [];
  // --- End of modified line ---
  console.log("Submissions response:", submissionsData);
  console.log("Submissions rows:", submissions);

  // Debug: Check the first few rows to understand the structure
  if (submissions.length > 0) {
    console.log("First submission data structure:", submissions[0]);
    console.log("First submission student:", submissions[0]?.student);
  }

  // Filter out any invalid rows to prevent DataGrid errors
  const validRows = submissions.filter((row) => {
    if (!row || !row.id) {
      console.warn("Filtering out invalid submission row:", row);
      return false;
    }
    return true;
  });

  console.log("Valid submission rows count:", validRows.length);
  console.log("Valid submission rows sample:", validRows.slice(0, 2));

  return (
    <Container maxWidth="2xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Submissions for Assignment
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Review and grade student submissions
        </Typography>

        {validRows.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No submissions found for this assignment.
          </Alert>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total submissions: {validRows.length}
          </Typography>
        )}

        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={validRows}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
                padding: "8px",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "primary.main",
                color: "white",
                fontWeight: "bold",
              },
            }}
          />
        </Box>
      </Box>
      <Dialog
        open={openGradeModal}
        onClose={handleCloseGradeModal}
        maxWidth="sm"
        fullWidth
      >
        <GradeForm
          onClose={handleCloseGradeModal}
          submission={submissionToGrade}
        />
      </Dialog>
    </Container>
  );
};

export default SubmissionsPage;
