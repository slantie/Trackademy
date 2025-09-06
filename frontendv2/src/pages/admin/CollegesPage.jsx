import React, { useState } from "react";
import { useGetColleges, useDeleteCollege } from "../../hooks/useColleges";
import DataTable from "../../components/DataTable";
import CollegeForm from "../../components/forms/CollegeForm";
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

const CollegesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const { data: collegesData, isLoading, isError, error } = useGetColleges();
  const deleteMutation = useDeleteCollege();

  const handleEdit = (college) => {
    setSelectedCollege(college);
    setIsModalOpen(true);
  };

  const handleDelete = (college) => {
    setSelectedCollege(college);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedCollege.id, {
      onSuccess: () => {
        showToast.success("College deleted successfully!");
        setIsAlertOpen(false);
        setSelectedCollege(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete college."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = [
    { field: "name", headerName: "Name", width: "40%" },
    { field: "abbreviation", headerName: "Abbreviation", width: "20%" },
    { field: "website", headerName: "Website", width: "40%" },
  ];

  if (isLoading)
    return <div className="text-center p-10">Loading colleges...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const colleges = collegesData?.data?.colleges?.data || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Colleges
          </h1>
          <p className="text-muted-foreground">
            View, add, edit, and delete college records.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCollege(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add College
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCollege ? "Edit College" : "Add New College"}
              </DialogTitle>
            </DialogHeader>
            <CollegeForm
              college={selectedCollege}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={colleges}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              college:{" "}
              <span className="font-bold">{selectedCollege?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCollege(null)}>
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

export default CollegesPage;
