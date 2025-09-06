import React, { useState, useMemo } from "react";
import { useGetStudents, useDeleteStudent } from "../../hooks/useStudents";
import DataTable from "../../components/DataTable";
import StudentForm from "../../components/forms/StudentForm";
import { Button } from "@/components/ui/button";
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

const StudentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const { data: studentsData, isLoading, isError, error } = useGetStudents();
  const deleteMutation = useDeleteStudent();

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedStudent.id, {
      onSuccess: () => {
        showToast.success("Student deleted successfully!");
        setIsAlertOpen(false);
        setSelectedStudent(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete student."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = useMemo(
    () => [
      { field: "fullName", headerName: "Full Name", width: "20%" },
      { field: "enrollmentNumber", headerName: "Enrollment No.", width: "15%" },
      { field: "batch", headerName: "Batch", width: "10%" },
      {
        field: "department",
        headerName: "Department",
        width: "20%",
        renderCell: ({ row }) => row.department?.name || "N/A",
      },
      {
        field: "semester",
        headerName: "Semester",
        width: "15%",
        renderCell: ({ row }) =>
          row.semester?.semesterNumber
            ? `Sem ${row.semester.semesterNumber}`
            : "N/A",
      },
      {
        field: "division",
        headerName: "Division",
        width: "10%",
        renderCell: ({ row }) => row.division?.name || "N/A",
      },
      {
        field: "email",
        headerName: "Email",
        width: "20%",
        renderCell: ({ row }) => row.user?.email || "N/A",
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading students...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const students = studentsData?.data?.students || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Students
          </h1>
          <p className="text-muted-foreground">
            Administer all student records and enrollments.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedStudent(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedStudent ? "Edit Student" : "Add New Student"}
              </DialogTitle>
            </DialogHeader>
            <StudentForm
              student={selectedStudent}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the student:{" "}
              <span className="font-bold">{selectedStudent?.fullName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedStudent(null)}>
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

export default StudentsPage;
