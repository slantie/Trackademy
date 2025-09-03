// src/components/forms/SubjectForm.jsx
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
import { useCreateSubject, useUpdateSubject } from "../../hooks/useSubjects";
import { useGetDepartments } from "../../hooks/useDepartments";
import { toast } from "react-hot-toast";

const SubjectForm = ({ onClose, subject }) => {
  const isEdit = !!subject;
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: isEdit
      ? {
          name: subject.name || "",
          abbreviation: subject.abbreviation || "",
          code: subject.code || "",
          semesterNumber: subject.semesterNumber || 0,
          type: subject.type || "MANDATORY",
          department: subject.department || null,
        }
      : {
          name: "",
          abbreviation: "",
          code: "",
          semesterNumber: 0,
          type: "MANDATORY",
          department: null,
        },
  });

  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();

  useEffect(() => {
    if (isEdit && subject) {
      reset({
        name: subject.name || "",
        abbreviation: subject.abbreviation || "",
        code: subject.code || "",
        semesterNumber: subject.semesterNumber || 0,
        type: subject.type || "MANDATORY",
        department: subject.department || null,
      });
    } else {
      reset({
        name: "",
        abbreviation: "",
        code: "",
        semesterNumber: 0,
        type: "MANDATORY",
        department: null,
      });
    }
  }, [isEdit, subject, reset]);

  const onSubmit = (data) => {
    // Clean the data - remove any null or undefined values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value != null)
    );

    if (isEdit) {
      // For update, prepare only the fields that can be updated
      const updateData = {
        name: cleanData.name,
        abbreviation: cleanData.abbreviation,
        semesterNumber: parseInt(cleanData.semesterNumber) || 0,
        type: cleanData.type,
      };

      // Remove any undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      updateMutation.mutate(
        { subjectId: subject.id, subjectData: updateData },
        {
          onSuccess: () => {
            toast.success("Subject updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update failed:", error.response?.data || error);
            toast.error(
              `Failed to update subject: ${
                error.response?.data?.message || error.message
              }`
            );
          },
        }
      );
    } else {
      // For create, prepare the submission data
      const createData = {
        name: cleanData.name,
        abbreviation: cleanData.abbreviation,
        code: cleanData.code,
        semesterNumber: parseInt(cleanData.semesterNumber) || 0,
        type: cleanData.type,
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
          toast.success("Subject created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Creation failed:", error.response?.data || error);
          toast.error(
            `Failed to create subject: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      });
    }
  };

  const departments = departmentsData?.data?.departments?.data || [];

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{isEdit ? "Update Subject" : "Create Subject"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="normal"
          fullWidth
          label="Name"
          {...register("name")}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Abbreviation"
          {...register("abbreviation")}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Code"
          {...register("code")}
          required
          disabled={isEdit}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Semester Number"
          type="number"
          {...register("semesterNumber", { valueAsNumber: true })}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Type">
                <MenuItem value="MANDATORY">MANDATORY</MenuItem>
                <MenuItem value="ELECTIVE">ELECTIVE</MenuItem>
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

export default SubjectForm;
