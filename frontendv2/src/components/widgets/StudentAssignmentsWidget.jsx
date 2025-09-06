import React from "react";
import { useGetStudentAssignments } from "../../hooks/useAssignments";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const StudentAssignmentsWidget = () => {
  const { data: assignmentsData, isLoading } = useGetStudentAssignments();

  const upcomingAssignments = (assignmentsData?.data?.assignments?.data || [])
    .filter((a) => dayjs(a.dueDate).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf());

  const getDueDateColor = (dueDate) => {
    const diffDays = dayjs(dueDate).diff(dayjs(), "day");
    if (diffDays <= 1) return "text-red-500";
    if (diffDays <= 3) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Upcoming Assignments
        </CardTitle>
        <CardDescription>
          You have {upcomingAssignments.length} upcoming assignment
          {upcomingAssignments.length !== 1 ? "s" : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading assignments...</div>
        ) : upcomingAssignments.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No upcoming assignments. Great job!
          </div>
        ) : (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-start justify-between p-3 bg-muted/50 rounded-lg border border-border/20"
              >
                <div>
                  <p className="font-semibold text-sm">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {assignment.course?.subject?.name}
                  </p>
                  <div
                    className={`text-xs font-medium flex items-center gap-1.5 ${getDueDateColor(
                      assignment.dueDate
                    )}`}
                  >
                    <Clock className="w-3 h-3" />
                    Due {dayjs(assignment.dueDate).fromNow()}
                  </div>
                </div>
                {assignment.submissions && assignment.submissions.length > 0 ? (
                  <Badge
                    variant="default"
                    className="bg-green-500/10 text-green-500 border-green-500/20 flex-shrink-0"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Submitted
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex-shrink-0">
                    {assignment.totalMarks} Marks
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAssignmentsWidget;
