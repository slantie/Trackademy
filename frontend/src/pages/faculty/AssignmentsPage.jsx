// src/pages/faculty/AssignmentsPage.jsx
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
import {
  useGetAssignments,
  useDeleteAssignment,
} from "../../hooks/useAssignments";
import { useAuth } from "../../hooks/useAuth";
import AssignmentForm from "../../components/forms/AssignmentForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

const AssignmentsPage = () => {
  const { user } = useAuth();

  console.log("AssignmentsPage - User:", user);
  console.log("AssignmentsPage - User role:", user?.role);

  // Simple CRUD for faculty assignments
  const {
    data: assignmentsData,
    isLoading,
    isError,
  } = useGetAssignments({
    facultyUserId: user?.id, // Faculty sees only their assignments
  });

  const deleteMutation = useDeleteAssignment();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedAssignment(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenModal(true);
  };

  const handleDeleteClick = (assignment) => {
    setAssignmentToDelete(assignment);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      deleteMutation.mutate(assignmentToDelete.id, {
        onSuccess: () => {
          toast.success("Assignment deleted successfully!");
          setOpenDeleteDialog(false);
          setAssignmentToDelete(null);
        },
        onError: (error) => {
          console.error(
            "Failed to delete assignment:",
            error.response?.data || error
          );
          toast.error(
            `Failed to delete assignment: ${
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

  const handleRowClick = (params) => {
    navigate(`/faculty/assignments/${params.row.id}`);
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1.5, minWidth: 200 },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 250,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const description = params.row.description;
        const result = description
          ? description.length > 100
            ? `${description.substring(0, 100)}...`
            : description
          : "No description";
        console.log(
          "Description renderCell result:",
          result,
          "for assignment:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "totalMarks",
      headerName: "Total Marks",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const marks = params.row.totalMarks;
        const result = marks !== null && marks !== undefined ? marks : "N/A";
        console.log(
          "Total marks renderCell result:",
          result,
          "for assignment:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "course",
      headerName: "Course",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const course = params.row.course;
        if (!course || !course.subject) {
          console.log(
            "Missing course/subject in assignment row:",
            params.row.id
          );
          return "N/A";
        }

        const subjectCode = course.subject.code || "N/A";
        const subjectName = course.subject.name || "Unknown Subject";
        const division = course.division?.name || "N/A";
        const result = `${subjectCode} - ${subjectName} (Div: ${division})`;
        console.log(
          "Course renderCell result:",
          result,
          "for assignment:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        if (!params || !params.row || !params.row.dueDate) return "N/A";
        try {
          const dueDate = dayjs(params.row.dueDate);
          const isPastDue = dayjs().isAfter(dueDate);
          const formattedDate = dueDate.format("MM/DD/YYYY");

          console.log(
            "Due date renderCell result:",
            formattedDate,
            "isPastDue:",
            isPastDue,
            "for assignment:",
            params.row.id
          );

          return (
            <Chip
              label={formattedDate}
              variant="outlined"
              size="small"
              color={isPastDue ? "error" : "primary"}
            />
          );
        } catch (error) {
          console.error("Error formatting due date:", error);
          return "Invalid Date";
        }
      },
    },
    {
      field: "submissionsCount",
      headerName: "Submissions",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.row) return 0;
        const count = params.row._count?.submissions || 0;
        console.log(
          "Submissions count renderCell result:",
          count,
          "for assignment:",
          params.row.id
        );
        return count;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => {
        if (!params || !params.row) return null;

        return (
          <Box>
            <IconButton
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenEditModal(params.row);
              }}
              size="small"
              title="Edit assignment"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(params.row);
              }}
              size="small"
              title="Delete assignment"
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
            My Assignments
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress size={60} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (isError) {
    console.error("Assignments data fetch error:", isError);
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            My Assignments
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to load assignments. Please try refreshing the page.
          </Alert>
        </Box>
      </Container>
    );
  }

  // Extract assignments data with better error handling
  console.log("Full assignments response:", assignmentsData);

  // Handle nested data structure: data.assignments.data or fallback to data.assignments
  let assignmentsArray =
    assignmentsData?.data?.assignments?.data ||
    assignmentsData?.data?.assignments ||
    [];

  // Ensure it's an array
  if (!Array.isArray(assignmentsArray)) {
    console.warn("Assignments data is not an array:", assignmentsArray);
    assignmentsArray = [];
  }

  console.log("Assignments array:", assignmentsArray);

  // Debug: Check the first few rows to understand the structure
  if (assignmentsArray.length > 0) {
    console.log("First assignment data structure:", assignmentsArray[0]);
    console.log("First assignment course:", assignmentsArray[0]?.course);
    console.log("First assignment _count:", assignmentsArray[0]?._count);
  }

  // Filter out any invalid rows to prevent DataGrid errors
  const validRows = assignmentsArray.filter((row) => {
    if (!row || !row.id || !row.title) {
      console.warn("Filtering out invalid assignment row:", row);
      return false;
    }
    return true;
  });

  console.log("Valid assignment rows count:", validRows.length);
  console.log("Valid assignment rows sample:", validRows.slice(0, 2));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Assignments
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Showing {validRows.length} assignments
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Assignment
          </Button>
        </Box>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={validRows}
            columns={columns}
            getRowId={(row) => row.id}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            onRowClick={handleRowClick}
            sx={{ cursor: "pointer" }}
            disableSelectionOnClick
          />
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <AssignmentForm
          onClose={handleCloseModal}
          assignment={selectedAssignment}
        />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the assignment "
            {assignmentToDelete?.title}"? This action cannot be undone.
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

export default AssignmentsPage;
