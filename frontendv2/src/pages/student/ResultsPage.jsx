import React from "react";
import { useGetStudentResults } from "../../hooks/useExamResults";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Award, BarChart3, TrendingUp, AlertCircle } from "lucide-react";

const ResultsPage = () => {
  const {
    data: resultsData,
    isLoading,
    isError,
    error,
  } = useGetStudentResults();

  if (isLoading) {
    return <div className="text-center p-10">Loading your results...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-10 text-red-500">
        <AlertCircle className="mx-auto h-12 w-12" />
        <h2 className="mt-4 text-xl font-semibold">Error Loading Results</h2>
        <p className="mt-2 text-sm">
          {error.message ||
            "Could not fetch your results. Please try again later."}
        </p>
      </div>
    );
  }

  const results = resultsData?.data?.results || [];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          My Exam Results
        </h1>
        <p className="text-muted-foreground mt-1">
          View your academic performance and detailed grade reports.
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center p-10 border-2 border-dashed border-border rounded-xl">
          <Award className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">No Results Published</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your exam results will appear here once they are published by the
            administration.
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {results.map((result) => (
            <AccordionItem
              key={result.id}
              value={`item-${result.id}`}
              className="border border-border rounded-xl bg-background text-foreground"
            >
              <AccordionTrigger className="p-6 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">
                      {result.exam.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Semester {result.exam.semester.semesterNumber} -{" "}
                      {result.exam.semester.academicYear.year}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      SPI:{" "}
                      <span className="font-bold">{result.spi.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      CPI:{" "}
                      <span className="font-bold">{result.cpi.toFixed(2)}</span>
                    </div>
                    <Badge
                      variant={
                        result.status === "PASS" ? "default" : "destructive"
                      }
                      className={
                        result.status === "PASS"
                          ? "bg-green-500/10 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-500/20"
                          : ""
                      }
                    >
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 pt-0">
                <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.results.map((subjectResult) => (
                    <div
                      key={subjectResult.id}
                      className="bg-muted/50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">
                          {subjectResult.subject.name}
                        </p>
                        <Badge variant="outline">{subjectResult.grade}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {subjectResult.subject.code} - {subjectResult.credits}{" "}
                        Credits
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default ResultsPage;
