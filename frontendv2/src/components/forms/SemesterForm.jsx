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
import { useCreateSemester, useUpdateSemester } from "../../hooks/useSemesters";
import { useGetDepartments } from "../../hooks/useDepartments";
import { useGetAcademicYears } from "../../hooks/useAcademicYears";
import { showToast } from "../../utils/toast";

const SemesterForm = ({ semester, onFinished }) => {
  const isEdit = !!semester;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  // Fetch related data for dropdowns
  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const { data: academicYearsData, isLoading: yearsLoading } =
    useGetAcademicYears();

  const createMutation = useCreateSemester();
  const updateMutation = useUpdateSemester();

  useEffect(() => {
    if (isEdit) {
      reset({
        semesterNumber: semester.semesterNumber,
        semesterType: semester.semesterType,
        departmentId: semester.department?.id || semester.departmentId,
        academicYearId: semester.academicYear?.id || semester.academicYearId,
      });
    } else {
      reset({
        semesterNumber: "",
        semesterType: "ODD",
        departmentId: "",
        academicYearId: "",
      });
    }
  }, [semester, reset, isEdit]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      semesterNumber: parseInt(data.semesterNumber, 10),
    };

    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Semester ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} semester.`
        );
      },
    };

    if (isEdit) {
      // Only semesterType is updatable as per original logic
      const updateData = { semesterType: processedData.semesterType };
      mutation.mutate(
        { semesterId: semester.id, semesterData: updateData },
        mutationOptions
      );
    } else {
      mutation.mutate(processedData, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    departmentsLoading ||
    yearsLoading;
  const departments = departmentsData?.data?.departments?.data || [];
  const academicYears = academicYearsData?.data?.academicYears || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
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
          disabled={isEdit}
        />
        {errors.semesterNumber && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.semesterNumber.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="semesterType" className="text-right">
          Type
        </Label>
        <Controller
          name="semesterType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ODD">Odd</SelectItem>
                <SelectItem value="EVEN">Even</SelectItem>
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

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="academicYearId" className="text-right">
          Academic Year
        </Label>
        <Controller
          name="academicYearId"
          control={control}
          rules={{ required: "Please select an academic year" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={yearsLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a year..." />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.academicYearId && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.academicYearId.message}
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

export default SemesterForm;
