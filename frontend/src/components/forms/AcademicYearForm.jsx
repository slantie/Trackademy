// src/components/forms/AcademicYearForm.jsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  DialogContent,
  DialogActions,
  DialogTitle,
  Autocomplete,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  useCreateAcademicYear,
  useUpdateAcademicYear,
} from "../../hooks/useAcademicYears";
import { useGetColleges } from "../../hooks/useColleges";
import { toast } from "react-hot-toast";

const AcademicYearForm = ({ onClose, academicYear }) => {
  const isEdit = !!academicYear;
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: isEdit
      ? {
          ...academicYear,
          college: academicYear.college || null,
        }
      : {
          year: "",
          college: null,
          isActive: false,
        },
  });

  const { data: collegesData, isLoading: collegesLoading } = useGetColleges();
  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  useEffect(() => {
    if (isEdit) {
      reset({
        year: academicYear?.year || "",
        college: academicYear?.college || null,
        isActive: academicYear?.isActive || false,
      });
    } else {
      reset({
        year: "",
        college: null,
        isActive: false,
      });
    }
  }, [isEdit, academicYear, reset]);

  const onSubmit = (data) => {

    if (isEdit) {
      // For updates, only send allowed fields (year and isActive)
      const updateData = {
        year: data.year,
        isActive: data.isActive,
      };


      updateMutation.mutate(
        { yearId: academicYear.id, yearData: updateData },
        {
          onSuccess: () => {
            toast.success("Academic Year updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update error:", error);
            toast.error(
              "Failed to update academic year: " +
                (error.response?.data?.message || error.message)
            );
          },
        }
      );
    } else {
      // For creation, send collegeId and other fields
      const createData = {
        year: data.year,
        collegeId: data.college?.id,
        isActive: data.isActive,
      };


      createMutation.mutate(createData, {
        onSuccess: () => {
          toast.success("Academic Year created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Create error:", error);
          toast.error(
            "Failed to create academic year: " +
              (error.response?.data?.message || error.message)
          );
        },
      });
    }
  };

  const colleges = collegesData?.data?.colleges?.data || [];

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {isEdit ? "Update Academic Year" : "Create Academic Year"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Year (e.g., 2025-2026)"
          {...register("year")}
          required
        />
        <Controller
          name="college"
          control={control}
          rules={{ required: !isEdit ? "College is required" : false }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={colleges}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => field.onChange(value)}
              disabled={isEdit} // Disable college selection during edit
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="College"
                  margin="normal"
                  fullWidth
                  required={!isEdit}
                  error={!!error}
                  helperText={
                    error
                      ? error.message
                      : isEdit
                      ? "College cannot be changed during edit"
                      : null
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {collegesLoading ? (
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
        <FormControlLabel
          control={
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          }
          label="Set as Active"
          sx={{ mt: 2 }}
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

export default AcademicYearForm;
