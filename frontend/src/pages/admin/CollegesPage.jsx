// src/pages/admin/CollegesPage.jsx
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
import { useGetColleges, useDeleteCollege } from "../../hooks/useColleges";
import CollegeForm from "../../components/forms/CollegeForm";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast is installed

const CollegesPage = () => {
  const { data: colleges, isLoading, isError } = useGetColleges();
  const deleteMutation = useDeleteCollege();

  const [openModal, setOpenModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedCollege(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (college) => {
    setSelectedCollege(college);
    setOpenModal(true);
  };

  const handleDeleteClick = (college) => {
    setCollegeToDelete(college);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (collegeToDelete) {
      deleteMutation.mutate(collegeToDelete.id, {
        onSuccess: () => {
          toast.success("College deleted successfully!");
          setOpenDeleteDialog(false);
          setCollegeToDelete(null);
        },
        onError: () => {
          toast.error("Failed to delete college.");
        },
      });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    {
      field: "abbreviation",
      headerName: "Abbreviation",
      flex: 0.5,
      minWidth: 100,
    },
    { field: "website", headerName: "Website", flex: 1, minWidth: 200 },
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
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load colleges.</Alert>
      </Box>
    );
  }

  // Debug: Log the response structure
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Colleges
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create College
          </Button>
        </Box>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={colleges?.data?.colleges?.data || []}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <CollegeForm onClose={handleCloseModal} college={selectedCollege} />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the college "{collegeToDelete?.name}
            "? This action cannot be undone.
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

export default CollegesPage;
