import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useGetFacultyAssignments } from "../../hooks/useAssignments";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Clock } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

const UpcomingAssignmentsWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: assignmentsData, isLoading } = useGetFacultyAssignments(
    user?.faculty?.id
  );

  const upcomingAssignments = (assignmentsData?.data?.assignments?.data || [])
    .filter((a) => dayjs(a.dueDate).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf())
    .slice(0, 5);

  const getDueDateColor = (dueDate) => {
    const diffDays = dayjs(dueDate).diff(dayjs(), "day");
    if (diffDays <= 1) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (diffDays <= 3)
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Upcoming Assignments
        </CardTitle>
        <CardDescription>
          Your next 5 upcoming assignment deadlines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center">Loading assignments...</div>
        ) : upcomingAssignments.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No upcoming assignments found.
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-start justify-between p-3 bg-muted/50 rounded-lg border border-border/20 cursor-pointer hover:border-light-highlight/50 dark:hover:border-dark-highlight/50 transition"
                onClick={() => navigate(`/faculty/assignment/${assignment.id}`)}
              >
                <div>
                  <p className="font-semibold">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {assignment.course?.subject?.name} - Div{" "}
                    {assignment.course?.division?.name}
                  </p>
                  <div
                    className={`mt-2 text-xs font-medium inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${getDueDateColor(
                      assignment.dueDate
                    )}`}
                  >
                    <Clock className="w-3 h-3" />
                    Due {dayjs(assignment.dueDate).fromNow()}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-bold text-lg">
                    {assignment._count?.submissions || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submissions
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignmentsWidget;
