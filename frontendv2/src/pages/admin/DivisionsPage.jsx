import React, { useState, useMemo } from "react";
import { useGetDivisions, useDeleteDivision } from "../../hooks/useDivisions";
import DataTable from "../../components/DataTable";
import DivisionForm from "../../components/forms/DivisionForm";
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

const DivisionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const { data: divisionsData, isLoading, isError, error } = useGetDivisions();
  const deleteMutation = useDeleteDivision();

  const handleEdit = (division) => {
    setSelectedDivision(division);
    setIsModalOpen(true);
  };

  const handleDelete = (division) => {
    setSelectedDivision(division);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedDivision.id, {
      onSuccess: () => {
        showToast.success("Division deleted successfully!");
        setIsAlertOpen(false);
        setSelectedDivision(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete division."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = useMemo(
    () => [
      { field: "name", headerName: "Division", width: "15%" },
      {
        field: "semester",
        headerName: "Semester",
        width: "30%",
        renderCell: ({ row }) =>
          row.semester?.semesterNumber && row.semester?.semesterType
            ? `Sem ${row.semester.semesterNumber} (${row.semester.semesterType})`
            : "N/A",
      },
      {
        field: "department",
        headerName: "Department",
        width: "30%",
        renderCell: ({ row }) => row.semester?.department?.name || "N/A",
      },
      {
        field: "academicYear",
        headerName: "Academic Year",
        width: "25%",
        renderCell: ({ row }) => row.semester?.academicYear?.year || "N/A",
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading divisions...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const divisions = divisionsData?.data?.divisions || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Divisions
          </h1>
          <p className="text-muted-foreground">
            Organize students into divisions for each semester.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedDivision(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Division
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedDivision ? "Edit Division" : "Add New Division"}
              </DialogTitle>
            </DialogHeader>
            <DivisionForm
              division={selectedDivision}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={divisions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the division:{" "}
              <span className="font-bold">{selectedDivision?.name}</span> for
              Sem {selectedDivision?.semester?.semesterNumber}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDivision(null)}>
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

export default DivisionsPage;
