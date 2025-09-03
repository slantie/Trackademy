// src/components/forms/DivisionForm.jsx
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
import { useCreateDivision, useUpdateDivision } from "../../hooks/useDivisions";
import { useGetSemesters } from "../../hooks/useSemesters";
import { toast } from "react-hot-toast";

const DivisionForm = ({ onClose, division }) => {
  const isEdit = !!division;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: isEdit
      ? {
          name: division.name || "",
          semester: division.semester || null,
        }
      : {
          name: "",
          semester: null,
        },
  });

  const { data: semestersData, isLoading: semestersLoading } =
    useGetSemesters();
  const createMutation = useCreateDivision();
  const updateMutation = useUpdateDivision();

  useEffect(() => {
    if (isEdit && division) {
      reset({
        name: division.name || "",
        semester: division.semester || null,
      });
    } else {
      reset({
        name: "",
        semester: null,
      });
    }
  }, [isEdit, division, reset]);

  const onSubmit = (data) => {
    if (!data.semester) {
      toast.error("Please select a semester");
      return;
    }

    const submitData = {
      name: data.name.trim(),
      semesterId: data.semester.id,
    };

    console.log("Submitting division data:", submitData);

    if (isEdit) {
      updateMutation.mutate(
        { divisionId: division.id, divisionData: submitData },
        {
          onSuccess: (response) => {
            console.log("Division updated successfully:", response);
            toast.success("Division updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update failed:", error.response?.data || error);
            toast.error(
              `Failed to update division: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: (response) => {
          console.log("Division created successfully:", response);
          toast.success("Division created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Creation failed:", error.response?.data || error);
          toast.error(
            `Failed to create division: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  const semesters = semestersData?.data?.semesters || [];
  console.log("Semesters data for Autocomplete:", semesters);
  console.log("Raw semesters response:", semestersData);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ minWidth: 400 }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {isEdit ? "Update Division" : "Create New Division"}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <TextField
          margin="normal"
          fullWidth
          label="Division Name"
          {...register("name", {
            required: "Division name is required",
            minLength: {
              value: 1,
              message: "Division name must be at least 1 character",
            },
            maxLength: {
              value: 10,
              message: "Division name must be less than 10 characters",
            },
          })}
          error={!!errors.name}
          helperText={
            errors.name
              ? errors.name.message
              : "Enter a single letter or short name (e.g., A, B, P)"
          }
          required
        />
        <Controller
          name="semester"
          control={control}
          rules={{ required: "Semester is required" }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={semesters}
              getOptionLabel={(option) => {
                if (!option) return "";
                const semesterNum = option.semesterNumber || "N/A";
                const semesterType = option.semesterType || "";
                const year = option.academicYear?.year || "N/A";
                const dept = option.department?.abbreviation || "N/A";
                return `Semester ${semesterNum} (${semesterType}) - ${year} - ${dept}`;
              }}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
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
                  helperText={
                    error
                      ? error.message
                      : "Select the semester for this division"
                  }
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
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={createMutation.isLoading || updateMutation.isLoading}
          sx={{ minWidth: 100 }}
        >
          {createMutation.isLoading || updateMutation.isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : isEdit ? (
            "Update Division"
          ) : (
            "Create Division"
          )}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default DivisionForm;
