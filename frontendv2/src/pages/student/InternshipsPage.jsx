import React, { useState } from "react";
import {
  useGetMyInternships,
  useDeleteInternship,
} from "../../hooks/useInternships";
import InternshipForm from "../../components/forms/InternshipForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Briefcase,
  Calendar,
  MapPin,
  BadgeDollarSign,
} from "lucide-react";
import { showToast } from "../../utils/toast";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANTS = {
  APPLIED: "secondary",
  ONGOING: "default",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

const StudentInternshipsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const {
    data: internshipsData,
    isLoading,
    isError,
    error,
  } = useGetMyInternships();
  const deleteMutation = useDeleteInternship();

  const handleEdit = (internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  const handleDelete = (internship) => {
    setSelectedInternship(internship);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedInternship.id, {
      onSuccess: () => {
        showToast.success("Internship deleted successfully!");
        setIsAlertOpen(false);
        setSelectedInternship(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete internship."
        );
        setIsAlertOpen(false);
      },
    });
  };

  if (isLoading)
    return <div className="text-center p-10">Loading internships...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const internships = internshipsData?.data || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My Internships
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your professional experience and build your portfolio.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedInternship(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Internship
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>
                {selectedInternship ? "Edit Internship" : "Add New Internship"}
              </DialogTitle>
            </DialogHeader>
            <InternshipForm
              internship={selectedInternship}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {internships.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed border-border rounded-xl">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No Internships Logged</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first internship to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {internships.map((intern) => (
            <Card key={intern.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{intern.role}</CardTitle>
                    <CardDescription>{intern.companyName}</CardDescription>
                  </div>
                  <Badge variant={STATUS_VARIANTS[intern.status]}>
                    {intern.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="text-sm text-muted-foreground">
                  {intern.description}
                </p>
                <div className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {dayjs(intern.startDate).format("MMM YYYY")} -{" "}
                  {intern.endDate
                    ? dayjs(intern.endDate).format("MMM YYYY")
                    : "Present"}
                </div>
                <div className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {intern.location}
                </div>
                {intern.stipend && (
                  <div className="text-sm flex items-center gap-2">
                    <BadgeDollarSign className="h-4 w-4" />₹
                    {intern.stipend.toLocaleString()}/month
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {intern.offerLetterPath && (
                  <Button asChild variant="link" className="p-0 h-auto">
                    <a
                      href={intern.offerLetterPath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Offer <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(intern)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(intern)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="bg-background text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the internship at{" "}
              <span className="font-bold">
                {selectedInternship?.companyName}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedInternship(null)}>
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

export default StudentInternshipsPage;
