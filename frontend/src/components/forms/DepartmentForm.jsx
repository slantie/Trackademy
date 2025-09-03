// src/components/forms/DepartmentForm.jsx
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
} from "@mui/material";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "../../hooks/useDepartments";
import { useGetColleges } from "../../hooks/useColleges";
import { toast } from "react-hot-toast";

const DepartmentForm = ({ onClose, department }) => {
  const isEdit = !!department;
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: isEdit
      ? {
          name: department.name || "",
          abbreviation: department.abbreviation || "",
          college: department.college || null,
        }
      : {
          name: "",
          abbreviation: "",
          college: null,
        },
  });

  const { data: collegesData, isLoading: collegesLoading } = useGetColleges();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  useEffect(() => {
    // Reset form with new data when department prop changes
    if (isEdit && department) {
      reset({
        name: department.name || "",
        abbreviation: department.abbreviation || "",
        college: department.college || null,
      });
    } else {
      reset({ name: "", abbreviation: "", college: null });
    }
  }, [isEdit, department, reset]);

  const onSubmit = (data) => {
    // Clean data by removing undefined values and mapping college object to collegeId
    const submitData = {
      name: data.name,
      abbreviation: data.abbreviation,
      collegeId: data.college?.id,
    };

    if (isEdit) {
      updateMutation.mutate(
        { departmentId: department.id, departmentData: submitData },
        {
          onSuccess: () => {
            toast.success("Department updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update failed:", error.response?.data || error);
            toast.error(
              `Failed to update department: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      createMutation.mutate(submitData, {
        onSuccess: () => {
          toast.success("Department created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Creation failed:", error.response?.data || error);
          toast.error(
            `Failed to create department: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  const colleges = collegesData?.data?.colleges?.data || [];

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {isEdit ? "Update Department" : "Create Department"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          fullWidth
          label="Name"
          {...register("name")}
          required
          disabled={isEdit} // Disable name field on edit mode as per backend validation
        />
        <TextField
          margin="normal"
          fullWidth
          label="Abbreviation"
          {...register("abbreviation")}
          required
        />
        <Controller
          name="college"
          control={control}
          rules={{ required: "College is required" }}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              {...field}
              options={colleges}
              getOptionLabel={(option) => option.name || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="College"
                  margin="normal"
                  fullWidth
                  required
                  error={!!error}
                  helperText={error ? error.message : null}
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

export default DepartmentForm;
