// src/pages/admin/AcademicYearsPage.jsx
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  useGetAcademicYears,
  useDeleteAcademicYear,
  useActivateAcademicYear,
} from "../../hooks/useAcademicYears";
import AcademicYearForm from "../../components/forms/AcademicYearForm";
import { toast } from "react-hot-toast";

const AcademicYearsPage = () => {
  const { data: academicYearsData, isLoading, isError } = useGetAcademicYears();
  const deleteMutation = useDeleteAcademicYear();
  const activateMutation = useActivateAcademicYear();

  const [openModal, setOpenModal] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [yearToDelete, setYearToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedYear(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (year) => {
    setSelectedYear(year);
    setOpenModal(true);
  };

  const handleDeleteClick = (year) => {
    setYearToDelete(year);
    setOpenDeleteDialog(true);
  };

  const handleActivateClick = (yearId) => {
    activateMutation.mutate(yearId, {
      onSuccess: () => {
        toast.success("Academic Year activated successfully!");
      },
      onError: () => {
        toast.error("Failed to activate academic year.");
      },
    });
  };

  const handleConfirmDelete = () => {
    if (yearToDelete) {
      deleteMutation.mutate(yearToDelete.id, {
        onSuccess: () => {
          toast.success("Academic Year deleted successfully!");
          setOpenDeleteDialog(false);
          setYearToDelete(null);
        },
        onError: () => {
          toast.error("Failed to delete academic year.");
        },
      });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const columns = [
    { field: "year", headerName: "Year", flex: 1, minWidth: 150 },
    {
      field: "college",
      headerName: "College Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        return params?.abbreviation || "N/A";
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          color={params.value ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 180,
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
          {!params.row.isActive && (
            <IconButton
              color="success"
              onClick={() => handleActivateClick(params.row.id)}
            >
              <CheckCircleOutlineIcon />
            </IconButton>
          )}
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
        <Alert severity="error">Failed to load academic years.</Alert>
      </Box>
    );
  }

  // Access data correctly based on nested API response
  const rows = academicYearsData?.data?.academicYears || [];

  // Ensure all rows have proper IDs for DataGrid
  const processedRows = rows.map((row, index) => ({
    ...row,
    id: row?.id || `temp-${index}`, // Ensure each row has an ID
  }));

  return (
    <Container maxWidth="2xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Academic Years
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Academic Year
          </Button>
        </Box>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={processedRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <AcademicYearForm
          onClose={handleCloseModal}
          academicYear={selectedYear}
        />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the academic year "
            {yearToDelete?.year}"? This action cannot be undone.
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

export default AcademicYearsPage;
