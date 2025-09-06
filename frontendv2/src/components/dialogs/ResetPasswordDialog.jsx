import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { showToast } from "../../utils/toast";

const ResetPasswordDialog = ({
  faculty,
  onResetPassword,
  isLoading,
  onFinished,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    onResetPassword({
      facultyId: faculty.id,
      newPassword: data.newPassword,
    });
    showToast.success("Password reset successfully");
    reset();
  };

  const passwordValidation = {
    required: "Password is required",
    minLength: { value: 8, message: "Must be at least 8 characters" },
    pattern: {
      value:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: "Requires uppercase, lowercase, number, and special character",
    },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Set a new password for{" "}
          <span className="font-bold text-foreground">
            {faculty?.fullName}
          </span>
          .
        </p>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">New Password</Label>
        <div className="col-span-3 relative">
          <Input
            type={showPassword ? "text" : "password"}
            {...register("newPassword", passwordValidation)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.newPassword && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.newPassword.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Confirm</Label>
        <div className="col-span-3 relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div className="flex justify-end pt-4 gap-2">
        <Button type="button" variant="ghost" onClick={onFinished}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          )}
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordDialog;
