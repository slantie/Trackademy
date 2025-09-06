import React from "react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  School,
  BookOpen,
  Building,
  ArrowUpRight,
  BarChart,
  Target,
  CheckCircle,
  AlertTriangle,
  BookUser,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const StatCard = ({ title, value, icon: Icon, change, subtitle }) => {
  return (
    <Card className="hover:border-light-highlight/50 dark:hover:border-dark-highlight/50 transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          {subtitle} {change}
        </p>
      </CardContent>
    </Card>
  );
};

const AnalyticsOverview = ({ passCount, failCount, avgSpi, avgCpi }) => {
  const totalResults = passCount + failCount;
  const passRate =
    totalResults > 0 ? ((passCount / totalResults) * 100).toFixed(1) : 0;

  const metrics = [
    {
      title: "Students Passed",
      value: passCount,
      rate: `${passRate}% Success Rate`,
      color: "text-green-500",
      icon: <CheckCircle />,
    },
    {
      title: "Need Support",
      value: failCount,
      rate: "Intervention Required",
      color: "text-red-500",
      icon: <AlertTriangle />,
    },
    {
      title: "Average SPI",
      value: avgSpi,
      rate: "Semester Performance",
      color: "text-blue-500",
      icon: <BarChart />,
    },
    {
      title: "Average CPI",
      value: avgCpi,
      rate: "Cumulative Performance",
      color: "text-purple-500",
      icon: <Target />,
    },
  ];

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Academic Performance Overview</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-muted/50 p-4 rounded-lg border border-border/20"
          >
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-full bg-opacity-20 mb-4 ${metric.color.replace(
                "text-",
                "bg-"
              )}`}
            >
              {React.cloneElement(metric.icon, {
                className: `h-5 w-5 ${metric.color}`,
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              {metric.title}
            </p>
            <p className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </p>
            <p className="text-xs text-muted-foreground">
              {metric.rate}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const AdminDashboardPage = () => {
  const { summaryData, summaryIsLoading, analyticsData, analyticsIsLoading } =
    useDashboardData();

  if (summaryIsLoading || analyticsIsLoading) {
    return <div className="text-center p-10">Loading dashboard data...</div>;
  }

  const summary = summaryData?.data || {};
  const analytics = analyticsData?.data?.statistics || {};

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          An overview of the entire institution's metrics and performance.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={summary.students || 0}
          icon={Users}
          subtitle="Active learners in the system"
        />
        <StatCard
          title="Total Faculty"
          value={summary.faculties || 0}
          icon={BookUser}
          subtitle="Educators and staff members"
        />
        <StatCard
          title="Active Courses"
          value={summary.courses || 0}
          icon={BookOpen}
          subtitle="Courses running this semester"
        />
        <StatCard
          title="Departments"
          value={summary.departments || 0}
          icon={Building}
          subtitle="Across all colleges"
        />
      </div>
      <div className="grid gap-6 mt-6">
        <AnalyticsOverview
          passCount={analytics.passCount || 0}
          failCount={analytics.failCount || 0}
          avgSpi={analytics.averageSpi || 0}
          avgCpi={analytics.averageCpi || 0}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
