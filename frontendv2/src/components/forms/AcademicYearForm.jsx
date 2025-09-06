import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateAcademicYear,
  useUpdateAcademicYear,
} from "../../hooks/useAcademicYears";
import { useGetColleges } from "../../hooks/useColleges";
import { showToast } from "../../utils/toast";

const AcademicYearForm = ({ academicYear, onFinished }) => {
  const isEdit = !!academicYear;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { data: collegesData, isLoading: collegesLoading } = useGetColleges();
  const createMutation = useCreateAcademicYear();
  const updateMutation = useUpdateAcademicYear();

  useEffect(() => {
    if (isEdit) {
      reset({
        year: academicYear.year,
        isActive: academicYear.isActive,
        collegeId: academicYear.college?.id || academicYear.collegeId,
      });
    } else {
      reset({
        year: "",
        isActive: false,
        collegeId: "",
      });
    }
  }, [academicYear, reset, isEdit]);

  const onSubmit = (data) => {
    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Academic Year ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} year.`
        );
      },
    };

    if (isEdit) {
      // For updates, only send year and isActive as per original logic
      const updateData = { year: data.year, isActive: data.isActive };
      mutation.mutate(
        { yearId: academicYear.id, yearData: updateData },
        mutationOptions
      );
    } else {
      const createData = {
        year: data.year,
        isActive: data.isActive,
        collegeId: data.collegeId,
      };
      mutation.mutate(createData, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || collegesLoading;
  const colleges = collegesData?.data?.colleges?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="year" className="text-right">
          Year
        </Label>
        <Input
          id="year"
          {...register("year", {
            required: "Year is required",
            pattern: {
              value: /^\d{4}-\d{4}$/,
              message: "Format must be YYYY-YYYY",
            },
          })}
          className="col-span-3"
          placeholder="e.g., 2024-2025"
        />
        {errors.year && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.year.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="collegeId" className="text-right">
          College
        </Label>
        <Controller
          name="collegeId"
          control={control}
          rules={{ required: "Please select a college" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={collegesLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a college..." />
              </SelectTrigger>
              <SelectContent>
                {colleges.map((college) => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.collegeId && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.collegeId.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isActive" className="text-right">
          Set as Active
        </Label>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Switch
              id="isActive"
              checked={field.value}
              onCheckedChange={field.onChange}
              className="col-span-3"
            />
          )}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          )}
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default AcademicYearForm;
