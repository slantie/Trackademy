// src/pages/admin/ExamResultsPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetExamResults } from "../../hooks/useExamResults";

const ExamResultsPage = () => {
  const { examId } = useParams();
  const { data: resultsData, isLoading, isError } = useGetExamResults(examId);

  const columns = [
    { field: "studentEnrollmentNumber", headerName: "Enrollment No.", flex: 1 },
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1.5,
      valueGetter: (value, row) => row?.student?.fullName || "N/A",
    },
    { field: "spi", headerName: "SPI", flex: 0.5 },
    { field: "cpi", headerName: "CPI", flex: 0.5 },
    { field: "status", headerName: "Status", flex: 0.8 },
  ];

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load results.</Alert>;

  const rows = resultsData?.data?.examResults || [];

  return (
    <Container maxWidth="2xl" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exam Results for {rows[0]?.exam?.name || "Exam"}
      </Typography>
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[10, 25, 50]}
        />
      </Paper>
    </Container>
  );
};

export default ExamResultsPage;
