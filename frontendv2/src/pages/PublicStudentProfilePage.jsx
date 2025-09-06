import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Briefcase,
  Award,
  GraduationCap,
  Building,
  Calendar,
  MapPin,
  BadgeDollarSign,
  ExternalLink,
  BookOpen,
  Clock,
  BarChart3,
  TrendingUp,
  User,
} from "lucide-react";
import apiClient from "../api/apiClient";
import dayjs from "dayjs";

// --- API Fetcher for Comprehensive Public Data ---
const getPublicStudentProfile = async (studentId) => {
  const { data } = await apiClient.get(`/students/${studentId}/public-profile`);
  return data.data;
};

// --- Main Page Component ---
const PublicStudentProfilePage = () => {
  const { id: studentId } = useParams();

  const {
    data: studentProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicStudentProfile", studentId],
    queryFn: () => getPublicStudentProfile(studentId),
    enabled: !!studentId,
  });

  if (isLoading)
    return <div className="text-center p-10">Loading profile...</div>;
  if (isError || !studentProfile)
    return (
      <div className="text-center p-10 text-red-500">
        Could not load student profile.
      </div>
    );

  const {
    statistics,
    attendanceSummary,
    examResults,
    certificates,
    internships,
  } = studentProfile;

  return (
    <div className="container mx-auto py-10">
      {/* Profile Header Card */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 text-3xl">
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {studentProfile.fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold">{studentProfile.fullName}</h1>
              <p className="text-muted-foreground">
                {studentProfile.user.email}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant="secondary">
                  Enrollment: {studentProfile.enrollmentNumber}
                </Badge>
                <Badge variant="secondary">
                  {studentProfile.department.name}
                </Badge>
                <Badge variant="secondary">
                  Semester {studentProfile.semester.semesterNumber}
                </Badge>
                {studentProfile.division && (
                  <Badge variant="secondary">
                    Division {studentProfile.division.name}
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
                  Overall Attendance
                </p>
                <p className="text-2xl font-bold">
                  {statistics?.overallAttendance?.toFixed(1) || 0}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <Progress
              value={statistics?.overallAttendance || 0}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Courses Enrolled
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
                <p className="text-sm text-muted-foreground">Latest CPI</p>
                <p className="text-2xl font-bold">
                  {statistics?.latestCPI || "N/A"}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold">
                  {statistics?.totalCertificates || 0}
                </p>
              </div>
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">
            <User className="w-4 h-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Clock className="w-4 h-4 mr-2" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="results">
            <Award className="w-4 h-4 mr-2" /> Results
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <GraduationCap className="w-4 h-4 mr-2" /> Certificates
          </TabsTrigger>
          <TabsTrigger value="internships">
            <Briefcase className="w-4 h-4 mr-2" /> Internships
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab student={studentProfile} statistics={statistics} />
        </TabsContent>
        <TabsContent value="attendance" className="mt-6">
          <AttendanceTab attendanceSummary={attendanceSummary} />
        </TabsContent>
        <TabsContent value="results" className="mt-6">
          <ResultsTab examResults={examResults} />
        </TabsContent>
        <TabsContent value="certificates" className="mt-6">
          <CertificatesTab certificates={certificates} />
        </TabsContent>
        <TabsContent value="internships" className="mt-6">
          <InternshipsTab internships={internships} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Tab Content Components ---
const OverviewTab = ({ student, statistics }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Academic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Enrollment Number:</span>
            <span className="font-semibold">{student.enrollmentNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department:</span>
            <span className="font-semibold">{student.department.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Semester:</span>
            <span className="font-semibold">
              {student.semester.semesterNumber} ({student.semester.semesterType}
              )
            </span>
          </div>
          {student.division && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Division:</span>
              <span className="font-semibold">{student.division.name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-semibold">{student.user.email}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Overall Attendance
              </span>
              <span className="text-sm font-semibold">
                {statistics?.overallAttendance?.toFixed(1) || 0}%
              </span>
            </div>
            <Progress value={statistics?.overallAttendance || 0} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Courses:</span>
            <span className="font-semibold">
              {statistics?.totalCourses || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latest CPI:</span>
            <span className="font-semibold">
              {statistics?.latestCPI || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Latest SPI:</span>
            <span className="font-semibold">
              {statistics?.latestSPI || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Certificates:</span>
            <span className="font-semibold">
              {statistics?.totalCertificates || 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Internships:</span>
            <span className="font-semibold">
              {statistics?.totalInternships || 0}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AttendanceTab = ({ attendanceSummary }) => {
  if (!attendanceSummary || attendanceSummary.length === 0) {
    return (
      <EmptyState icon={<Clock />} message="No attendance records found." />
    );
  }

  return (
    <div className="space-y-4">
      {attendanceSummary.map((course, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{course.subjectName}</CardTitle>
                <CardDescription>
                  {course.subjectCode} • {course.facultyName}
                  {course.lectureType && ` • ${course.lectureType}`}
                  {course.batch && ` • Batch ${course.batch}`}
                </CardDescription>
              </div>
              <Badge
                variant={course.percentage >= 75 ? "default" : "destructive"}
              >
                {course.percentage.toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={course.percentage} className="h-2" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {course.presentCount}
                  </p>
                  <p className="text-muted-foreground">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {course.absentCount}
                  </p>
                  <p className="text-muted-foreground">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{course.totalLectures}</p>
                  <p className="text-muted-foreground">Total</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const ResultsTab = ({ examResults }) => {
  if (!examResults || examResults.length === 0) {
    return <EmptyState icon={<Award />} message="No results published yet." />;
  }

  return (
    <div className="space-y-4">
      {examResults.map((examResult) => (
        <Card key={examResult.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{examResult.exam.name}</CardTitle>
              <div className="flex gap-4">
                <Badge>SPI: {examResult.spi.toFixed(2)}</Badge>
                <Badge>CPI: {examResult.cpi.toFixed(2)}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examResult.results.map((res) => (
              <div key={res.id} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{res.subject.name}</span>
                  <Badge variant="outline">{res.grade}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {res.subject.code}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const CertificatesTab = ({ certificates }) => {
  if (!certificates || certificates.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap />}
        message="No certificates added yet."
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((cert) => (
        <Card key={cert.id}>
          <CardHeader>
            <CardTitle>{cert.title}</CardTitle>
            <CardDescription>{cert.issuingOrganization}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{cert.description}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Issued: {dayjs(cert.issueDate).format("MMM D, YYYY")}
            </p>
          </CardContent>
          {cert.certificatePath && (
            <CardFooter>
              <Button asChild variant="link" className="p-0 h-auto">
                <a
                  href={cert.certificatePath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Certificate
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

const InternshipsTab = ({ internships }) => {
  if (!internships || internships.length === 0) {
    return (
      <EmptyState icon={<Briefcase />} message="No internships logged yet." />
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {internships.map((intern) => (
        <Card key={intern.id}>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>{intern.role}</CardTitle>
              <Badge>{intern.status}</Badge>
            </div>
            <CardDescription>{intern.companyName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {dayjs(intern.startDate).format("MMM YYYY")} -{" "}
              {intern.endDate
                ? dayjs(intern.endDate).format("MMM YYYY")
                : "Present"}
            </div>
            {intern.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {intern.location}
              </div>
            )}
            {intern.stipend && (
              <div className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4" />₹
                {intern.stipend.toLocaleString()}/month
              </div>
            )}
            {intern.description && (
              <p className="text-muted-foreground mt-2">{intern.description}</p>
            )}
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

export default PublicStudentProfilePage;
