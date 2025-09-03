// src/pages/admin/StudentsPage.jsx
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
import { useGetStudents, useDeleteStudent } from "../../hooks/useStudents";
import StudentForm from "../../components/forms/StudentForm";
import { toast } from "react-hot-toast";

const StudentsPage = () => {
  const { data: studentsData, isLoading, isError } = useGetStudents();
  const deleteMutation = useDeleteStudent();

  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedStudent(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      deleteMutation.mutate(studentToDelete.id, {
        onSuccess: () => {
          toast.success("Student deleted successfully!");
          setOpenDeleteDialog(false);
          setStudentToDelete(null);
        },
        onError: (error) => {
          console.error(
            "Failed to delete student:",
            error.response?.data || error
          );
          toast.error(
            `Failed to delete student: ${
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
    { field: "fullName", headerName: "Full Name", flex: 1, minWidth: 200 },
    {
      field: "enrollmentNumber",
      headerName: "Enrollment No.",
      flex: 1,
      minWidth: 150,
    },
    { field: "batch", headerName: "Batch", flex: 0.5, minWidth: 100 },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const department = params.row.department;
        if (!department) {
          console.log(
            "Missing department in student row:",
            params.row.fullName
          );
          return "N/A";
        }

        const name = department.name || "Unknown";
        const abbreviation = department.abbreviation || "";
        const result = abbreviation ? `${name} (${abbreviation})` : name;
        console.log(
          "Department renderCell result:",
          result,
          "for student:",
          params.row.fullName
        );
        return result;
      },
    },
    {
      field: "semester",
      headerName: "Semester",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const semester = params.row.semester;
        if (!semester) {
          console.log("Missing semester in student row:", params.row.fullName);
          return "N/A";
        }

        const semesterNumber = semester.semesterNumber || "Unknown";
        const semesterType = semester.semesterType || "";
        const academicYear = semester.academicYear?.year || "";
        const result = `Sem ${semesterNumber}${
          semesterType ? ` (${semesterType})` : ""
        }${academicYear ? ` - ${academicYear}` : ""}`;
        console.log(
          "Semester renderCell result:",
          result,
          "for student:",
          params.row.fullName
        );
        return result;
      },
    },
    {
      field: "division",
      headerName: "Division",
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const division = params.row.division;
        if (!division) {
          console.log("Missing division in student row:", params.row.fullName);
          return "N/A";
        }

        const result = division.name || "N/A";
        console.log(
          "Division renderCell result:",
          result,
          "for student:",
          params.row.fullName
        );
        return result;
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const email = params.row.user?.email;
        const result = email || "N/A";
        console.log(
          "Email renderCell result:",
          result,
          "for student:",
          params.row.fullName
        );
        return result;
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    console.error("Students data fetch error:", isError);
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load students.</Alert>
      </Box>
    );
  }

  // Extract students data with better error handling
  const students = studentsData?.data?.students || [];
  console.log("Students response:", studentsData);
  console.log("Students rows:", students);

  // Debug: Check the first few rows to understand the structure
  if (students.length > 0) {
    console.log("First student data structure:", students[0]);
    console.log("First student department:", students[0]?.department);
    console.log("First student semester:", students[0]?.semester);
    console.log("First student division:", students[0]?.division);
    console.log("First student user:", students[0]?.user);
  }

  // Filter out any invalid rows to prevent DataGrid errors
  const validRows = students.filter((row) => {
    if (!row || !row.id || !row.fullName) {
      console.warn("Filtering out invalid student row:", row);
      return false;
    }
    return true;
  });

  console.log("Valid student rows count:", validRows.length);
  console.log("Valid student rows sample:", validRows.slice(0, 2));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Students
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Student
          </Button>
        </Box>
        {validRows.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No students found. Create your first student to get started.
          </Alert>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total students: {validRows.length}
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
            disableSelectionOnClick
          />
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <StudentForm onClose={handleCloseModal} student={selectedStudent} />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the student "
            {studentToDelete?.fullName}"? This action cannot be undone.
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

export default StudentsPage;
