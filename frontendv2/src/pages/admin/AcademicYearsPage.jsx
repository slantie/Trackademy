import React, { useState, useMemo, useCallback } from "react";
import {
  useGetAcademicYears,
  useDeleteAcademicYear,
  useActivateAcademicYear,
} from "../../hooks/useAcademicYears";
import DataTable from "../../components/DataTable";
import AcademicYearForm from "../../components/forms/AcademicYearForm";
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
import { PlusCircle, CheckCircle } from "lucide-react";
import { showToast } from "../../utils/toast";

const AcademicYearsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);

  const { data: yearsData, isLoading, isError, error } = useGetAcademicYears();
  const deleteMutation = useDeleteAcademicYear();
  const activateMutation = useActivateAcademicYear();

  const handleEdit = (year) => {
    setSelectedYear(year);
    setIsModalOpen(true);
  };

  const handleDelete = (year) => {
    setSelectedYear(year);
    setIsAlertOpen(true);
  };

  const handleActivate = useCallback((yearId) => {
    activateMutation.mutate(yearId, {
      onSuccess: () =>
        showToast.success("Academic Year activated successfully!"),
      onError: (err) =>
        showToast.error(
          err.response?.data?.message || "Failed to activate year."
        ),
    });
  }, [activateMutation]);

  const confirmDelete = () => {
    deleteMutation.mutate(selectedYear.id, {
      onSuccess: () => {
        showToast.success("Academic Year deleted successfully!");
        setIsAlertOpen(false);
        setSelectedYear(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete year."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = useMemo(
    () => [
      { field: "year", headerName: "Year", width: "25%" },
      {
        field: "college",
        headerName: "College",
        width: "35%",
        renderCell: ({ row }) => row.college?.name || "N/A",
      },
      {
        field: "isActive",
        headerName: "Status",
        width: "15%",
        renderCell: ({ row }) => (
          <Badge variant={row.isActive ? "default" : "secondary"}>
            {row.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: "25%",
        renderCell: ({ row }) => (
          <div className="flex items-center justify-end gap-2 w-full">
            {!row.isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleActivate(row.id)}
                disabled={activateMutation.isPending}
              >
                <CheckCircle className="h-4 w-4 mr-2" /> Activate
              </Button>
            )}
          </div>
        ),
      },
    ],
    [activateMutation.isPending, handleActivate]
  );

  if (isLoading)
    return <div className="text-center p-10">Loading academic years...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const academicYears = yearsData?.data?.academicYears || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Academic Years
          </h1>
          <p className="text-muted-foreground">
            Define and activate academic sessions for your institution.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedYear(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Academic Year
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedYear ? "Edit Academic Year" : "Add New Academic Year"}
              </DialogTitle>
            </DialogHeader>
            <AcademicYearForm
              academicYear={selectedYear}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={academicYears}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              academic year:{" "}
              <span className="font-bold">{selectedYear?.year}</span> for{" "}
              <span className="font-bold">{selectedYear?.college?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedYear(null)}>
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

export default AcademicYearsPage;
