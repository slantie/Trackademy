import React, { useState, useMemo } from "react";
import { useGetSubjects, useDeleteSubject } from "../../hooks/useSubjects";
import DataTable from "../../components/DataTable";
import SubjectForm from "../../components/forms/SubjectForm";
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

const SubjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const { data: subjectsData, isLoading, isError, error } = useGetSubjects();
  const deleteMutation = useDeleteSubject();

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleDelete = (subject) => {
    setSelectedSubject(subject);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedSubject.id, {
      onSuccess: () => {
        showToast.success("Subject deleted successfully!");
        setIsAlertOpen(false);
        setSelectedSubject(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete subject."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Name", width: "30%" },
      { field: "code", headerName: "Code", width: "15%" },
      { field: "abbreviation", headerName: "Abbreviation", width: "15%" },
      { field: "semesterNumber", headerName: "Semester", width: "10%" },
      {
        field: "department",
        headerName: "Department",
        width: "30%",
        renderCell: ({ row }) => row.department?.name || "N/A",
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading subjects...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const subjects = subjectsData?.data?.subjects || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Subjects
          </h1>
          <p className="text-muted-foreground">
            Oversee all academic subjects offered.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedSubject(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedSubject ? "Edit Subject" : "Add New Subject"}
              </DialogTitle>
            </DialogHeader>
            <SubjectForm
              subject={selectedSubject}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={subjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subject:{" "}
              <span className="font-bold">{selectedSubject?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSubject(null)}>
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

export default SubjectsPage;
