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
import { useCreateCourse, useUpdateCourse } from "../../hooks/useCourses";
import { useGetSubjects } from "../../hooks/useSubjects";
import { useGetFaculties } from "../../hooks/useFaculties";
import { useGetSemesters } from "../../hooks/useSemesters";
import { useGetDivisions } from "../../hooks/useDivisions";
import { showToast } from "../../utils/toast";

const LECTURE_TYPES = ["THEORY", "PRACTICAL"];

const CourseForm = ({ course, onFinished }) => {
  const isEdit = !!course;
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const watchedLectureType = watch(
    "lectureType",
    isEdit ? course.lectureType : "THEORY"
  );

  // Fetch data for dropdowns
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjects();
  const { data: facultiesData, isLoading: facultiesLoading } =
    useGetFaculties();
  const { data: semestersData, isLoading: semestersLoading } =
    useGetSemesters();
  const { data: divisionsData, isLoading: divisionsLoading } =
    useGetDivisions();

  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();

  useEffect(() => {
    if (isEdit) {
      reset({
        subjectId: course.subject?.id,
        facultyId: course.faculty?.id,
        semesterId: course.semester?.id,
        divisionId: course.division?.id,
        lectureType: course.lectureType,
        batch: course.batch || "",
      });
    } else {
      reset({
        subjectId: "",
        facultyId: "",
        semesterId: "",
        divisionId: "",
        lectureType: "THEORY",
        batch: "",
      });
    }
  }, [course, reset, isEdit]);

  const onSubmit = (data) => {
    const processedData = {
      ...data,
      batch: data.lectureType === "THEORY" ? null : data.batch,
    };

    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Course ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} course.`
        );
      },
    };

    if (isEdit) {
      mutation.mutate(
        { courseId: course.id, courseData: processedData },
        mutationOptions
      );
    } else {
      mutation.mutate(processedData, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    subjectsLoading ||
    facultiesLoading ||
    semestersLoading ||
    divisionsLoading;
  const subjects = subjectsData?.data?.subjects || [];
  const faculties = facultiesData?.data?.faculties?.data || [];
  const semesters = semestersData?.data?.semesters?.data || [];
  const divisions = divisionsData?.data?.divisions?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      {/* All Select dropdowns */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Subject</Label>
        <Controller
          name="subjectId"
          control={control}
          rules={{ required: "Subject is required" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.subjectId && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.subjectId.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Faculty</Label>
        <Controller
          name="facultyId"
          control={control}
          rules={{ required: "Faculty is required" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.facultyId && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.facultyId.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Semester</Label>
        <Controller
          name="semesterId"
          control={control}
          rules={{ required: "Semester is required" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading || isEdit}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    Sem {s.semesterNumber} - {s.department.abbreviation} (
                    {s.academicYear.year})
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
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Division</Label>
        <Controller
          name="divisionId"
          control={control}
          rules={{ required: "Division is required" }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading || isEdit}
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
        {errors.divisionId && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.divisionId.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Lecture Type</Label>
        <Controller
          name="lectureType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LECTURE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {watchedLectureType === "PRACTICAL" && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="batch" className="text-right">
            Batch
          </Label>
          <Input
            id="batch"
            {...register("batch", {
              required: "Batch is required for practicals",
            })}
            className="col-span-3"
          />
          {errors.batch && (
            <p className="col-span-4 text-red-500 text-sm text-right">
              {errors.batch.message}
            </p>
          )}
        </div>
      )}
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

export default CourseForm;
