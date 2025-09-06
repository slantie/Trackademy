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
import { useCreateSubject, useUpdateSubject } from "../../hooks/useSubjects";
import { useGetDepartments } from "../../hooks/useDepartments";
import { showToast } from "../../utils/toast";

const SubjectForm = ({ subject, onFinished }) => {
  const isEdit = !!subject;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();

  useEffect(() => {
    if (isEdit) {
      reset({
        name: subject.name,
        abbreviation: subject.abbreviation,
        code: subject.code,
        semesterNumber: subject.semesterNumber,
        type: subject.type,
        departmentId: subject.department?.id || subject.departmentId,
      });
    } else {
      reset({
        name: "",
        abbreviation: "",
        code: "",
        semesterNumber: "",
        type: "MANDATORY",
        departmentId: "",
      });
    }
  }, [subject, reset, isEdit]);

  const onSubmit = (data) => {
    // Ensure semesterNumber is an integer
    const processedData = {
      ...data,
      semesterNumber: parseInt(data.semesterNumber, 10),
    };

    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Subject ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} subject.`
        );
      },
    };

    if (isEdit) {
      // In edit mode, some fields might be immutable on the backend
      const updateData = {
        name: processedData.name,
        abbreviation: processedData.abbreviation,
        semesterNumber: processedData.semesterNumber,
        type: processedData.type,
      };
      mutation.mutate(
        { subjectId: subject.id, subjectData: updateData },
        mutationOptions
      );
    } else {
      mutation.mutate(processedData, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || departmentsLoading;
  const departments = departmentsData?.data?.departments?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
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
        <Label htmlFor="code" className="text-right">
          Code
        </Label>
        <Input
          id="code"
          {...register("code", { required: "Code is required" })}
          className="col-span-3"
          disabled={isEdit}
        />
        {errors.code && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.code.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="semesterNumber" className="text-right">
          Semester
        </Label>
        <Input
          id="semesterNumber"
          type="number"
          {...register("semesterNumber", {
            required: "Semester number is required",
            valueAsNumber: true,
          })}
          className="col-span-3"
        />
        {errors.semesterNumber && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.semesterNumber.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
          Type
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANDATORY">Mandatory</SelectItem>
                <SelectItem value="ELECTIVE">Elective</SelectItem>
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
          rules={{ required: "Please select a department" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={departmentsLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a department..." />
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

export default SubjectForm;
