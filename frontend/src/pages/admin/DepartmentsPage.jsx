// src/pages/admin/DepartmentsPage.jsx
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
import {
  useGetDepartments,
  useDeleteDepartment,
} from "../../hooks/useDepartments";
import DepartmentForm from "../../components/forms/DepartmentForm";
import { toast } from "react-hot-toast";

const DepartmentsPage = () => {
  const { data: departmentsData, isLoading, isError } = useGetDepartments();
  const deleteMutation = useDeleteDepartment();

  const [openModal, setOpenModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedDepartment(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (department) => {
    setSelectedDepartment(department);
    setOpenModal(true);
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (departmentToDelete) {
      deleteMutation.mutate(departmentToDelete.id, {
        onSuccess: () => {
          toast.success("Department deleted successfully!");
          setOpenDeleteDialog(false);
          setDepartmentToDelete(null);
        },
        onError: (error) => {
          console.error("Delete error details:", error);
          console.error("Error response:", error.response);

          let errorMessage = "Failed to delete department.";

          if (error.response?.status === 400) {
            errorMessage =
              error.response?.data?.message ||
              "Cannot delete department. It may have associated subjects, faculties, semesters, or students.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          toast.error(errorMessage);
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
    {
      field: "collegeName",
      headerName: "College",
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
    console.error("Departments data fetch error:", isError);
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load departments.</Alert>
      </Box>
    );
  }

  const rows =
    departmentsData?.data?.departments?.data ||
    departmentsData?.data?.departments ||
    departmentsData?.data ||
    [];

  // Process rows to ensure proper structure for DataGrid
  const processedRows = Array.isArray(rows)
    ? rows.map((row, index) => {
        // Add college abbreviation directly to the row for easier access
        const collegeAbbreviation =
          row.college?.abbreviation || row.college?.name || "N/A";

        return {
          ...row,
          id: row?.id || `temp-${index}`, // Ensure each row has an ID
          collegeName: collegeAbbreviation, // Add college info directly to row
        };
      })
    : [];

  return (
    <Container maxWidth="2xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Departments
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Department
          </Button>
        </Box>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={processedRows}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DepartmentForm
          onClose={handleCloseModal}
          department={selectedDepartment}
        />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the department "
            {departmentToDelete?.name}"?
          </DialogContentText>
          {departmentToDelete?._count && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "gpray.light", borderRadius: 1 }}>
              <Typography variant="body2" color="text.tertiary">
                <strong>Associated Data:</strong>
                <br />• Faculties: {departmentToDelete._count.faculties || 0}
                <br />• Subjects: {departmentToDelete._count.subjects || 0}
                <br />• Semesters: {departmentToDelete._count.semesters || 0}
                <br />• Students: {departmentToDelete._count.students || 0}
                <br />
                <em>
                  If any of these counts are greater than 0, deletion may fail.
                </em>
              </Typography>
            </Box>
          )}
          <DialogContentText sx={{ mt: 2 }}>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? (
              <CircularProgress size={20} />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DepartmentsPage;
