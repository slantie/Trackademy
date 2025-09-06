import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "../../hooks/useAuth";
import { useGetFacultyCourses } from "../../hooks/useCourses";
import {
  useCreateAssignment,
  useUpdateAssignment,
} from "../../hooks/useAssignments";
import { showToast } from "../../utils/toast";
import dayjs from "dayjs";

const AssignmentForm = ({ assignment, onFinished }) => {
  const isEdit = !!assignment;
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch faculty courses and extract unique options for cascading filters
  const { data: coursesData, isLoading: coursesLoading } = useGetFacultyCourses(
    user?.id
  );
  const createMutation = useCreateAssignment();
  const updateMutation = useUpdateAssignment();

  // Extract courses data
  const courses = useMemo(() => {
    return (
      coursesData?.data?.courses?.data ||
      coursesData?.data?.courses ||
      coursesData?.data ||
      []
    );
  }, [coursesData]);

  // Extract unique semesters, divisions, and subjects from courses
  const availableSemesters = useMemo(() => {
    const unique = [];
    const seen = new Set();
    courses.forEach((course) => {
      if (course.semester && !seen.has(course.semester.id)) {
        seen.add(course.semester.id);
        unique.push(course.semester);
      }
    });
    return unique.sort((a, b) => a.semesterNumber - b.semesterNumber);
  }, [courses]);

  const availableDivisions = useMemo(() => {
    if (!selectedSemester) return [];
    const unique = [];
    const seen = new Set();
    courses
      .filter((course) => course.semester?.id === selectedSemester)
      .forEach((course) => {
        if (course.division && !seen.has(course.division.id)) {
          seen.add(course.division.id);
          unique.push(course.division);
        }
      });
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [courses, selectedSemester]);

  const availableSubjects = useMemo(() => {
    if (!selectedSemester || !selectedDivision) return [];
    const unique = [];
    const seen = new Set();
    courses
      .filter(
        (course) =>
          course.semester?.id === selectedSemester &&
          course.division?.id === selectedDivision
      )
      .forEach((course) => {
        if (course.subject && !seen.has(course.subject.id)) {
          seen.add(course.subject.id);
          unique.push(course.subject);
        }
      });
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [courses, selectedSemester, selectedDivision]);

  // Find the course ID based on selected filters
  const selectedCourse = useMemo(() => {
    if (!selectedSemester || !selectedDivision || !selectedSubject) return null;
    return courses.find(
      (course) =>
        course.semester?.id === selectedSemester &&
        course.division?.id === selectedDivision &&
        course.subject?.id === selectedSubject
    );
  }, [courses, selectedSemester, selectedDivision, selectedSubject]);

  useEffect(() => {
    if (isEdit && assignment) {
      // Set form values for editing
      reset({
        title: assignment.title,
        description: assignment.description || "",
        totalMarks: assignment.totalMarks,
        dueDate: dayjs(assignment.dueDate).format("YYYY-MM-DDTHH:mm"),
      });

      // Set cascading filter values based on assignment course
      if (assignment.course) {
        setSelectedSemester(assignment.course.semester?.id || "");
        setSelectedDivision(assignment.course.division?.id || "");
        setSelectedSubject(assignment.course.subject?.id || "");
      }
    } else {
      // Reset form for new assignment
      reset({
        title: "",
        description: "",
        totalMarks: 100,
        dueDate: dayjs().add(7, "day").format("YYYY-MM-DDTHH:mm"),
      });
      setSelectedSemester("");
      setSelectedDivision("");
      setSelectedSubject("");
    }
  }, [assignment, reset, isEdit]);

  // Reset dependent filters when parent filter changes
  useEffect(() => {
    if (selectedSemester) {
      setSelectedDivision("");
      setSelectedSubject("");
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedDivision) {
      setSelectedSubject("");
    }
  }, [selectedDivision]);

  useEffect(() => {
    if (isEdit) {
      reset({
        title: assignment.title,
        description: assignment.description || "",
        totalMarks: assignment.totalMarks,
        dueDate: dayjs(assignment.dueDate).format("YYYY-MM-DDTHH:mm"),
        courseId: assignment.course?.id,
      });
    } else {
      reset({
        title: "",
        description: "",
        totalMarks: 100,
        dueDate: dayjs().add(7, "day").format("YYYY-MM-DDTHH:mm"),
        courseId: "",
      });
    }
  }, [assignment, reset, isEdit]);

  const onSubmit = (data) => {
    // Validate that a course is selected through cascading filters
    if (!isEdit && !selectedCourse) {
      showToast.error(
        "Please select semester, division, and subject to identify the course."
      );
      return;
    }

    const processedData = {
      ...data,
      totalMarks: parseInt(data.totalMarks, 10),
      dueDate: dayjs(data.dueDate).toISOString(),
      courseId: isEdit ? assignment.course?.id : selectedCourse?.id,
    };

    const mutation = isEdit ? updateMutation : createMutation;
    const mutationOptions = {
      onSuccess: () => {
        showToast.success(
          `Assignment ${isEdit ? "updated" : "created"} successfully!`
        );
        onFinished();
      },
      onError: (error) => {
        showToast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} assignment.`
        );
      },
    };

    if (isEdit) {
      // For edit, don't include courseId in update data
      const { courseId: _courseId, ...updateData } = processedData;
      mutation.mutate(
        { id: assignment.id, assignmentData: updateData },
        mutationOptions
      );
    } else {
      mutation.mutate(processedData, mutationOptions);
    }
  };

  const isLoading =
    createMutation.isPending || updateMutation.isPending || coursesLoading;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          {...register("title", { required: "Title is required" })}
          className="col-span-3"
        />
        {errors.title && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.title.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="totalMarks" className="text-right">
          Total Marks
        </Label>
        <Input
          id="totalMarks"
          type="number"
          {...register("totalMarks", {
            required: "Marks are required",
            valueAsNumber: true,
          })}
          className="col-span-3"
        />
        {errors.totalMarks && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.totalMarks.message}
          </p>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dueDate" className="text-right">
          Due Date
        </Label>
        <Input
          id="dueDate"
          type="datetime-local"
          {...register("dueDate", { required: "Due date is required" })}
          className="col-span-3"
        />
        {errors.dueDate && (
          <p className="col-span-4 text-red-500 text-sm text-right">
            {errors.dueDate.message}
          </p>
        )}
      </div>

      {/* Cascading Course Selection */}
      {!isEdit && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="semester" className="text-right">
              Semester
            </Label>
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester}
              disabled={isLoading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select semester..." />
              </SelectTrigger>
              <SelectContent>
                {availableSemesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    Semester {semester.semesterNumber} ({semester.semesterType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="division" className="text-right">
              Division
            </Label>
            <Select
              value={selectedDivision}
              onValueChange={setSelectedDivision}
              disabled={isLoading || !selectedSemester}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={
                    selectedSemester
                      ? "Select division..."
                      : "Select semester first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableDivisions.map((division) => (
                  <SelectItem key={division.id} value={division.id}>
                    Division {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
              disabled={isLoading || !selectedDivision}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={
                    selectedDivision
                      ? "Select subject..."
                      : "Select division first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourse && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-sm text-muted-foreground">
                Selected Course
              </Label>
              <div className="col-span-3 p-2 bg-muted rounded-md text-sm">
                {selectedCourse.subject.name} - Semester{" "}
                {selectedCourse.semester.semesterNumber} - Division{" "}
                {selectedCourse.division.name}
                {selectedCourse.batch && ` - Batch ${selectedCourse.batch}`}
                {selectedCourse.lectureType &&
                  ` (${selectedCourse.lectureType})`}
              </div>
            </div>
          )}
        </>
      )}

      {/* For editing, show the current course */}
      {isEdit && assignment?.course && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Course</Label>
          <div className="col-span-3 p-2 bg-muted rounded-md">
            {assignment.course.subject?.name} - Semester{" "}
            {assignment.course.semester?.semesterNumber} - Division{" "}
            {assignment.course.division?.name}
            {assignment.course.batch && ` - Batch ${assignment.course.batch}`}
            <p className="text-xs text-muted-foreground mt-1">
              Course cannot be changed when editing
            </p>
          </div>
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

export default AssignmentForm;
