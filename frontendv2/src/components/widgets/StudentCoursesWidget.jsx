import React from "react";
import { useGetStudentCourses } from "../../hooks/useCourses";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCopy } from "lucide-react";

const StudentCoursesWidget = () => {
  const { data: coursesData, isLoading } = useGetStudentCourses();

  const courses = coursesData?.data?.courses || [];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookCopy className="w-5 h-5" />
          My Courses
        </CardTitle>
        <CardDescription>
          You are enrolled in {courses.length} course
          {courses.length !== 1 ? "s" : ""} this semester.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            You are not enrolled in any courses.
          </div>
        ) : (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="p-3 bg-muted/50 rounded-lg border border-border/20"
              >
                <p className="font-semibold text-sm">{course.subject?.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {course.faculty?.fullName || "N/A"}
                  </p>
                  <Badge variant="outline">{course.subject?.code}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentCoursesWidget;
