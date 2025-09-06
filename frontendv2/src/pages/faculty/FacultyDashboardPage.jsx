import React from "react";
import { useAuth } from "../../hooks/useAuth";
import MyCoursesWidget from "../../components/widgets/MyCoursesWidget";
import UpcomingAssignmentsWidget from "../../components/widgets/UpcommingAssignmentWidget";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FacultyDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name || "Faculty"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's a snapshot of your current courses and tasks.
          </p>
        </div>
        <Button
          onClick={() => navigate("/faculty/assignment")}
          className="mt-4 sm:mt-0"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Manage Assignments
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <MyCoursesWidget />
        </div>
        <div className="lg:col-span-1">
          <UpcomingAssignmentsWidget />
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboardPage;
