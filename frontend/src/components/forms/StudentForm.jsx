// src/components/forms/StudentForm.jsx
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
import { useCreateStudent, useUpdateStudent } from "../../hooks/useStudents";
import { useGetDepartments } from "../../hooks/useDepartments";
import { useGetSemesters } from "../../hooks/useSemesters";
import { useGetDivisions } from "../../hooks/useDivisions";
import { toast } from "react-hot-toast";

const StudentForm = ({ onClose, student }) => {
  const isEdit = !!student;
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: isEdit
      ? {
          fullName: student.fullName || "",
          enrollmentNumber: student.enrollmentNumber || "",
          batch: student.batch || "",
          email: student.user?.email || "",
          department: student.department || null,
          semester: student.semester || null,
          division: student.division || null,
        }
      : {
          fullName: "",
          enrollmentNumber: "",
          batch: "",
          email: "",
          password: "",
          department: null,
          semester: null,
          division: null,
        },
  });

  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const { data: semestersData, isLoading: semestersLoading } =
    useGetSemesters();
  const { data: divisionsData, isLoading: divisionsLoading } =
    useGetDivisions();
  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();

  useEffect(() => {
    if (isEdit && student) {
      reset({
        fullName: student.fullName || "",
        enrollmentNumber: student.enrollmentNumber || "",
        batch: student.batch || "",
        email: student.user?.email || "",
        department: student.department || null,
        semester: student.semester || null,
        division: student.division || null,
      });
    } else {
      reset({
        fullName: "",
        enrollmentNumber: "",
        batch: "",
        email: "",
        password: "",
        department: null,
        semester: null,
        division: null,
      });
    }
  }, [isEdit, student, reset]);

  const onSubmit = (data) => {
    const submitData = {
      ...data,
      departmentId: data.department?.id,
      semesterId: data.semester?.id,
      divisionId: data.division?.id,
      // The backend does not allow updating enrollmentNumber or email.
      // We also don't need to send password on update.
    };

    if (isEdit) {
      // Remove fields not allowed for update
      delete submitData.enrollmentNumber;
      delete submitData.email;
      delete submitData.password;

      updateMutation.mutate(
        { studentId: student.id, studentData: submitData },
        {
          onSuccess: () => {
            toast.success("Student updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update failed:", error.response?.data || error);
            toast.error(
              `Failed to update student: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Student created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Creation failed:", error.response?.data || error);
          toast.error(
            `Failed to create student: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  const departments = departmentsData?.data?.departments?.data || [];
  const semesters = semestersData?.data?.semesters?.data || [];
  const divisions = divisionsData?.data?.divisions?.data || [];

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{isEdit ? "Update Student" : "Create Student"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="normal"
          fullWidth
          label="Full Name"
          {...register("fullName")}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Enrollment Number"
          {...register("enrollmentNumber")}
          required
          disabled={isEdit}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          type="email"
          {...register("email")}
          required
          disabled={isEdit}
        />
        {!isEdit && (
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            {...register("password")}
            required
          />
        )}
        <TextField
          margin="normal"
          fullWidth
          label="Batch"
          {...register("batch")}
          required
        />

        <Controller
          name="department"
          control={control}
          rules={{ required: "Department is required" }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={departments}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => field.onChange(value)}
              disabled={isEdit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Department"
                  margin="normal"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {departmentsLoading ? (
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
                option.semesterNumber && option.academicYear?.year
                  ? `Semester ${option.semesterNumber} (${option.academicYear.year})`
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
                        {semestersLoading ? (
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
              getOptionLabel={(option) => option.name || ""}
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
                        {divisionsLoading ? (
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
  );
};

export default StudentForm;
