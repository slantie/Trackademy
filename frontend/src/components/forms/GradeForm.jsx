// src/components/forms/GradeForm.jsx
import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import { useGradeSubmission } from "../../hooks/useSubmissions";
import { toast } from "react-hot-toast";

const GradeForm = ({ onClose, submission }) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      marksAwarded: submission?.marksAwarded || "",
      feedback: submission?.feedback || "",
    },
  });

  const gradeMutation = useGradeSubmission();

  const onSubmit = (data) => {
    const submitData = {
      marksAwarded: data.marksAwarded,
      feedback: data.feedback,
      status: "GRADED",
    };

    gradeMutation.mutate(
      { submissionId: submission.id, submissionData: submitData },
      {
        onSuccess: () => {
          toast.success("Submission graded successfully!");
          onClose();
        },
        onError: (error) => {
          console.error("Grading failed:", error.response?.data || error);
          toast.error(
            `Failed to grade submission: ${
              error.response?.data?.message || error.message
            }`
          );
        },
      }
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>Grade Submission</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="normal"
          fullWidth
          label="Marks Awarded"
          type="number"
          {...register("marksAwarded", { valueAsNumber: true })}
          required
        />
        <TextField
          margin="normal"
          fullWidth
          label="Feedback"
          multiline
          rows={4}
          {...register("feedback")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={gradeMutation.isLoading}
        >
          {gradeMutation.isLoading ? (
            <CircularProgress size={24} />
          ) : (
            "Save Grade"
          )}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default GradeForm;
