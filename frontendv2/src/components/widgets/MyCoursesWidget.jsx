import React, { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useGetFacultyCourses } from "../../hooks/useCourses";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const MyCoursesWidget = () => {
  const { user } = useAuth();
  const {
    data: coursesData,
    isLoading,
    error,
  } = useGetFacultyCourses(user?.id);

  // Flexible data extraction with debugging
  const courses = useMemo(() => {
    const extracted =
      coursesData?.data?.courses?.data ||
      coursesData?.data?.courses ||
      coursesData?.data ||
      [];
    console.log("MyCoursesWidget Debug:", {
      coursesData,
      extracted,
      user,
      error,
      isLoading,
    });
    return extracted;
  }, [coursesData, user, error, isLoading]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          My Courses
        </CardTitle>
        <CardDescription>
          You are assigned to {courses.length} course
          {courses.length !== 1 ? "s" : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-4">
            <p>Error loading courses: {error.message}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            You are not currently assigned to any courses.
          </div>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
              >
                <div>
                  <p className="font-semibold">{course.subject?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Sem {course.semester?.semesterNumber} - Div{" "}
                    {course.division?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      course.lectureType === "THEORY" ? "default" : "secondary"
                    }
                  >
                    {course.lectureType}
                  </Badge>
                  {course.batch && (
                    <Badge variant="outline">Batch {course.batch}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MyCoursesWidget;
