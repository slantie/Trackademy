// src/pages/admin/ExamsPage.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useGetExams } from "../../hooks/useExams";

const ExamsPage = () => {
  const { data: examsData, isLoading, isError } = useGetExams();
  const navigate = useNavigate();

  const handleRowClick = (params) => {
    navigate(`/admin/exams/${params.row.id}/results`);
  };

  const columns = [
    { field: "name", headerName: "Exam Name", flex: 1.5, minWidth: 200 },
    { field: "examType", headerName: "Type", flex: 1, minWidth: 120 },
    {
      field: "semester",
      headerName: "Semester",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) =>
        `Sem ${row?.semester?.semesterNumber || "N/A"}`,
    },
    {
      field: "academicYear",
      headerName: "Academic Year",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row?.semester?.academicYear?.year || "N/A",
    },
    {
      field: "isPublished",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) => (params.value ? "Published" : "Not Published"),
    },
  ];

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load exams.</Alert>;

  const rows = examsData?.data?.exams || [];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Exams
      </Typography>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={handleRowClick}
          sx={{ cursor: "pointer" }}
          pageSizeOptions={[10, 25, 50]}
        />
      </Box>
    </Container>
  );
};

export default ExamsPage;
