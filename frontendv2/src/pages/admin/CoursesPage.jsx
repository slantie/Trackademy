import React, { useState, useMemo } from "react";
import { useGetCourses, useDeleteCourse } from "../../hooks/useCourses";
import DataTable from "../../components/DataTable";
import CourseForm from "../../components/forms/CourseForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle } from "lucide-react";
import { showToast } from "../../utils/toast";

const CoursesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { data: coursesData, isLoading, isError, error } = useGetCourses();
  const deleteMutation = useDeleteCourse();

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedCourse.id, {
      onSuccess: () => {
        showToast.success("Course deleted successfully!");
        setIsAlertOpen(false);
        setSelectedCourse(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete course."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = useMemo(
    () => [
      {
        field: "subject",
        headerName: "Subject",
        width: "25%",
        renderCell: ({ row }) =>
          `${row.subject?.name || "N/A"} (${row.subject?.code || "N/A"})`,
      },
      {
        field: "faculty",
        headerName: "Faculty",
        width: "20%",
        renderCell: ({ row }) => row.faculty?.fullName || "N/A",
      },
      {
        field: "semester",
        headerName: "Semester",
        width: "25%",
        renderCell: ({ row }) =>
          `Sem ${row.semester?.semesterNumber} - ${row.semester?.department?.abbreviation} (${row.semester?.academicYear?.year})`,
      },
      {
        field: "division",
        headerName: "Div/Batch",
        width: "15%",
        renderCell: ({ row }) => (
          <div className="flex flex-col">
            <span>Div: {row.division?.name || "N/A"}</span>
            {row.batch && (
              <span className="text-xs text-muted-foreground">
                Batch: {row.batch}
              </span>
            )}
          </div>
        ),
      },
      {
        field: "lectureType",
        headerName: "Type",
        width: "15%",
        renderCell: ({ row }) => (
          <Badge
            variant={row.lectureType === "THEORY" ? "default" : "secondary"}
          >
            {row.lectureType}
          </Badge>
        ),
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading courses...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const courses = coursesData?.data?.courses || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Courses</h1>
          <p className="text-muted-foreground">
            Assign subjects to faculty for specific semesters and divisions.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCourse(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
            </DialogHeader>
            <CourseForm
              course={selectedCourse}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course:{" "}
              <span className="font-bold">{selectedCourse?.subject?.name}</span>{" "}
              for{" "}
              <span className="font-bold">
                {selectedCourse?.faculty?.fullName}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCourse(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {deleteMutation.isPending ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CoursesPage;
