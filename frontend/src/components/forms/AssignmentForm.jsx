// src/components/forms/AssignmentForm.jsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  DialogContent,
  DialogActions,
  DialogTitle,
  Autocomplete,
} from "@mui/material";
import {
  useCreateAssignment,
  useUpdateAssignment,
} from "../../hooks/useAssignments";
import { useGetCourses } from "../../hooks/useCourses";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const AssignmentForm = ({ onClose, assignment }) => {
  const isEdit = !!assignment;
  const { user } = useAuth();

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: isEdit
      ? {
          title: assignment.title || "",
          description: assignment.description || "",
          totalMarks: assignment.totalMarks || 0,
          dueDate: dayjs(assignment.dueDate) || null,
          course: assignment.course || null,
        }
      : {
          title: "",
          description: "",
          totalMarks: 0,
          dueDate: dayjs().add(1, "day"),
          course: null,
        },
  });

  // Fetch ALL courses first (without faculty filter)
  const { data: allCoursesData, isLoading: coursesLoading } = useGetCourses();

  // Also fetch courses specifically for this faculty
  const { data: facultyCoursesData } = useGetCourses({
    facultyUserId: user?.id,
  });

  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();

  console.log("AssignmentForm - User:", user);
  console.log("AssignmentForm - All courses response:", allCoursesData);
  console.log("AssignmentForm - Faculty courses response:", facultyCoursesData);
  console.log("AssignmentForm - Courses loading:", coursesLoading);

  useEffect(() => {
    if (isEdit && assignment) {
      reset({
        title: assignment.title || "",
        description: assignment.description || "",
        totalMarks: assignment.totalMarks || 0,
        dueDate: dayjs(assignment.dueDate) || null,
        course: assignment.course || null,
      });
    } else {
      reset({
        title: "",
        description: "",
        totalMarks: 0,
        dueDate: dayjs().add(1, "day"),
        course: null,
      });
    }
  }, [isEdit, assignment, reset]);

  const onSubmit = (data) => {
    const submitData = {
      ...data,
      dueDate: data.dueDate?.toISOString(),
      courseId: data.course?.id,
      course: undefined,
    };

    // Remove undefined values to avoid backend errors
    Object.keys(submitData).forEach(
      (key) => submitData[key] === undefined && delete submitData[key]
    );

    if (isEdit) {
      // Prevent courseId from being updated
      delete submitData.courseId;

      updateMutation.mutate(
        { id: assignment.id, assignmentData: submitData },
        {
          onSuccess: () => {
            toast.success("Assignment updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update failed:", error.response?.data || error);
            toast.error(
              `Failed to update assignment: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Assignment created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Creation failed:", error.response?.data || error);
          toast.error(
            `Failed to create assignment: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  // Extract all courses
  const allCourses =
    allCoursesData?.data?.courses?.data ||
    allCoursesData?.data?.courses ||
    allCoursesData?.data ||
    [];

  // Extract faculty courses (courses assigned to this faculty)
  const facultyCourses =
    facultyCoursesData?.data?.courses?.data ||
    facultyCoursesData?.data?.courses ||
    facultyCoursesData?.data ||
    [];

  // For assignment creation, show only courses assigned to this faculty
  // If no faculty courses, show all courses as fallback
  const courses = facultyCourses.length > 0 ? facultyCourses : allCourses;

  console.log("All courses:", allCourses.length);
  console.log("Faculty courses:", facultyCourses.length);
  console.log("Courses data for Autocomplete:", courses);
  console.log("Courses array length:", courses.length);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEdit ? "Update Assignment" : "Create Assignment"}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="normal"
            fullWidth
            label="Title"
            {...register("title")}
            required
          />
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            multiline
            rows={4}
            {...register("description")}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Total Marks"
            type="number"
            {...register("totalMarks", { valueAsNumber: true })}
            required
          />

          <Controller
            name="dueDate"
            control={control}
            rules={{ required: "Due date is required" }}
            render={({ field }) => (
              <DateTimePicker
                label="Due Date"
                {...field}
                sx={{ mt: 2 }}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            )}
          />

          <Controller
            name="course"
            control={control}
            rules={{ required: "Course is required" }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={courses}
                getOptionLabel={(option) =>
                  option.subject?.name && option.division?.name
                    ? `${option.subject.name} (${option.division.name})`
                    : ""
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => field.onChange(value)}
                disabled={isEdit}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Course"
                    margin="normal"
                    fullWidth
                    required
                    error={!!error}
                    helperText={error ? error.message : null}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {coursesLoading ? (
                            <CircularProgress color="inherit" size={20} />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isLoading || updateMutation.isLoading}
          >
            {createMutation.isLoading || updateMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : isEdit ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Box>
    </LocalizationProvider>
  );
};

export default AssignmentForm;
