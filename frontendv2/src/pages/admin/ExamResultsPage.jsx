import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetExamResults } from "../../hooks/useExamResults";
import DataTable from "../../components/DataTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ExamResultsPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const {
    data: resultsData,
    isLoading,
    isError,
    error,
  } = useGetExamResults(examId);

  const getStatusVariant = (status) => {
    switch (status) {
      case "PASS":
        return "default";
      case "FAIL":
        return "destructive";
      case "TRIAL":
        return "secondary";
      default:
        return "outline";
    }
  };

  const columns = useMemo(
    () => [
      {
        field: "studentEnrollmentNumber",
        headerName: "Enrollment No.",
        width: "25%",
      },
      {
        field: "studentName",
        headerName: "Student Name",
        width: "35%",
        renderCell: ({ row }) => row.student?.fullName || "N/A",
      },
      { field: "spi", headerName: "SPI", width: "10%" },
      { field: "cpi", headerName: "CPI", width: "10%" },
      {
        field: "status",
        headerName: "Status",
        width: "20%",
        renderCell: ({ row }) => (
          <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
        ),
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading exam results...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const results = resultsData?.data?.examResults || [];
  const examName = results[0]?.exam?.name || "Exam";

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="ml-4">
          <h1 className="text-3xl font-bold text-foreground">
            Results for {examName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Detailed performance of all students in this examination.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={results}
      />
    </div>
  );
};

export default ExamResultsPage;
