import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAssignment } from "../../hooks/useAssignments";
import {
  useGetSubmissionsByAssignment,
  useGradeSubmission,
} from "../../hooks/useSubmissions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import DataTable from "../../components/DataTable";
import {
  ArrowLeft,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  Award,
  Download,
  Eye,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showToast } from "../../utils/toast";

dayjs.extend(relativeTime);

const AssignmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const { data: assignmentData, isLoading: assignmentLoading } =
    useGetAssignment(id);
  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetSubmissionsByAssignment(id);
  const gradeMutation = useGradeSubmission();

  const assignment = assignmentData?.data?.assignment;
  const submissions = submissionsData?.data?.submissions?.data || [];

  const handleOpenGradeModal = (submission) => {
    setSelectedSubmission(submission);
    setIsGradeModalOpen(true);
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    const marksAwarded = e.target.marksAwarded.value;
    const feedback = e.target.feedback.value;

    if (!marksAwarded) {
      showToast.error("Marks awarded is required.");
      return;
    }

    gradeMutation.mutate(
      {
        submissionId: selectedSubmission.id,
        submissionData: {
          marksAwarded: parseInt(marksAwarded),
          feedback,
          status: "GRADED",
        },
      },
      {
        onSuccess: () => {
          showToast.success("Submission graded successfully!");
          setIsGradeModalOpen(false);
        },
        onError: (err) =>
          showToast.error(
            err.response?.data?.message || "Failed to grade submission."
          ),
      }
    );
  };

  const columns = useMemo(
    () => [
      {
        field: "studentName",
        headerName: "Student",
        width: "30%",
        renderCell: ({ row }) => row.student?.fullName || "N/A",
      },
      {
        field: "submittedAt",
        headerName: "Submitted",
        width: "25%",
        renderCell: ({ row }) =>
          dayjs(row.submittedAt).format("MMM D, YYYY h:mm A"),
      },
      {
        field: "status",
        headerName: "Status",
        width: "15%",
        renderCell: ({ row }) => (
          <Badge variant={row.status === "GRADED" ? "default" : "secondary"}>
            {row.status}
          </Badge>
        ),
      },
      {
        field: "marksAwarded",
        headerName: "Marks",
        width: "15%",
        renderCell: ({ row }) =>
          row.marksAwarded !== null
            ? `${row.marksAwarded} / ${assignment?.totalMarks}`
            : "N/A",
      },
      {
        field: "actions",
        headerName: "Actions",
        width: "15%",
        renderCell: ({ row }) => (
          <div className="flex gap-2">
            {row.filePath && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={row.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenGradeModal(row)}
            >
              <Award className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [assignment]
  );

  if (assignmentLoading || submissionsLoading)
    return (
      <div className="text-center p-10">Loading assignment details...</div>
    );

  return (
    <div className="container mx-auto py-10">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Assignments
      </Button>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{assignment?.title}</CardTitle>
              <CardDescription>
                {assignment?.course?.subject?.name} - Div{" "}
                {assignment?.course?.division?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {assignment?.description}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={submissions} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Due Date
                </span>
                <span className="font-semibold">
                  {dayjs(assignment?.dueDate).format("MMM D, YYYY")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Time
                </span>
                <span className="font-semibold">
                  {dayjs(assignment?.dueDate).format("h:mm A")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Marks
                </span>
                <span className="font-semibold">{assignment?.totalMarks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Submissions
                </span>
                <span className="font-semibold">{submissions.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGradeSubmit} className="space-y-4 py-4">
            <div>
              <Label>Marks Awarded</Label>
              <Input
                id="marksAwarded"
                type="number"
                max={assignment?.totalMarks}
                defaultValue={selectedSubmission?.marksAwarded}
                required
              />
            </div>
            <div>
              <Label>Feedback</Label>
              <Textarea
                id="feedback"
                defaultValue={selectedSubmission?.feedback}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsGradeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={gradeMutation.isPending}>
                {gradeMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Grade
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentDetailsPage;
