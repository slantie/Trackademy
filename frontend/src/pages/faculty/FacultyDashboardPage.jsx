// src/pages/faculty/FacultyDashboardPage.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import { useGetCourses, useGetFacultyCourses } from "../../hooks/useCourses";
import { useCreateAssignment } from "../../hooks/useAssignments";
import MyCoursesWidget from "../../components/widgets/MyCoursesWidget";
import UpcomingAssignmentsWidget from "../../components/widgets/UpcomingAssignmentsWidget";
import { toast } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const FacultyDashboardPage = () => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);

  // Fetch faculty courses for assignment creation
  const { data: facultyCoursesData, isLoading: facultyCoursesLoading } =
    useGetFacultyCourses(user?.id);

  // Fallback to all courses if faculty has no courses assigned
  const { data: allCoursesData, isLoading: allCoursesLoading } =
    useGetCourses();

  const createAssignmentMutation = useCreateAssignment();

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      totalMarks: 0,
      dueDate: dayjs().add(7, "days"), // Default to 1 week from now
      course: null,
    },
  });

  // Extract faculty courses first, fallback to all courses if none
  const facultyCourses =
    facultyCoursesData?.data?.courses?.data ||
    facultyCoursesData?.data?.courses ||
    facultyCoursesData?.data ||
    [];

  const allCourses =
    allCoursesData?.data?.courses?.data ||
    allCoursesData?.data?.courses ||
    allCoursesData?.data ||
    [];

  // Use faculty courses if available, otherwise use all courses
  const courses = facultyCourses.length > 0 ? facultyCourses : allCourses;
  const coursesLoading = facultyCoursesLoading || allCoursesLoading;

  console.log("FacultyDashboardPage - User:", user);
  console.log(
    "FacultyDashboardPage - Faculty courses data:",
    facultyCoursesData
  );
  console.log("FacultyDashboardPage - All courses data:", allCoursesData);
  console.log(
    "FacultyDashboardPage - Faculty courses count:",
    facultyCourses.length
  );
  console.log("FacultyDashboardPage - All courses count:", allCourses.length);
  console.log("FacultyDashboardPage - Final courses used:", courses.length);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    reset();
  };

  const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
    console.log("Selected course object:", data.course);
    console.log("Course ID being sent:", data.course?.id);

    if (!data.course || !data.course.id) {
      toast.error("Please select a course for this assignment");
      return;
    }

    const submitData = {
      title: data.title,
      description: data.description,
      totalMarks: Number(data.totalMarks),
      dueDate: data.dueDate.toISOString(),
      courseId: data.course.id,
    };

    console.log("Creating assignment with data:", submitData);

    createAssignmentMutation.mutate(submitData, {
      onSuccess: () => {
        toast.success("Assignment created successfully!");
        handleCloseModal();
        reset(); // Reset form after successful submission
      },
      onError: (error) => {
        console.error("Failed to create assignment:", error);
        toast.error(
          `Failed to create assignment: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    });
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          You must be logged in to access the faculty dashboard.
        </Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.fullName}!
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            Faculty Dashboard - {user?.role}
          </Typography>

          <Grid container spacing={3}>
            {/* My Courses Widget */}
            <Grid item xs={12} lg={6}>
              <MyCoursesWidget />
            </Grid>

            {/* Upcoming Assignments Widget */}
            <Grid item xs={12} lg={6}>
              <UpcomingAssignmentsWidget />
            </Grid>

            {/* Additional widgets can be added here */}
            {/* TODO: Add widgets for:
                - Recent Submissions (requiring grading)
                - Course Statistics
                - Attendance Overview
                - Quick Actions
            */}
          </Grid>

          {/* Floating Action Button for Quick Assignment Creation */}
          <Fab
            color="primary"
            aria-label="create assignment"
            onClick={handleOpenModal}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
            }}
          >
            <AddIcon />
          </Fab>

          {/* Create Assignment Modal */}
          <Dialog
            open={openModal}
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Assignment Title"
                      {...register("title", { required: "Title is required" })}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      {...register("description")}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Total Marks"
                      type="number"
                      {...register("totalMarks", {
                        required: "Total marks is required",
                        min: { value: 1, message: "Must be at least 1" },
                      })}
                      error={!!errors.totalMarks}
                      helperText={errors.totalMarks?.message}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dueDate"
                      control={control}
                      rules={{ required: "Due date is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <DateTimePicker
                          label="Due Date"
                          {...field}
                          sx={{ mt: 2, width: "100%" }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!error,
                              helperText: error?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="course"
                      control={control}
                      rules={{ required: "Course is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <Autocomplete
                          {...field}
                          options={courses}
                          getOptionLabel={(option) => {
                            console.log("Course option structure:", option);
                            if (option.subject?.name && option.division?.name) {
                              return `${option.subject.name} (${option.division.name}) - ${option.subject.code}`;
                            } else if (option.subject?.name) {
                              return `${option.subject.name} - ${
                                option.subject.code || option.id
                              }`;
                            } else {
                              return `Course ${option.id}`;
                            }
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          }
                          onChange={(event, value) => {
                            console.log("Course selected:", value);
                            field.onChange(value);
                          }}
                          loading={coursesLoading}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Course"
                              margin="normal"
                              fullWidth
                              required
                              error={!!error}
                              helperText={
                                error
                                  ? error.message
                                  : "Choose the course for this assignment"
                              }
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {coursesLoading ? (
                                      <CircularProgress
                                        color="inherit"
                                        size={20}
                                      />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={createAssignmentMutation.isPending}
                >
                  {createAssignmentMutation.isPending
                    ? "Creating..."
                    : "Create Assignment"}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default FacultyDashboardPage;
