import React, { useState, useMemo } from "react";
import {
  useGetFaculties,
  useDeleteFaculty,
  useResetFacultyPassword,
} from "../../hooks/useFaculties";
import DataTable from "../../components/DataTable";
import FacultyForm from "../../components/forms/FacultyForm";
import ResetPasswordDialog from "../../components/dialogs/ResetPasswordDialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlusCircle, KeyRound } from "lucide-react";
import { showToast } from "../../utils/toast";

const FacultyPage = () => {
  const [modalState, setModalState] = useState({
    form: false,
    alert: false,
    password: false,
  });
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const { data: facultiesData, isLoading, isError, error } = useGetFaculties();
  const deleteMutation = useDeleteFaculty();
  const resetPasswordMutation = useResetFacultyPassword();

  const openModal = (type, faculty = null) => {
    setSelectedFaculty(faculty);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModalState((prev) => ({ ...prev, [type]: false }));
    setSelectedFaculty(null);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedFaculty.id, {
      onSuccess: () => {
        showToast.success("Faculty deleted successfully!");
        closeModal("alert");
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete faculty."
        );
        closeModal("alert");
      },
    });
  };

  const handleResetPassword = (data) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: (res) => {
        showToast.success(res.message || "Password reset successfully!");
        closeModal("password");
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to reset password."
        );
      },
    });
  };

  const columns = useMemo(
    () => [
      { field: "fullName", headerName: "Full Name", width: "20%" },
      {
        field: "email",
        headerName: "Email",
        width: "25%",
        renderCell: ({ row }) => row.user?.email || "N/A",
      },
      { field: "designation", headerName: "Designation", width: "15%" },
      {
        field: "department",
        headerName: "Department",
        width: "25%",
        renderCell: ({ row }) => row.department?.name || "N/A",
      },
      {
        field: "actions",
        headerName: "Actions",
        width: "15%",
        renderCell: ({ row }) => (
          <div className="flex items-center justify-end gap-2 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openModal("password", row)}
                  >
                    <KeyRound className="h-4 w-4 text-yellow-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset Password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ),
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading faculty...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  // Try different data paths based on common API response structures
  const faculties =
    facultiesData?.data?.faculties ||
    facultiesData?.data?.data ||
    facultiesData?.data ||
    facultiesData?.faculties ||
    [];

  console.log("FacultyPage - Full API response:", facultiesData);
  console.log("FacultyPage - Extracted faculties:", faculties);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Faculty</h1>
          <p className="text-muted-foreground">
            Administer all faculty members and their roles.
          </p>
        </div>
        <Dialog
          open={modalState.form}
          onOpenChange={(isOpen) =>
            setModalState((prev) => ({ ...prev, form: isOpen }))
          }
        >
          <DialogTrigger asChild>
            <Button onClick={() => openModal("form")}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedFaculty ? "Edit Faculty" : "Add New Faculty"}
              </DialogTitle>
            </DialogHeader>
            <FacultyForm
              faculty={selectedFaculty}
              onFinished={() => closeModal("form")}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={faculties}
        onEdit={(faculty) => openModal("form", faculty)}
        onDelete={(faculty) => openModal("alert", faculty)}
      />

      <AlertDialog
        open={modalState.alert}
        onOpenChange={(isOpen) =>
          setModalState((prev) => ({ ...prev, alert: isOpen }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              faculty member:{" "}
              <span className="font-bold">{selectedFaculty?.fullName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => closeModal("alert")}>
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

      <Dialog
        open={modalState.password}
        onOpenChange={(isOpen) =>
          setModalState((prev) => ({ ...prev, password: isOpen }))
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <ResetPasswordDialog
            faculty={selectedFaculty}
            onFinished={() => closeModal("password")}
            onResetPassword={handleResetPassword}
            isLoading={resetPasswordMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacultyPage;
