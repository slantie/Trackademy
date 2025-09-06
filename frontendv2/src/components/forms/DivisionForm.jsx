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
import { useCreateDivision, useUpdateDivision } from "../../hooks/useDivisions";
import { useGetSemesters } from "../../hooks/useSemesters";
import { showToast } from "../../utils/toast";

const DivisionForm = ({ division, onFinished }) => {
  const isEdit = !!division;
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const { data: semestersData, isLoading: semestersLoading } =
    useGetSemesters();
  const createMutation = useCreateDivision();
  const updateMutation = useUpdateDivision();

  useEffect(() => {
    if (isEdit) {
      reset({
        name: division.name,
        semesterId: division.semester?.id || division.semesterId,
      });
    } else {
      reset({
        name: "",
        semesterId: "",
      });
    }
  }, [division, reset, isEdit]);

  const onSubmit = (data) => {
    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Division ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} division.`
        );
      },
    };

    if (isEdit) {
      mutation.mutate(
        { divisionId: division.id, divisionData: data },
        mutationOptions
      );
    } else {
      mutation.mutate(data, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || semestersLoading;
  const semesters = semestersData?.data?.semesters?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          {...register("name", { required: "Division name is required" })}
          className="col-span-3"
          placeholder="e.g., A, B, P1"
        />
        {errors.name && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="semesterId" className="text-right">
          Semester
        </Label>
        <Controller
          name="semesterId"
          control={control}
          rules={{ required: "Please select a semester" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={semestersLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a semester..." />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem.id} value={sem.id}>
                    Sem {sem.semesterNumber} ({sem.academicYear.year}) -{" "}
                    {sem.department.abbreviation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.semesterId && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.semesterId.message}
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

export default DivisionForm;
