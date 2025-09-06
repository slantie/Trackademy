import React, { useState } from "react";
import {
  useGetDepartments,
  useDeleteDepartment,
} from "../../hooks/useDepartments";
import DataTable from "../../components/DataTable";
import DepartmentForm from "../../components/forms/DepartmentForm";
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

const DepartmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const {
    data: departmentsData,
    isLoading,
    isError,
    error,
  } = useGetDepartments();
  const deleteMutation = useDeleteDepartment();

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = (department) => {
    setSelectedDepartment(department);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedDepartment.id, {
      onSuccess: () => {
        showToast.success("Department deleted successfully!");
        setIsAlertOpen(false);
        setSelectedDepartment(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete department."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = [
    { field: "name", headerName: "Name", width: "35%" },
    { field: "abbreviation", headerName: "Abbreviation", width: "15%" },
    {
      field: "college",
      headerName: "College",
      width: "35%",
      renderCell: ({ row }) => row.college?.name || "N/A",
    },
  ];

  if (isLoading)
    return <div className="text-center p-10">Loading departments...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const departments = departmentsData?.data?.departments?.data || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Departments
          </h1>
          <p className="text-muted-foreground">
            Administer all academic departments across colleges.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedDepartment(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedDepartment ? "Edit Department" : "Add New Department"}
              </DialogTitle>
            </DialogHeader>
            <DepartmentForm
              department={selectedDepartment}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              department:{" "}
              <span className="font-bold">{selectedDepartment?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDepartment(null)}>
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

export default DepartmentsPage;
