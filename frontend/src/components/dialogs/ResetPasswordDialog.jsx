// src/components/dialogs/ResetPasswordDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const ResetPasswordDialog = ({
  open,
  onClose,
  faculty,
  onResetPassword,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    onResetPassword({
      facultyId: faculty.id,
      newPassword: data.newPassword,
    });
  };

  // Password strength validation
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    if (!minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase)
      return "Password must contain at least one uppercase letter";
    if (!hasLowerCase)
      return "Password must contain at least one lowercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar)
      return "Password must contain at least one special character (@$!%*?&)";

    return true;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 8, // Set a valid elevation (0-24)
      }}
    >
      <DialogTitle>Reset Password for {faculty?.fullName}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Set a new password for <strong>{faculty?.fullName}</strong> (
              {faculty?.email})
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3 }}>
            Password must contain:
            <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
              <li>One special character (@$!%*?&)</li>
            </ul>
          </Alert>

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            label="New Password"
            margin="normal"
            {...register("newPassword", {
              required: "New password is required",
              validate: validatePassword,
            })}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm New Password"
            margin="normal"
            {...register("confirmPassword", {
              required: "Please confirm the password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ResetPasswordDialog;
