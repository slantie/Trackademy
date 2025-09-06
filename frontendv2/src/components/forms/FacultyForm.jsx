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
import { useCreateFaculty, useUpdateFaculty } from "../../hooks/useFaculties";
import { useGetDepartments } from "../../hooks/useDepartments";
import { showToast } from "../../utils/toast";

const DESIGNATIONS = ["HOD", "PROFESSOR", "ASST_PROFESSOR", "LAB_ASSISTANT"];

const FacultyForm = ({ faculty, onFinished }) => {
  const isEdit = !!faculty;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const createMutation = useCreateFaculty();
  const updateMutation = useUpdateFaculty();

  useEffect(() => {
    if (isEdit) {
      reset({
        fullName: faculty.fullName,
        email: faculty.user?.email,
        abbreviation: faculty.abbreviation,
        designation: faculty.designation,
        departmentId: faculty.department?.id || faculty.departmentId,
      });
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
        abbreviation: "",
        designation: "PROFESSOR",
        departmentId: "",
      });
    }
  }, [faculty, reset, isEdit]);

  const onSubmit = (data) => {
    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Faculty ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} faculty.`
        );
      },
    };

    if (isEdit) {
      const updateData = {
        fullName: data.fullName,
        abbreviation: data.abbreviation,
        designation: data.designation,
      };
      mutation.mutate(
        { facultyId: faculty.id, facultyData: updateData },
        mutationOptions
      );
    } else {
      mutation.mutate(data, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || departmentsLoading;
  const departments = departmentsData?.data?.departments?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fullName" className="text-right">
          Full Name
        </Label>
        <Input
          id="fullName"
          {...register("fullName", { required: "Full name is required" })}
          className="col-span-3"
        />
        {errors.fullName && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.fullName.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
          className="col-span-3"
          disabled={isEdit}
        />
        {errors.email && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.email.message}
          </p>
        )}
      </div>
      {!isEdit && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="col-span-3"
          />
          {errors.password && (
            <p className="col-span-4 text-red-500 text-sm text-right">
              {errors.password.message}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="abbreviation" className="text-right">
          Abbreviation
        </Label>
        <Input
          id="abbreviation"
          {...register("abbreviation")}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="designation" className="text-right">
          Designation
        </Label>
        <Controller
          name="designation"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DESIGNATIONS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="departmentId" className="text-right">
          Department
        </Label>
        <Controller
          name="departmentId"
          control={control}
          rules={{ required: "Department is required" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={departmentsLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.departmentId && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.departmentId.message}
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

export default FacultyForm;
