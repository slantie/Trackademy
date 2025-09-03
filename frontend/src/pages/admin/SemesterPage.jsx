// src/pages/admin/SemestersPage.jsx
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useGetSemesters, useDeleteSemester } from "../../hooks/useSemesters";
import SemesterForm from "../../components/forms/SemesterForm";
import { toast } from "react-hot-toast";

const SemestersPage = () => {
  const { data: semestersData, isLoading, isError } = useGetSemesters();
  const deleteMutation = useDeleteSemester();

  const [openModal, setOpenModal] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedSemester(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (semester) => {
    setSelectedSemester(semester);
    setOpenModal(true);
  };

  const handleDeleteClick = (semester) => {
    setSemesterToDelete(semester);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (semesterToDelete) {
      deleteMutation.mutate(semesterToDelete.id, {
        onSuccess: () => {
          toast.success("Semester deleted successfully!");
          setOpenDeleteDialog(false);
          setSemesterToDelete(null);
        },
        onError: (error) => {
          console.error(
            "Failed to delete semester:",
            error.response?.data || error
          );
          toast.error(
            `Failed to delete semester: ${
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
    {
      field: "semesterNumber",
      headerName: "Semester",
      flex: 0.5,
      minWidth: 100,
    },
    { field: "semesterType", headerName: "Type", flex: 0.5, minWidth: 100 },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "academicYearName",
      headerName: "Academic Year",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleOpenEditModal(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    console.error("Semesters data fetch error:", isError);
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load semesters.</Alert>
      </Box>
    );
  }

  const rawRows = semestersData?.data?.semesters || [];

  // Preprocess the data to add department and academic year names directly to each row
  const rows = rawRows.map((semester) => ({
    ...semester,
    departmentName: semester?.department?.name || "N/A",
    academicYearName: semester?.academicYear?.year || "N/A",
  }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Semesters
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Semester
          </Button>
        </Box>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row?.id || Math.random()}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <SemesterForm onClose={handleCloseModal} semester={selectedSemester} />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete Semester{" "}
            {semesterToDelete?.semesterNumber}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SemestersPage;
