import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Users,
  Award,
  GraduationCap,
  Building,
  Calendar,
  TrendingUp,
  User,
  BarChart3,
  FileText,
  Clock,
} from "lucide-react";
import dayjs from "dayjs";

// --- API Fetcher for Comprehensive Public Data ---
const getPublicFacultyProfile = async (facultyId) => {
  const baseURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";
  const response = await fetch(
    `${baseURL}/faculties/${facultyId}/public-profile`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};

// --- Main Page Component ---
const PublicFacultyProfilePage = () => {
  const { id: facultyId } = useParams();

  const {
    data: facultyProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicFacultyProfile", facultyId],
    queryFn: () => getPublicFacultyProfile(facultyId),
    enabled: !!facultyId,
  });

  if (isLoading)
    return <div className="text-center p-10">Loading profile...</div>;
  if (isError || !facultyProfile)
    return (
      <div className="text-center p-10 text-red-500">
        Could not load faculty profile.
      </div>
    );

  const { statistics, courses, attendanceStats } = facultyProfile;

  return (
    <div className="container mx-auto py-10">
      {/* Profile Header Card */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 text-3xl">
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {facultyProfile.fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold">{facultyProfile.fullName}</h1>
              <p className="text-muted-foreground">
                {facultyProfile.user.email}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant="secondary">{facultyProfile.designation}</Badge>
                <Badge variant="secondary">
                  {facultyProfile.department.name}
                </Badge>
                {facultyProfile.abbreviation && (
                  <Badge variant="secondary">
                    {facultyProfile.abbreviation}
                  </Badge>
                )}
                {statistics?.experience && (
                  <Badge variant="secondary">
                    {statistics.experience} years experience
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Courses Teaching
                </p>
                <p className="text-2xl font-bold">
                  {statistics?.totalCourses || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Students Teaching
                </p>
                <p className="text-2xl font-bold">
                  {statistics?.totalStudents || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Subjects Teaching
                </p>
                <p className="text-2xl font-bold">
                  {statistics?.totalSubjects || 0}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Assignments Created
                </p>
                <p className="text-2xl font-bold">
                  {statistics?.totalAssignments || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <User className="w-4 h-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="courses">
            <BookOpen className="w-4 h-4 mr-2" /> Courses
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <FileText className="w-4 h-4 mr-2" /> Assignments
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <BarChart3 className="w-4 h-4 mr-2" /> Attendance Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab faculty={facultyProfile} statistics={statistics} />
        </TabsContent>
        <TabsContent value="courses" className="mt-6">
          <CoursesTab courses={courses} />
        </TabsContent>
        <TabsContent value="assignments" className="mt-6">
          <AssignmentsTab courses={courses} />
        </TabsContent>
        <TabsContent value="attendance" className="mt-6">
          <AttendanceStatsTab attendanceStats={attendanceStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Tab Content Components ---
const OverviewTab = ({ faculty, statistics }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-semibold">{faculty.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Designation:</span>
            <span className="font-semibold">{faculty.designation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department:</span>
            <span className="font-semibold">{faculty.department.name}</span>
          </div>
          {faculty.abbreviation && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Abbreviation:</span>
              <span className="font-semibold">{faculty.abbreviation}</span>
            </div>
          )}
          {faculty.joiningDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joining Date:</span>
              <span className="font-semibold">
                {dayjs(faculty.joiningDate).format("MMM D, YYYY")}
              </span>
            </div>
          )}
          {statistics?.experience && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Experience:</span>
              <span className="font-semibold">
                {statistics.experience} years
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-semibold">{faculty.user.email}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teaching Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Courses:</span>
            <span className="font-semibold">
              {statistics?.totalCourses || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Students:</span>
            <span className="font-semibold">
              {statistics?.totalStudents || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subjects Teaching:</span>
            <span className="font-semibold">
              {statistics?.totalSubjects || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Assignments Created:</span>
            <span className="font-semibold">
              {statistics?.totalAssignments || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submissions Received:</span>
            <span className="font-semibold">
              {statistics?.totalSubmissions || 0}
            </span>
          </div>
          {statistics?.semestersTaught?.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Semesters Teaching:</span>
              <span className="font-semibold">
                {statistics.semestersTaught.join(", ")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const CoursesTab = ({ courses }) => {
  if (!courses || courses.length === 0) {
    return <EmptyState icon={<BookOpen />} message="No courses assigned." />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <CardTitle>{course.subject.name}</CardTitle>
            <CardDescription>
              {course.subject.code} • Semester {course.semester.semesterNumber}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Division:</span>
              <span className="font-semibold">{course.division.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lecture Type:</span>
              <span className="font-semibold">{course.lectureType}</span>
            </div>
            {course.batch && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Batch:</span>
                <span className="font-semibold">{course.batch}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Students Enrolled:</span>
              <span className="font-semibold">{course._count.enrollments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assignments:</span>
              <span className="font-semibold">{course.assignments.length}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AssignmentsTab = ({ courses }) => {
  const allAssignments =
    courses?.flatMap((course) =>
      course.assignments.map((assignment) => ({
        ...assignment,
        courseName: course.subject.name,
        courseCode: course.subject.code,
      }))
    ) || [];

  if (allAssignments.length === 0) {
    return (
      <EmptyState icon={<FileText />} message="No assignments created yet." />
    );
  }

  return (
    <div className="space-y-4">
      {allAssignments.map((assignment) => (
        <Card key={assignment.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription>
                  {assignment.courseName} ({assignment.courseCode})
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {assignment._count.submissions} submissions
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {assignment.description && (
              <p className="text-muted-foreground mb-3">
                {assignment.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Due Date:</span>
                <p className="font-semibold">
                  {dayjs(assignment.dueDate).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Marks:</span>
                <p className="font-semibold">{assignment.totalMarks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const AttendanceStatsTab = ({ attendanceStats }) => {
  if (!attendanceStats || attendanceStats.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 />}
        message="No attendance data available."
      />
    );
  }

  return (
    <div className="space-y-4">
      {attendanceStats.map((course) => (
        <Card key={course.courseId}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{course.subjectName}</CardTitle>
                <CardDescription>{course.subjectCode}</CardDescription>
              </div>
              <Badge
                variant={
                  course.averageAttendance >= 75 ? "default" : "destructive"
                }
              >
                {course.averageAttendance.toFixed(1)}% Average
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={course.averageAttendance} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold">{course.totalStudents}</p>
                  <p className="text-muted-foreground">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{course.totalClasses}</p>
                  <p className="text-muted-foreground">Classes Taken</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {course.averageAttendance.toFixed(1)}%
                  </p>
                  <p className="text-muted-foreground">Avg Attendance</p>
                </div>
              </div>
              {course.attendanceByStatus && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
                    <p className="font-bold text-green-600">
                      {course.attendanceByStatus.PRESENT || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
                    <p className="font-bold text-red-600">
                      {course.attendanceByStatus.ABSENT || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                    <p className="font-bold text-yellow-600">
                      {course.attendanceByStatus.MEDICAL_LEAVE || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Medical</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const EmptyState = ({ icon, message }) => (
  <div className="text-center p-10 border-2 border-dashed border-border rounded-xl">
    {React.cloneElement(icon, {
      className: "mx-auto h-12 w-12 text-muted-foreground",
    })}
    <h3 className="mt-4 text-lg font-semibold">{message}</h3>
  </div>
);

export default PublicFacultyProfilePage;
