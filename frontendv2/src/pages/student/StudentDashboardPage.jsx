import React from "react";
import { useAuth } from "../../hooks/useAuth";
import StudentCoursesWidget from "../../components/widgets/StudentCoursesWidget";
import StudentAssignmentsWidget from "../../components/widgets/StudentAssignmentsWidget";
import StudentAttendanceWidget from "../../components/widgets/StudentAttendanceWidget";

const StudentDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {user?.name || "Student"}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your academic progress and tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StudentCoursesWidget />
        </div>
        <div className="lg:col-span-1">
          <StudentAssignmentsWidget />
        </div>
        <div className="lg:col-span-1">
          <StudentAttendanceWidget />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
