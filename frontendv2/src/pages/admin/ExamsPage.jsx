import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetExams } from "../../hooks/useExams";
import DataTable from "../../components/DataTable";
import { Badge } from "@/components/ui/badge";

const ExamsPage = () => {
  const navigate = useNavigate();
  const { data: examsData, isLoading, isError, error } = useGetExams();

  const handleRowClick = (row) => {
    navigate(`/admin/exam/${row.id}/results`);
  };

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Exam Name",
        width: "35%",
      },
      {
        field: "examType",
        headerName: "Type",
        width: "15%",
        renderCell: ({ row }) => (
          <Badge variant="secondary">{row.examType}</Badge>
        ),
      },
      {
        field: "semester",
        headerName: "Semester",
        width: "25%",
        renderCell: ({ row }) =>
          `Sem ${row.semester?.semesterNumber} (${row.semester?.academicYear?.year})`,
      },
      {
        field: "isPublished",
        headerName: "Status",
        width: "15%",
        renderCell: ({ row }) => (
          <Badge variant={row.isPublished ? "default" : "outline"}>
            {row.isPublished ? "Published" : "Not Published"}
          </Badge>
        ),
      },
    ],
    []
  );

  if (isLoading)
    return <div className="text-center p-10">Loading exams...</div>;
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading data: {error.message}
      </div>
    );

  const exams = examsData?.data?.exams || [];

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Manage Exams
        </h1>
        <p className="text-muted-foreground mt-1">
          View all created exams. Click on a row to see detailed results.
        </p>
      </div>

      {/* We need a custom implementation for row click, so we are not using the DataTable component here. */}
      <div className="rounded-md border border-border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {columns.map((col) => (
                  <th
                    key={col.field}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                  >
                    {col.headerName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {exams.length > 0 ? (
                exams.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                  >
                    {columns.map((col) => (
                      <td key={col.field} className="p-4 align-middle">
                        {col.renderCell
                          ? col.renderCell({ row })
                          : row[col.field]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-4 text-center h-24">
                    No exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamsPage;
