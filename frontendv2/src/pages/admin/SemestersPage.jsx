import React, { useState, useMemo } from "react";
import { useGetSemesters, useDeleteSemester } from "../../hooks/useSemesters";
import DataTable from "../../components/DataTable";
import SemesterForm from "../../components/forms/SemesterForm";
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

const SemestersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);

  const { data: semestersData, isLoading, isError, error } = useGetSemesters();
  const deleteMutation = useDeleteSemester();

  const handleEdit = (semester) => {
    setSelectedSemester(semester);
    setIsModalOpen(true);
  };

  const handleDelete = (semester) => {
    setSelectedSemester(semester);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedSemester.id, {
      onSuccess: () => {
        showToast.success("Semester deleted successfully!");
        setIsAlertOpen(false);
        setSelectedSemester(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete semester."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = useMemo(
    () => [
      { field: "semesterNumber", headerName: "Semester", width: "15%" },
      { field: "semesterType", headerName: "Type", width: "15%" },
      {
        field: "department",
        headerName: "Department",
        width: "35%",
        renderCell: ({ row }) => row.department?.name || "N/A",
      },
      {
        field: "academicYear",
        headerName: "Academic Year",
        width: "35%",
        renderCell: ({ row }) => row.academicYear?.year || "N/A",
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading semesters...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  // Try different data paths based on common API response structures
  const semesters =
    semestersData?.data?.semesters ||
    semestersData?.data?.data ||
    semestersData?.data ||
    semestersData?.semesters ||
    [];

  console.log("SemestersPage - Full API response:", semestersData);
  console.log("SemestersPage - Extracted semesters:", semesters);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Semesters
          </h1>
          <p className="text-muted-foreground">
            Define academic semesters for each department and year.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedSemester(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Semester
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedSemester ? "Edit Semester" : "Add New Semester"}
              </DialogTitle>
            </DialogHeader>
            <SemesterForm
              semester={selectedSemester}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={semesters}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              Semester{" "}
              <span className="font-bold">
                {selectedSemester?.semesterNumber}
              </span>{" "}
              for the{" "}
              <span className="font-bold">
                {selectedSemester?.academicYear?.year}
              </span>{" "}
              academic year.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSemester(null)}>
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

export default SemestersPage;
