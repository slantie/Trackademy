// src/pages/admin/FacultyPage.jsx
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
import { useGetFaculties, useDeleteFaculty } from "../../hooks/useFaculties";
import FacultyForm from "../../components/forms/FacultyForm";
import { toast } from "react-hot-toast";

const FacultyPage = () => {
  const { data: facultiesData, isLoading, isError } = useGetFaculties();
  const deleteMutation = useDeleteFaculty();

  const [openModal, setOpenModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedFaculty(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (faculty) => {
    setSelectedFaculty(faculty);
    setOpenModal(true);
  };

  const handleDeleteClick = (faculty) => {
    setFacultyToDelete(faculty);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (facultyToDelete) {
      deleteMutation.mutate(facultyToDelete.id, {
        onSuccess: () => {
          toast.success("Faculty deleted successfully!");
          setOpenDeleteDialog(false);
          setFacultyToDelete(null);
        },
        onError: (error) => {
          console.error(
            "Failed to delete faculty:",
            error.response?.data || error
          );
          toast.error(
            `Failed to delete faculty: ${
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
    { field: "fullName", headerName: "Full Name", flex: 1, minWidth: 150 },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0.8,
      minWidth: 120,
    },
    {
      field: "departmentName",
      headerName: "Department",
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
    console.error("Faculties data fetch error:", isError);
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load faculties.</Alert>
      </Box>
    );
  }

  const rawRows = facultiesData?.data?.faculties || [];

  // Preprocess the data to add email and department name directly to each row
  const rows = rawRows.map((faculty) => ({
    ...faculty,
    email: faculty?.user?.email || "N/A",
    departmentName: faculty?.department?.name || "N/A",
  }));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Faculties
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Faculty
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
        <FacultyForm onClose={handleCloseModal} faculty={selectedFaculty} />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{facultyToDelete?.fullName}"? This
            action cannot be undone.
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

export default FacultyPage;
