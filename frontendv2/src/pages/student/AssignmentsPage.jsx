import React, { useState, useMemo } from "react";
import { useGetStudentAssignments } from "../../hooks/useAssignments";
import { useCreateSubmissionWithFile } from "../../hooks/useSubmissions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileUp,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { showToast } from "../../utils/toast";

dayjs.extend(relativeTime);

const AssignmentCard = ({ assignment, onOpenSubmit }) => {
  const submission = assignment.submissions && assignment.submissions[0];
  const isPastDue = dayjs().isAfter(dayjs(assignment.dueDate));

  const getStatus = () => {
    if (submission) {
      if (submission.status === "GRADED")
        return {
          text: `Graded: ${submission.marksAwarded}/${assignment.totalMarks}`,
          variant: "success",
        };
      return { text: "Submitted", variant: "default" };
    }
    if (isPastDue) return { text: "Overdue", variant: "destructive" };
    return { text: "Pending", variant: "secondary" };
  };

  const status = getStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{assignment.title}</CardTitle>
            <CardDescription>
              {assignment.course?.subject?.name}
            </CardDescription>
          </div>
          <Badge variant={status.variant}>{status.text}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {assignment.description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Due {dayjs(assignment.dueDate).format("MMM D, YYYY")}</span>
          </div>
          <span>{assignment.totalMarks} Marks</span>
        </div>
        {!submission && !isPastDue && (
          <Button
            onClick={() => onOpenSubmit(assignment)}
            className="mt-4 w-full sm:w-auto"
          >
            <FileUp className="mr-2 h-4 w-4" /> Submit
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const AssignmentsPage = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionType, setSubmissionType] = useState("text");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState(null);

  const { data: assignmentsData, isLoading } = useGetStudentAssignments();
  const createSubmissionMutation = useCreateSubmissionWithFile();

  const assignments = useMemo(() => {
    return assignmentsData?.data?.assignments?.data || [];
  }, [assignmentsData]);

  const { upcoming, submitted, overdue } = useMemo(() => {
    const upcoming = [],
      submitted = [],
      overdue = [];
    assignments.forEach((a) => {
      const hasSubmission = a.submissions && a.submissions.length > 0;
      const isPastDue = dayjs().isAfter(dayjs(a.dueDate));
      if (hasSubmission) submitted.push(a);
      else if (isPastDue) overdue.push(a);
      else upcoming.push(a);
    });
    return { upcoming, submitted, overdue };
  }, [assignments]);

  const handleOpenSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const handleCloseSubmit = () => {
    setIsSubmitModalOpen(false);
    setSelectedAssignment(null);
    setTextContent("");
    setFile(null);
  };

  const handleSubmit = () => {
    const payload = { assignmentId: selectedAssignment.id };
    if (submissionType === "text") payload.content = textContent;
    if (submissionType === "file") payload.file = file;

    createSubmissionMutation.mutate(payload, {
      onSuccess: () => {
        showToast.success("Assignment submitted successfully!");
        handleCloseSubmit();
      },
      onError: (err) =>
        showToast.error(err.response?.data?.message || "Submission failed."),
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">My Assignments</h1>

      {isLoading ? (
        <div className="text-center">Loading assignments...</div>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />{" "}
              Upcoming ({upcoming.length})
            </h2>
            {upcoming.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {upcoming.map((a) => (
                  <AssignmentCard
                    key={a.id}
                    assignment={a}
                    onOpenSubmit={handleOpenSubmit}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No upcoming assignments.
              </p>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" /> Submitted (
              {submitted.length})
            </h2>
            {submitted.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {submitted.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No assignments submitted yet.
              </p>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-500" /> Overdue (
              {overdue.length})
            </h2>
            {overdue.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {overdue.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No overdue assignments.
              </p>
            )}
          </section>
        </div>
      )}

      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="sm:max-w-[525px] bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Submit: {selectedAssignment?.title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex gap-4">
              <Button
                variant={submissionType === "text" ? "default" : "outline"}
                onClick={() => setSubmissionType("text")}
                className="flex-1"
              >
                <FileText className="mr-2 h-4 w-4" />
                Text
              </Button>
              <Button
                variant={submissionType === "file" ? "default" : "outline"}
                onClick={() => setSubmissionType("file")}
                className="flex-1"
              >
                <FileUp className="mr-2 h-4 w-4" />
                File
              </Button>
            </div>
            {submissionType === "text" ? (
              <Textarea
                placeholder="Type your submission here..."
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={8}
              />
            ) : (
              <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={handleCloseSubmit}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createSubmissionMutation.isPending}
            >
              {createSubmissionMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentsPage;
