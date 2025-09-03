// src/components/forms/FacultyForm.jsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useCreateFaculty, useUpdateFaculty } from "../../hooks/useFaculties";
import { useGetDepartments } from "../../hooks/useDepartments";
import { toast } from "react-hot-toast";

const Designation = {
  HOD: "HOD",
  PROFESSOR: "PROFESSOR",
  ASST_PROFESSOR: "ASST_PROFESSOR",
  LAB_ASSISTANT: "LAB_ASSISTANT",
};

const FacultyForm = ({ onClose, faculty }) => {
  const isEdit = !!faculty;
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: isEdit
      ? {
          fullName: faculty.fullName || "",
          email: faculty.user?.email || "",
          abbreviation: faculty.abbreviation || "",
          designation: faculty.designation || "PROFESSOR",
          department: faculty.department || null,
        }
      : {
          fullName: "",
          email: "",
          password: "",
          abbreviation: "",
          designation: "PROFESSOR",
          department: null,
        },
  });

  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const createMutation = useCreateFaculty();
  const updateMutation = useUpdateFaculty();

  useEffect(() => {
    if (isEdit && faculty) {
      reset({
        fullName: faculty.fullName || "",
        email: faculty.user?.email || "",
        abbreviation: faculty.abbreviation || "",
        designation: faculty.designation || "PROFESSOR",
        department: faculty.department || null,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
        abbreviation: "",
        designation: "PROFESSOR",
        department: null,
      });
    }
  }, [isEdit, faculty, reset]);

  const onSubmit = (data) => {
    // Clean the data - remove any null or undefined values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value != null)
    );

    if (isEdit) {
      // For update, prepare only the fields that can be updated
      const updateData = {
        fullName: cleanData.fullName,
        abbreviation: cleanData.abbreviation,
        designation: cleanData.designation,
      };

      // Remove any undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      updateMutation.mutate(
        { facultyId: faculty.id, facultyData: updateData },
        {
          onSuccess: () => {
            toast.success("Faculty updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update failed:", error.response?.data || error);
            toast.error(
              `Failed to update faculty: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      // For create, prepare the submission data
      const createData = {
        fullName: cleanData.fullName,
        email: cleanData.email,
        password: cleanData.password,
        abbreviation: cleanData.abbreviation,
        designation: cleanData.designation,
        departmentId: cleanData.department?.id,
      };

      // Remove any undefined values
      Object.keys(createData).forEach((key) => {
        if (createData[key] === undefined) {
          delete createData[key];
        }
      });

      createMutation.mutate(createData, {
        onSuccess: () => {
          toast.success("Faculty created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Creation failed:", error.response?.data || error);
          toast.error(
            `Failed to create faculty: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  const departments = departmentsData?.data?.departments?.data || [];
  const designations = Object.values(Designation);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{isEdit ? "Update Faculty" : "Create Faculty"}</DialogTitle>
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
          label="Email"
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
          label="Abbreviation"
          {...register("abbreviation")}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Designation</InputLabel>
          <Controller
            name="designation"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Designation">
                {designations.map((designation) => (
                  <MenuItem key={designation} value={designation}>
                    {designation}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>
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

export default FacultyForm;
