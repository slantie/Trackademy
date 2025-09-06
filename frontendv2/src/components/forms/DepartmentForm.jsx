import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "../../hooks/useDepartments";
import { useGetColleges } from "../../hooks/useColleges";
import { showToast } from "../../utils/toast";

const DepartmentForm = ({ department, onFinished }) => {
  const isEdit = !!department;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { data: collegesData, isLoading: collegesLoading } = useGetColleges();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();

  useEffect(() => {
    if (isEdit) {
      reset({
        name: department.name,
        abbreviation: department.abbreviation,
        collegeId: department.college?.id || department.collegeId,
      });
    } else {
      reset({
        name: "",
        abbreviation: "",
        collegeId: "",
      });
    }
  }, [department, reset, isEdit]);

  const onSubmit = (data) => {
    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Department ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} department.`
        );
      },
    };

    if (isEdit) {
      mutation.mutate(
        { departmentId: department.id, departmentData: data },
        mutationOptions
      );
    } else {
      mutation.mutate(data, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || collegesLoading;
  const colleges = collegesData?.data?.colleges?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
          className="col-span-3"
        />
        {errors.name && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="abbreviation" className="text-right">
          Abbreviation
        </Label>
        <Input
          id="abbreviation"
          {...register("abbreviation", {
            required: "Abbreviation is required",
          })}
          className="col-span-3"
        />
        {errors.abbreviation && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.abbreviation.message}
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
              disabled={collegesLoading}
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

export default DepartmentForm;
