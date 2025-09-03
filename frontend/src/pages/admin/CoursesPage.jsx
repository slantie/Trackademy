// src/pages/admin/CoursesPage.jsx
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
import { useGetCourses, useDeleteCourse } from "../../hooks/useCourses";
import CourseForm from "../../components/forms/CourseForm";
import { toast } from "react-hot-toast";

const CoursesPage = () => {
  const { data: coursesData, isLoading, isError } = useGetCourses();
  const deleteMutation = useDeleteCourse();

  const [openModal, setOpenModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const handleOpenCreateModal = () => {
    setSelectedCourse(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    setOpenModal(true);
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      deleteMutation.mutate(courseToDelete.id, {
        onSuccess: () => {
          toast.success("Course deleted successfully!");
          setOpenDeleteDialog(false);
          setCourseToDelete(null);
        },
        onError: (error) => {
          console.error(
            "Failed to delete course:",
            error.response?.data || error
          );
          toast.error(
            `Failed to delete course: ${
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
      field: "subject",
      headerName: "Subject",
      flex: 2,
      minWidth: 250,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const subject = params.row.subject;
        if (!subject) {
          console.log("Missing subject in course row:", params.row.id);
          return "N/A";
        }

        const name = subject.name || "Unknown Subject";
        const code = subject.code || "";
        const abbreviation = subject.abbreviation || "";

        // Format: "Subject Name (CODE) - ABBR"
        let result = name;
        if (code) result += ` (${code})`;
        if (abbreviation) result += ` - ${abbreviation}`;

        console.log(
          "Subject renderCell result:",
          result,
          "for course:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "faculty",
      headerName: "Faculty",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const faculty = params.row.faculty;
        if (!faculty) {
          console.log("Missing faculty in course row:", params.row.id);
          return "N/A";
        }

        const fullName = faculty.fullName || "Unknown Faculty";
        const designation = faculty.designation || "";
        const department = faculty.department?.abbreviation || "";

        // Format: "Faculty Name (DESIGNATION, DEPT)"
        let result = fullName;
        const details = [];
        if (designation) details.push(designation.replace(/_/g, " "));
        if (department) details.push(department);
        if (details.length > 0) result += ` (${details.join(", ")})`;

        console.log(
          "Faculty renderCell result:",
          result,
          "for course:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "lectureType",
      headerName: "Type",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const lectureType = params.row.lectureType;
        const result = lectureType ? lectureType.replace(/_/g, " ") : "N/A";
        console.log(
          "Lecture type renderCell result:",
          result,
          "for course:",
          params.row.id
        );
        return (
          <Chip
            label={result}
            variant="outlined"
            size="small"
            color={
              lectureType === "THEORY"
                ? "primary"
                : lectureType === "PRACTICAL"
                ? "secondary"
                : "default"
            }
          />
        );
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
          console.log("Missing semester in course row:", params.row.id);
          return "N/A";
        }

        const semesterNumber = semester.semesterNumber || "Unknown";
        const semesterType = semester.semesterType || "";
        const academicYear = semester.academicYear?.year || "";

        let result = `Sem ${semesterNumber}`;
        if (semesterType) result += ` (${semesterType})`;
        if (academicYear) result += ` - ${academicYear}`;

        console.log(
          "Semester renderCell result:",
          result,
          "for course:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "division",
      headerName: "Division",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const division = params.row.division;
        if (!division) {
          console.log("Missing division in course row:", params.row.id);
          return "N/A";
        }

        const result = division.name || "N/A";
        console.log(
          "Division renderCell result:",
          result,
          "for course:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "batch",
      headerName: "Batch",
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => {
        if (!params || !params.row) return "N/A";
        const batch = params.row.batch;
        const result = batch || "All";
        console.log(
          "Batch renderCell result:",
          result,
          "for course:",
          params.row.id
        );
        return result;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
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
    console.error("Courses data fetch error:", isError);
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Failed to load courses.</Alert>
      </Box>
    );
  }

  // Extract courses data with better error handling
  const courses = coursesData?.data?.courses || [];
  console.log("Courses response:", coursesData);
  console.log("Courses rows:", courses);

  // Debug: Check the first few rows to understand the structure
  if (courses.length > 0) {
    console.log("First course data structure:", courses[0]);
    console.log("First course subject:", courses[0]?.subject);
    console.log("First course faculty:", courses[0]?.faculty);
    console.log("First course semester:", courses[0]?.semester);
    console.log("First course division:", courses[0]?.division);
  }

  // Filter out any invalid rows to prevent DataGrid errors
  const validRows = courses.filter((row) => {
    if (!row || !row.id) {
      console.warn("Filtering out invalid course row:", row);
      return false;
    }
    return true;
  });

  console.log("Valid course rows count:", validRows.length);
  console.log("Valid course rows sample:", validRows.slice(0, 2));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courses
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateModal}
          >
            Create Course
          </Button>
        </Box>
        {validRows.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No courses found. Create your first course to get started.
          </Alert>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Total courses: {validRows.length}
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
            pageSizeOptions={[5, 10, 25, 50]}
            disableSelectionOnClick
          />
        </Box>
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <CourseForm onClose={handleCloseModal} course={selectedCourse} />
      </Dialog>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this course? This action cannot be
            undone.
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

export default CoursesPage;
