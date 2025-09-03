// src/components/forms/CollegeForm.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useCreateCollege, useUpdateCollege } from "../../hooks/useColleges";
import { toast } from "react-hot-toast"; // Assuming react-hot-toast is installed

const CollegeForm = ({ onClose, college }) => {
  const isEdit = !!college;

  const { register, handleSubmit, reset } = useForm({
    defaultValues: isEdit
      ? {
          name: college?.name || "",
          abbreviation: college?.abbreviation || "",
          website: college?.website || "",
          address: college?.address || "",
          contactNumber: college?.contactNumber || "",
        }
      : {
          name: "",
          abbreviation: "",
          website: "",
          address: "",
          contactNumber: "",
        },
  });

  const createMutation = useCreateCollege();
  const updateMutation = useUpdateCollege();

  useEffect(() => {
    if (isEdit && college) {
      const formData = {
        name: college.name || "",
        abbreviation: college.abbreviation || "",
        website: college.website || "",
        address: college.address || "",
        contactNumber: college.contactNumber || "",
      };
      reset(formData);
    } else {
      reset({
        name: "",
        abbreviation: "",
        website: "",
        address: "",
        contactNumber: "",
      });
    }
  }, [isEdit, college, reset]);

  const onSubmit = (data) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    if (isEdit) {
      updateMutation.mutate(
        { collegeId: college.id, collegeData: cleanedData },
        {
          onSuccess: () => {
            toast.success("College updated successfully!");
            onClose();
          },
          onError: (error) => {
            console.error("Update error:", error);
            toast.error(
              "Failed to update college: " +
                (error.response?.data?.message || error.message)
            );
          },
        }
      );
    } else {
      createMutation.mutate(cleanedData, {
        onSuccess: () => {
          toast.success("College created successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Create error:", error);
          toast.error(
            "Failed to create college: " +
              (error.response?.data?.message || error.message)
          );
        },
      });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{isEdit ? "Update College" : "Create College"}</DialogTitle>
      <DialogContent>
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
          label="Website"
          {...register("website")}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Address"
          {...register("address")}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Contact Number"
          {...register("contactNumber")}
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

export default CollegeForm;
