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
import {
  Briefcase,
  Award,
  GraduationCap,
  Building,
  Calendar,
  MapPin,
  BadgeDollarSign,
  ExternalLink,
} from "lucide-react";
import apiClient from "../api/apiClient";
import dayjs from "dayjs";

// --- API Fetchers for Public Data ---
const getPublicStudentProfile = async (studentId) => {
  const { data } = await apiClient.get(`/students/${studentId}/public-profile`);
  return data.data;
};
const getStudentResults = async (studentId) => {
  const { data } = await apiClient.get(`/exam-results/student/${studentId}`);
  return data.data?.results || [];
};
const getStudentCertificates = async (studentId) => {
  const { data } = await apiClient.get(`/certificates/student/${studentId}`);
  return data.data || [];
};
const getStudentInternships = async (studentId) => {
  const { data } = await apiClient.get(`/internships/student/${studentId}`);
  return data.data || [];
};

// --- Main Page Component ---
const PublicStudentProfilePage = () => {
  const { id: studentId } = useParams();

  const {
    data: student,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publicStudentProfile", studentId],
    queryFn: () => getPublicStudentProfile(studentId),
    enabled: !!studentId,
  });

  if (isLoading)
    return <div className="text-center p-10">Loading profile...</div>;
  if (isError || !student)
    return (
      <div className="text-center p-10 text-red-500">
        Could not load student profile.
      </div>
    );

  return (
    <div className="container mx-auto py-10">
      {/* Profile Header Card */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-br from-light-highlight/10 to-transparent dark:from-dark-highlight/10 dark:to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 text-3xl">
              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                {student.fullName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{student.fullName}</h1>
              <p className="text-muted-foreground">
                {student.user.email}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <Badge variant="secondary">
                  Enrollment: {student.enrollmentNumber}
                </Badge>
                <Badge variant="secondary">{student.department.name}</Badge>
                <Badge variant="secondary">
                  Semester {student.semester.semesterNumber}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="results">
        <TabsList className="grid w-full grid-cols-3">
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

        <TabsContent value="results" className="mt-6">
          <ResultsTab studentId={studentId} />
        </TabsContent>
        <TabsContent value="certificates" className="mt-6">
          <CertificatesTab studentId={studentId} />
        </TabsContent>
        <TabsContent value="internships" className="mt-6">
          <InternshipsTab studentId={studentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Tab Content Components ---
const TabContentWrapper = ({ queryKey, queryFn, children }) => {
  const { data, isLoading } = useQuery({ queryKey, queryFn });
  if (isLoading) return <div className="text-center p-6">Loading...</div>;
  return children(data || []);
};

const ResultsTab = ({ studentId }) => (
  <TabContentWrapper
    queryKey={["studentResults", studentId]}
    queryFn={() => getStudentResults(studentId)}
  >
    {(data) =>
      data.length === 0 ? (
        <EmptyState icon={<Award />} message="No results published yet." />
      ) : (
        <div className="space-y-4">
          {data.map((examResult) => (
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
                  <div
                    key={res.id}
                    className="p-3 bg-muted/50 rounded-lg"
                  >
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
      )
    }
  </TabContentWrapper>
);

const CertificatesTab = ({ studentId }) => (
  <TabContentWrapper
    queryKey={["studentCertificates", studentId]}
    queryFn={() => getStudentCertificates(studentId)}
  >
    {(data) =>
      data.length === 0 ? (
        <EmptyState
          icon={<GraduationCap />}
          message="No certificates added yet."
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <CardTitle>{cert.title}</CardTitle>
                <CardDescription>{cert.issuingOrganization}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {cert.description}
                </p>
              </CardContent>
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
            </Card>
          ))}
        </div>
      )
    }
  </TabContentWrapper>
);

const InternshipsTab = ({ studentId }) => (
  <TabContentWrapper
    queryKey={["studentInternships", studentId]}
    queryFn={() => getStudentInternships(studentId)}
  >
    {(data) =>
      data.length === 0 ? (
        <EmptyState icon={<Briefcase />} message="No internships logged yet." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((intern) => (
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
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {intern.location}
                </div>
                {intern.stipend && (
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="h-4 w-4" />₹
                    {intern.stipend.toLocaleString()}/month
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
  </TabContentWrapper>
);

const EmptyState = ({ icon, message }) => (
  <div className="text-center p-10 border-2 border-dashed border-border rounded-xl">
    {React.cloneElement(icon, {
      className:
        "mx-auto h-12 w-12 text-muted-foreground",
    })}
    <h3 className="mt-4 text-lg font-semibold">{message}</h3>
  </div>
);

export default PublicStudentProfilePage;
