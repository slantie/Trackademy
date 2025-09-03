// src/pages/admin/DivisionsPage.jsx
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useGetDivisions, useDeleteDivision } from "../../hooks/useDivisions";
import DivisionForm from "../../components/forms/DivisionForm";
import { toast } from "react-hot-toast";

const DivisionsPage = () => {
  const { data: divisionsData, isLoading, isError } = useGetDivisions();
  const deleteMutation = useDeleteDivision();

  const [openModal, setOpenModal] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [divisionToDelete, setDivisionToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedDivision(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (division) => {
    setSelectedDivision(division);
    setOpenModal(true);
  };

  const handleDeleteClick = (division) => {
    setDivisionToDelete(division);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (divisionToDelete) {
      deleteMutation.mutate(divisionToDelete.id, {
        onSuccess: () => {
          toast.success("Division deleted successfully!");
          setOpenDeleteDialog(false);
          setDivisionToDelete(null);
        },
        onError: (error) => {
          console.error(
            "Failed to delete division:",
            error.response?.data || error
          );
          toast.error(
            `Failed to delete division: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { field: "name", headerName: "Division Name", flex: 1, minWidth: 150 },
    {
      field: "semester",
      headerName: "Semester",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        // Try renderCell instead of valueGetter for testing
        if (!params || !params.row) {
          console.log("Missing params or row in renderCell:", params);
          return "N/A";
        }
        const semester = params.row.semester;
        if (!semester) {
          console.log("Missing semester in row renderCell:", params.row);
          return "N/A";
        }

        const semesterNumber = semester.semesterNumber || "Unknown";
        const semesterType = semester.semesterType || "";
        const result = `Semester ${semesterNumber}${
          semesterType ? ` (${semesterType})` : ""
        }`;
        console.log(
          "Semester renderCell result:",
          result,
          "for row:",
          params.row.name
        );
        return result;
      },
    },
    {
      field: "academicYear",
      headerName: "Academic Year",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const year = params.row.semester?.academicYear?.year;
        console.log(
          "Academic year renderCell:",
          year,
          "for row:",
          params.row.name
        );
        return year || "N/A";
      },
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const department = params.row.semester?.department;
        if (!department) {
          console.log("Missing department in row:", params.row.name);
          return "N/A";
        }

        const name = department.name || "Unknown";
        const abbreviation = department.abbreviation || "";
        const result = abbreviation ? `${name} (${abbreviation})` : name;
        console.log(
          "Department renderCell result:",
          result,
          "for row:",
          params.row.name
        );
        return result;
      },
    },
    {
      field: "studentCount",
      headerName: "Students",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.row) return 0;
        const count = params.row._count?.students;
        console.log(
          "Student count renderCell:",
          count,
          "for row:",
          params.row.name
        );
        return count || 0;
      },
    },
    {
      field: "courseCount",
      headerName: "Courses",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.row) return 0;
        const count = params.row._count?.courses;
        console.log(
          "Course count renderCell:",
          count,
          "for row:",
          params.row.name
        );
        return count || 0;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        // Add defensive check for renderCell too
        if (!params || !params.row) return null;

        return (
          <Box>
            <IconButton
              color="primary"
              onClick={() => handleOpenEditModal(params.row)}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(params.row)}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Divisions
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={60} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (isError) {
    console.error("Divisions data fetch error:", isError);
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Divisions
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load divisions. Please try refreshing the page.
          </Alert>
        </Box>
      </Container>
    );
  }

  const rows = divisionsData?.data?.divisions || [];
  console.log("Divisions response:", divisionsData);
  console.log("Divisions rows:", rows);

  // Debug: Check the first few rows to understand the structure
  if (rows.length > 0) {
    console.log("First division data structure:", rows[0]);
    console.log("First division semester:", rows[0]?.semester);
  }

  // Filter out any invalid rows to prevent DataGrid errors
  const validRows = rows.filter((row) => {
    if (!row || !row.id || !row.name) {
      console.warn("Filtering out invalid division row:", row);
      return false;
    }
    return true;
  });

  console.log("Valid rows count:", validRows.length);
  console.log("Valid rows sample:", validRows.slice(0, 2));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Divisions Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage academic divisions and their semester assignments
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
            size="large"
          >
            Create Division
          </Button>
        </Box>

        {validRows.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No divisions found. Create your first division to get started.
          </Alert>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total divisions: {validRows.length}
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
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DivisionForm onClose={handleCloseModal} division={selectedDivision} />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle color="error.main">Confirm Delete Division</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the division{" "}
            <strong>"{divisionToDelete?.name}"</strong>?
            <br />
            <br />
            This action cannot be undone and will affect:
            <br />• {divisionToDelete?._count?.students || 0} students
            <br />• {divisionToDelete?._count?.courses || 0} courses
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
            startIcon={
              deleteMutation.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {deleteMutation.isLoading ? "Deleting..." : "Delete Division"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DivisionsPage;
