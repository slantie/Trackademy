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
import { useGetFacultyCourses } from "../../hooks/useCourses";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const AssignmentForm = ({ onClose, assignment }) => {
  const isEdit = !!assignment;
  const { user } = useAuth();

  const { register, handleSubmit, reset, control, watch } = useForm({
    defaultValues: isEdit
      ? {
          title: assignment.title || "",
          description: assignment.description || "",
          totalMarks: assignment.totalMarks || 0,
          dueDate: dayjs(assignment.dueDate) || null,
          subject: assignment.course?.subject || null,
          semester: assignment.course?.semester || null,
          division: assignment.course?.division || null,
          course: assignment.course || null,
        }
      : {
          title: "",
          description: "",
          totalMarks: 0,
          dueDate: dayjs().add(1, "day"),
          subject: null,
          semester: null,
          division: null,
          course: null,
        },
  });

  // Fetch faculty's courses to get available subjects, semesters, and divisions
  const { data: facultyCoursesData, isLoading: facultyCoursesLoading } =
    useGetFacultyCourses(user?.id);

  // Extract faculty courses
  const facultyCourses = facultyCoursesData?.data?.courses || [];

  // Watch for form changes to implement cascading filters
  const selectedSubject = watch("subject");
  const selectedSemester = watch("semester");
  const selectedDivision = watch("division");

  // Smart cascading filtering logic
  // 1. Get unique subjects from all faculty courses
  const availableSubjects = facultyCourses.reduce((acc, course) => {
    if (course.subject && !acc.find((s) => s.id === course.subject.id)) {
      acc.push(course.subject);
    }
    return acc;
  }, []);

  // 2. Filter semesters based on selected subject
  const availableSemesters = facultyCourses
    .filter(
      (course) => !selectedSubject || course.subject?.id === selectedSubject?.id
    )
    .reduce((acc, course) => {
      if (course.semester && !acc.find((s) => s.id === course.semester.id)) {
        acc.push(course.semester);
      }
      return acc;
    }, []);

  // 3. Filter divisions based on selected subject and semester
  const availableDivisions = facultyCourses
    .filter((course) => {
      const subjectMatch =
        !selectedSubject || course.subject?.id === selectedSubject?.id;
      const semesterMatch =
        !selectedSemester || course.semester?.id === selectedSemester?.id;
      return subjectMatch && semesterMatch;
    })
    .reduce((acc, course) => {
      if (course.division && !acc.find((d) => d.id === course.division.id)) {
        acc.push(course.division);
      }
      return acc;
    }, []);

  // 4. Filter courses based on all selections - this gives the final course options
  const availableCourses = facultyCourses.filter((course) => {
    const subjectMatch =
      !selectedSubject || course.subject?.id === selectedSubject?.id;
    const semesterMatch =
      !selectedSemester || course.semester?.id === selectedSemester?.id;
    const divisionMatch =
      !selectedDivision || course.division?.id === selectedDivision?.id;
    return subjectMatch && semesterMatch && divisionMatch;
  });

  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();

  console.log("AssignmentForm - User:", user);
  console.log("AssignmentForm - Faculty courses data:", facultyCoursesData);
  console.log("AssignmentForm - Available subjects:", availableSubjects);
  console.log("AssignmentForm - Available semesters:", availableSemesters);
  console.log("AssignmentForm - Available divisions:", availableDivisions);
  console.log("AssignmentForm - Available courses:", availableCourses);
  console.log("AssignmentForm - Selected filters:", {
    selectedSubject,
    selectedSemester,
    selectedDivision,
  });

  useEffect(() => {
    if (isEdit && assignment) {
      reset({
        title: assignment.title || "",
        description: assignment.description || "",
        totalMarks: assignment.totalMarks || 0,
        dueDate: dayjs(assignment.dueDate) || null,
        subject: assignment.course?.subject || null,
        semester: assignment.course?.semester || null,
        division: assignment.course?.division || null,
        course: assignment.course || null,
      });
    } else {
      reset({
        title: "",
        description: "",
        totalMarks: 0,
        dueDate: dayjs().add(1, "day"),
        subject: null,
        semester: null,
        division: null,
        course: null,
      });
    }
  }, [isEdit, assignment, reset]);

  const onSubmit = (data) => {
    const submitData = {
      ...data,
      dueDate: data.dueDate?.toISOString(),
      courseId: data.course?.id,
      // Remove the filter objects
      subject: undefined,
      semester: undefined,
      division: undefined,
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

  // Use the filtered data based on faculty's courses
  const subjects = availableSubjects;
  const semesters = availableSemesters;
  const divisions = availableDivisions;
  const courses = availableCourses;

  console.log("Subjects:", subjects.length);
  console.log("Semesters:", semesters.length);
  console.log("Divisions:", divisions.length);
  console.log("Courses:", courses.length);

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
            name="subject"
            control={control}
            rules={{ required: "Subject is required" }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={subjects}
                getOptionLabel={(option) =>
                  option.name ? `${option.name} (${option.code})` : ""
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => field.onChange(value)}
                disabled={isEdit}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subject"
                    margin="normal"
                    fullWidth
                    required
                    error={!!error}
                    helperText={error ? error.message : null}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {facultyCoursesLoading ? (
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
                    ? `${option.subject.name} - ${option.division.name} (${
                        option.semester?.semesterNumber || ""
                      })`
                    : ""
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => field.onChange(value)}
                disabled={isEdit}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Final Course Selection"
                    margin="normal"
                    fullWidth
                    required
                    error={!!error}
                    helperText={
                      error
                        ? error.message
                        : "Select subject, semester, and division first to filter courses"
                    }
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {facultyCoursesLoading ? (
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

          <Controller
            name="semester"
            control={control}
            rules={{ required: "Semester is required" }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={semesters}
                getOptionLabel={(option) =>
                  option.semesterNumber
                    ? `Semester ${option.semesterNumber} (${
                        option.department?.abbreviation || ""
                      })`
                    : ""
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => field.onChange(value)}
                disabled={isEdit}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Semester"
                    margin="normal"
                    fullWidth
                    required
                    error={!!error}
                    helperText={error ? error.message : null}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {facultyCoursesLoading ? (
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

          <Controller
            name="division"
            control={control}
            rules={{ required: "Division is required" }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={divisions}
                getOptionLabel={(option) => (option.name ? option.name : "")}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event, value) => field.onChange(value)}
                disabled={isEdit}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Division"
                    margin="normal"
                    fullWidth
                    required
                    error={!!error}
                    helperText={error ? error.message : null}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {facultyCoursesLoading ? (
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
