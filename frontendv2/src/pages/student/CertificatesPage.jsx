import React, { useState } from "react";
import {
  useGetMyCertificates,
  useDeleteCertificate,
} from "../../hooks/useCertificates";
import CertificateForm from "../../components/forms/CertificateForm";
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
  Award,
  Calendar,
} from "lucide-react";
import { showToast } from "../../utils/toast";
import dayjs from "dayjs";

const CertificatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const {
    data: certificatesData,
    isLoading,
    isError,
    error,
  } = useGetMyCertificates();
  const deleteMutation = useDeleteCertificate();

  const handleEdit = (certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleDelete = (certificate) => {
    setSelectedCertificate(certificate);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedCertificate.id, {
      onSuccess: () => {
        showToast.success("Certificate deleted successfully!");
        setIsAlertOpen(false);
        setSelectedCertificate(null);
      },
      onError: (err) => {
        showToast.error(
          err.response?.data?.message || "Failed to delete certificate."
        );
        setIsAlertOpen(false);
      },
    });
  };

  if (isLoading)
    return <div className="text-center p-10">Loading certificates...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const certificates = certificatesData?.data || [];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            My Certificates
          </h1>
          <p className="text-muted-foreground mt-1">
            Showcase your professional achievements and certifications.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCertificate(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-background text-foreground">
            <DialogHeader>
              <DialogTitle>
                {selectedCertificate
                  ? "Edit Certificate"
                  : "Add New Certificate"}
              </DialogTitle>
            </DialogHeader>
            <CertificateForm
              certificate={selectedCertificate}
              onFinished={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed border-border rounded-xl">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No Certificates Added</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first certificate to build your professional portfolio.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{cert.title}</CardTitle>
                <CardDescription>{cert.issuingOrganization}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">
                  {cert.description}
                </p>
                <div className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Issued: {dayjs(cert.issueDate).format("MMMM YYYY")}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {cert.certificatePath && (
                  <Button asChild variant="link" className="p-0 h-auto">
                    <a
                      href={cert.certificatePath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(cert)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cert)}
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the certificate:{" "}
              <span className="font-bold">{selectedCertificate?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCertificate(null)}>
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

export default CertificatesPage;
