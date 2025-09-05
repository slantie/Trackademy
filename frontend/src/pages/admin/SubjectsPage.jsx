// src/pages/admin/SubjectsPage.jsx
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
import { useGetSubjects, useDeleteSubject } from "../../hooks/useSubjects";
import SubjectForm from "../../components/forms/SubjectForm";
import { toast } from "react-hot-toast";

const SubjectsPage = () => {
  const { data: subjectsData, isLoading, isError } = useGetSubjects();
  const deleteMutation = useDeleteSubject();

  const [openModal, setOpenModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedSubject(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (subject) => {
    setSelectedSubject(subject);
    setOpenModal(true);
  };

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      deleteMutation.mutate(subjectToDelete.id, {
        onSuccess: () => {
          toast.success("Subject deleted successfully!");
          setOpenDeleteDialog(false);
          setSubjectToDelete(null);
        },
        onError: (error) => {
          console.error(
            "Failed to delete subject:",
            error.response?.data || error
          );
          toast.error(
            `Failed to delete subject: ${
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
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    {
      field: "abbreviation",
      headerName: "Abbreviation",
      flex: 0.5,
      minWidth: 100,
    },
    { field: "code", headerName: "Code", flex: 0.5, minWidth: 100 },
    {
      field: "semesterNumber",
      headerName: "Semester",
      flex: 0.5,
      minWidth: 100,
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
    console.error("Subjects data fetch error:", isError);
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load subjects.</Alert>
      </Box>
    );
  }

  const rawRows = subjectsData?.data?.subjects || [];

  // Preprocess the data to add department name directly to each row
  const rows = rawRows.map((subject) => ({
    ...subject,
    departmentName: subject?.department?.name || "N/A",
  }));

  return (
    <Container maxWidth="2xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Subjects
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Subject
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
        <SubjectForm onClose={handleCloseModal} subject={selectedSubject} />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the subject "{subjectToDelete?.name}
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

export default SubjectsPage;
