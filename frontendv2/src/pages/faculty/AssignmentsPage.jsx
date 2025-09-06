import React, { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useGetFacultyAssignments,
  useDeleteAssignment,
} from "../../hooks/useAssignments";
import DataTable from "../../components/DataTable";
import AssignmentForm from "../../components/forms/AssignmentForm";
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
import dayjs from "dayjs";

const AssignmentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const { user } = useAuth();
  const {
    data: assignmentsData,
    isLoading,
    isError,
    error,
  } = useGetFacultyAssignments(user?.faculty?.id);
  const deleteMutation = useDeleteAssignment();

  const handleEdit = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = (assignment) => {
    setSelectedAssignment(assignment);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedAssignment.id, {
      onSuccess: () => {
        showToast.success("Assignment deleted successfully!");
        setIsAlertOpen(false);
        setSelectedAssignment(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete assignment."
        );
        setIsAlertOpen(false);
      },
    });
  };

  const columns = useMemo(
    () => [
      { field: "title", headerName: "Title", width: "30%" },
      {
        field: "course",
        headerName: "Course",
        width: "25%",
        renderCell: ({ row }) =>
          `${row.course?.subject?.name} - Div ${row.course?.division?.name}`,
      },
      {
        field: "dueDate",
        headerName: "Due Date",
        width: "20%",
        renderCell: ({ row }) =>
          dayjs(row.dueDate).format("MMM D, YYYY h:mm A"),
      },
      {
        field: "submissions",
        headerName: "Submissions",
        width: "15%",
        renderCell: ({ row }) => (
          <Badge variant="secondary">{row._count?.submissions || 0}</Badge>
        ),
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading assignments...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const assignments = assignmentsData?.data?.assignments?.data || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Manage Assignments
          </h1>
          <p className="text-muted-foreground">
            Create, view, and manage all your course assignments.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedAssignment(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>
                {selectedAssignment ? "Edit Assignment" : "Add New Assignment"}
              </DialogTitle>
            </DialogHeader>
            <AssignmentForm
              assignment={selectedAssignment}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={assignments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the assignment:{" "}
              <span className="font-bold">{selectedAssignment?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAssignment(null)}>
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

export default AssignmentsPage;
