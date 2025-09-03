// src/components/forms/SemesterForm.jsx
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
import { useCreateSemester, useUpdateSemester } from "../../hooks/useSemesters";
import { useGetDepartments } from "../../hooks/useDepartments";
import { useGetAcademicYears } from "../../hooks/useAcademicYears";
import { toast } from "react-hot-toast";

const SemesterType = {
  ODD: "ODD",
  EVEN: "EVEN",
};

const SemesterForm = ({ onClose, semester }) => {
  const isEdit = !!semester;
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: isEdit
      ? {
          semesterNumber: semester.semesterNumber || 0,
          semesterType: semester.semesterType || "ODD",
          department: semester.department || null,
          academicYear: semester.academicYear || null,
        }
      : {
          semesterNumber: 0,
          semesterType: "ODD",
          department: null,
          academicYear: null,
        },
  });

  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const { data: academicYearsData, isLoading: academicYearsLoading } =
    useGetAcademicYears();
  const createMutation = useCreateSemester();
  const updateMutation = useUpdateSemester();

  useEffect(() => {
    if (isEdit && semester) {
      reset({
        semesterNumber: semester.semesterNumber || 0,
        semesterType: semester.semesterType || "ODD",
        department: semester.department || null,
        academicYear: semester.academicYear || null,
      });
    } else {
      reset({
        semesterNumber: 0,
        semesterType: "ODD",
        department: null,
        academicYear: null,
      });
    }
  }, [isEdit, semester, reset]);

  const onSubmit = (data) => {

    // Clean the data - remove any null or undefined values and non-essential fields
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value != null)
    );


    const submitData = {
      semesterNumber: parseInt(cleanData.semesterNumber) || 0,
      semesterType: cleanData.semesterType,
      departmentId: cleanData.department?.id,
      academicYearId: cleanData.academicYear?.id,
    };

    // Remove any undefined values
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === undefined) {
        delete submitData[key];
      }
    });


    if (isEdit) {
      // For update, only send the fields that should be updated
      const updateData = {
        semesterType: submitData.semesterType,
      };


      updateMutation.mutate(
        { semesterId: semester.id, semesterData: updateData },
        {
          onSuccess: () => {
            toast.success("Semester updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update failed:", error.response?.data || error);
            toast.error(
              `Failed to update semester: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Semester created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Creation failed:", error.response?.data || error);
          toast.error(
            `Failed to create semester: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  const departments = departmentsData?.data?.departments?.data || [];
  const academicYears = academicYearsData?.data?.academicYears || [];
  const semesterTypes = Object.values(SemesterType);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {isEdit ? "Update Semester" : "Create Semester"}
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="normal"
          fullWidth
          label="Semester Number"
          type="number"
          {...register("semesterNumber", { valueAsNumber: true })}
          required
          disabled={isEdit}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Semester Type</InputLabel>
          <Controller
            name="semesterType"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Semester Type">
                {semesterTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
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
        <Controller
          name="academicYear"
          control={control}
          rules={{ required: "Academic Year is required" }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={academicYears}
              getOptionLabel={(option) => option.year || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => field.onChange(value)}
              disabled={isEdit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Academic Year"
                  margin="normal"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error ? error.message : null}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {academicYearsLoading ? (
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

export default SemesterForm;
