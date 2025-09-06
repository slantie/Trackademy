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
import { useCreateStudent, useUpdateStudent } from "../../hooks/useStudents";
import { useGetDepartments } from "../../hooks/useDepartments";
import { useGetSemesters } from "../../hooks/useSemesters";
import { useGetDivisions } from "../../hooks/useDivisions";
import { showToast } from "../../utils/toast";

const StudentForm = ({ student, onFinished }) => {
  const isEdit = !!student;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { _errors },
  } = useForm();

  // Fetch data for dropdowns
  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartments();
  const { data: semestersData, isLoading: semestersLoading } =
    useGetSemesters();
  const { data: divisionsData, isLoading: divisionsLoading } =
    useGetDivisions();

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();

  useEffect(() => {
    if (isEdit) {
      reset({
        fullName: student.fullName,
        enrollmentNumber: student.enrollmentNumber,
        batch: student.batch,
        email: student.user?.email,
        departmentId: student.department?.id || student.departmentId,
        semesterId: student.semester?.id || student.semesterId,
        divisionId: student.division?.id || student.divisionId,
      });
    } else {
      reset({
        fullName: "",
        enrollmentNumber: "",
        batch: "",
        email: "",
        password: "",
        departmentId: "",
        semesterId: "",
        divisionId: "",
      });
    }
  }, [student, reset, isEdit]);

  const onSubmit = (data) => {
    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Student ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} student.`
        );
      },
    };

    if (isEdit) {
      // Backend doesn't allow updating email, enrollment, or password via this route
      const { _email, _enrollmentNumber, _password, ...updateData } = data;
      mutation.mutate(
        { studentId: student.id, studentData: updateData },
        mutationOptions
      );
    } else {
      mutation.mutate(data, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    departmentsLoading ||
    semestersLoading ||
    divisionsLoading;
  const departments = departmentsData?.data?.departments?.data || [];
  const semesters = semestersData?.data?.semesters?.data || [];
  const divisions = divisionsData?.data?.divisions?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="fullName" className="text-right">
          Full Name
        </Label>
        <Input
          id="fullName"
          {...register("fullName", { required: "Name is required" })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="enrollmentNumber" className="text-right">
          Enrollment No.
        </Label>
        <Input
          id="enrollmentNumber"
          {...register("enrollmentNumber", {
            required: "Enrollment number is required",
          })}
          className="col-span-3"
          disabled={isEdit}
        />
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
        </div>
      )}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="batch" className="text-right">
          Batch
        </Label>
        <Input
          id="batch"
          {...register("batch", { required: "Batch is required" })}
          className="col-span-3"
        />
      </div>

      {/* Select fields */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Department</Label>
        <Controller
          name="departmentId"
          control={control}
          rules={{ required: true }}
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
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Semester</Label>
        <Controller
          name="semesterId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={semestersLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    Sem {s.semesterNumber} ({s.academicYear.year})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Division</Label>
        <Controller
          name="divisionId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={divisionsLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

export default StudentForm;
