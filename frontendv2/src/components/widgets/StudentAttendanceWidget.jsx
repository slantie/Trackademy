import React from "react";
import { useGetStudentAttendanceSummary } from "../../hooks/useAttendance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserCheck } from "lucide-react";

const StudentAttendanceWidget = () => {
  const { data: attendanceData, isLoading } = useGetStudentAttendanceSummary();
  const attendanceSummary = attendanceData?.data?.attendance || [];

  const calculateOverallAttendance = () => {
    if (!attendanceSummary || attendanceSummary.length === 0) return 0;
    const total = attendanceSummary.reduce(
      (acc, curr) => acc + curr.totalLectures,
      0
    );
    const present = attendanceSummary.reduce(
      (acc, curr) => acc + curr.presentCount,
      0
    );
    return total > 0 ? Math.round((present / total) * 100) : 0;
  };

  const overallAttendance = calculateOverallAttendance();

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Attendance Summary
        </CardTitle>
        <CardDescription>
          Your overall attendance is {overallAttendance}%.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading attendance...</div>
        ) : attendanceSummary.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No attendance data available yet.
          </div>
        ) : (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Overall</span>
                <span className="text-sm font-bold">{overallAttendance}%</span>
              </div>
              <Progress
                value={overallAttendance}
                indicatorClassName={getProgressColor(overallAttendance)}
              />
            </div>
            {/* Course-wise Progress */}
            {attendanceSummary.map((course) => (
              <div key={course.courseId}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">
                    {course.subjectName}
                  </span>
                  <span className="text-sm font-bold">
                    {Math.round(course.percentage)}%
                  </span>
                </div>
                <Progress
                  value={course.percentage}
                  indicatorClassName={getProgressColor(course.percentage)}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceWidget;
