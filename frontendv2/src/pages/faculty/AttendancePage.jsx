import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  useGetFacultyCourses,
  useGetCourseStudents,
  useGetAttendance,
  useCreateBulkAttendance,
  useUploadAttendanceFile,
  useDownloadAttendanceTemplate,
} from "../../hooks/useAttendance";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import DataTable from "../../components/DataTable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Upload,
  Download,
  PlusCircle,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";
import { showToast } from "../../utils/toast";

const AttendancePage = () => {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isMarkingDialogOpen, setIsMarkingDialogOpen] = useState(false);
  let isLoading = false;
  const { user } = useAuth();
  const { data: coursesData, isLoading: coursesLoading } =
    useGetFacultyCourses();
  const { data: studentsData, isLoading: studentsLoading } =
    useGetCourseStudents(selectedCourse);

  const attendanceParams = useMemo(
    () => ({
      courseId: selectedCourse,
      date: selectedDate.toISOString(),
    }),
    [selectedCourse, selectedDate]
  );

  const { data: existingAttendanceData, isLoading: attendanceLoading } =
    useGetAttendance(attendanceParams, !!selectedCourse);

  const createBulkAttendanceMutation = useCreateBulkAttendance();
  const uploadAttendanceMutation = useUploadAttendanceFile();
  const downloadTemplateMutation = useDownloadAttendanceTemplate();

  // Extract courses data
  const courses = useMemo(
    () => coursesData?.data?.courses || coursesData?.data || [],
    [coursesData]
  );

  // Extract unique semesters, divisions, and subjects from courses for cascading filters
  const availableSemesters = useMemo(() => {
    const unique = [];
    const seen = new Set();
    courses.forEach((course) => {
      if (course.semester && !seen.has(course.semester.id)) {
        seen.add(course.semester.id);
        unique.push(course.semester);
      }
    });
    return unique.sort((a, b) => a.semesterNumber - b.semesterNumber);
  }, [courses]);

  const availableDivisions = useMemo(() => {
    if (!selectedSemester) return [];
    const unique = [];
    const seen = new Set();
    courses
      .filter((course) => course.semester?.id === selectedSemester)
      .forEach((course) => {
        if (course.division && !seen.has(course.division.id)) {
          seen.add(course.division.id);
          unique.push(course.division);
        }
      });
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [courses, selectedSemester]);

  const availableSubjects = useMemo(() => {
    if (!selectedSemester || !selectedDivision) return [];
    const unique = [];
    const seen = new Set();
    courses
      .filter(
        (course) =>
          course.semester?.id === selectedSemester &&
          course.division?.id === selectedDivision
      )
      .forEach((course) => {
        if (course.subject && !seen.has(course.subject.id)) {
          seen.add(course.subject.id);
          unique.push(course.subject);
        }
      });
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [courses, selectedSemester, selectedDivision]);

  // Find the course based on selected filters
  const selectedCourseObject = useMemo(() => {
    if (!selectedSemester || !selectedDivision || !selectedSubject) return null;
    return courses.find(
      (course) =>
        course.semester?.id === selectedSemester &&
        course.division?.id === selectedDivision &&
        course.subject?.id === selectedSubject
    );
  }, [courses, selectedSemester, selectedDivision, selectedSubject]);

  // Update selectedCourse when cascade selection changes
  useEffect(() => {
    if (selectedCourseObject) {
      setSelectedCourse(selectedCourseObject.id);
    } else {
      setSelectedCourse("");
    }
  }, [selectedCourseObject]);

  // Reset dependent filters when parent filter changes
  useEffect(() => {
    if (selectedSemester) {
      setSelectedDivision("");
      setSelectedSubject("");
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedDivision) {
      setSelectedSubject("");
    }
  }, [selectedDivision]);
  const students = useMemo(
    () => studentsData?.data?.students || studentsData?.data || [],
    [studentsData]
  );
  const existingAttendance = useMemo(
    () =>
      existingAttendanceData?.data?.attendance ||
      existingAttendanceData?.data ||
      [],
    [existingAttendanceData]
  );

  // Debug logs to help troubleshoot data loading
  console.log("AttendancePage Debug:", {
    coursesData,
    courses,
    selectedCourse,
    studentsData,
    students,
    existingAttendanceData,
    existingAttendance,
    user,
  });

  // Auto-select first course when courses load
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]?.id || courses[0]);
    }
  }, [courses, selectedCourse]);

  useEffect(() => {
    if (students.length > 0) {
      const records = students.map((student) => {
        const existingRecord = existingAttendance.find(
          (rec) => rec.studentId === student.id
        );
        return {
          id: student.id,
          studentName: student.fullName,
          enrollmentNumber: student.enrollmentNumber,
          status: existingRecord ? existingRecord.status : "PRESENT",
        };
      });
      setAttendanceRecords(records);
    } else {
      setAttendanceRecords([]);
    }
  }, [students, existingAttendance]);

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) =>
        rec.id === studentId ? { ...rec, status: newStatus } : rec
      )
    );
  };

  const handleSaveAttendance = () => {
    const payload = {
      date: selectedDate.toISOString(),
      courseId: selectedCourse,
      attendanceRecords: attendanceRecords.map(({ id, status }) => ({
        studentId: id,
        status,
      })),
    };
    createBulkAttendanceMutation.mutate(payload, {
      onSuccess: () => {
        showToast.success("Attendance saved successfully!");
        setIsMarkingDialogOpen(false);
      },
      onError: (err) =>
        showToast.error(
          err.response?.data?.message || "Failed to save attendance."
        ),
    });
  };

  const handleDownloadTemplate = () => {
    if (!selectedCourse)
      return showToast.error("Please select a course first.");
    downloadTemplateMutation.mutate(selectedCourse, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance_template_${selectedCourse}.xlsx`;
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showToast.success("Template downloaded!");
      },
      onError: (err) =>
        showToast.error(err.response?.data?.message || "Download failed."),
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    // Add other required fields if your backend needs them
    formData.append("date", selectedDate.format("DD-MM-YYYY"));

    uploadAttendanceMutation.mutate(formData, {
      onSuccess: () => showToast.success("File uploaded successfully!"),
      onError: (err) =>
        showToast.error(err.response?.data?.message || "Upload failed."),
    });
  };

  const columns = useMemo(
    () => [
      { field: "studentName", headerName: "Student Name", width: "40%" },
      { field: "enrollmentNumber", headerName: "Enrollment No.", width: "30%" },
      {
        field: "status",
        headerName: "Status",
        width: "30%",
        renderCell: ({ row }) => (
          <Select
            defaultValue={row.status}
            onValueChange={(value) => handleStatusChange(row.id, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRESENT">Present</SelectItem>
              <SelectItem value="ABSENT">Absent</SelectItem>
              <SelectItem value="MEDICAL_LEAVE">Medical Leave</SelectItem>
            </SelectContent>
          </Select>
        ),
      },
    ],
    []
  );

  const isDataReady = selectedCourse && !studentsLoading && !attendanceLoading;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Attendance Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a course and date to manage attendance.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label>Semester</Label>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
                disabled={coursesLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select semester..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSemesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      Semester {semester.semesterNumber} (
                      {semester.semesterType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Division</Label>
              <Select
                value={selectedDivision}
                onValueChange={setSelectedDivision}
                disabled={coursesLoading || !selectedSemester}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={
                      selectedSemester
                        ? "Select division..."
                        : "Select semester first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableDivisions.map((division) => (
                    <SelectItem key={division.id} value={division.id}>
                      Division {division.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={coursesLoading || !selectedDivision}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue
                    placeholder={
                      selectedDivision
                        ? "Select subject..."
                        : "Select division first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      dayjs(selectedDate).format("MMMM D, YYYY")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate.toDate()}
                    onSelect={(date) => setSelectedDate(dayjs(date))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {selectedCourseObject && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm text-muted-foreground mb-1">
                Selected Course:
              </h4>
              <p className="font-semibold">
                {selectedCourseObject.subject.name} - Semester{" "}
                {selectedCourseObject.semester.semesterNumber} - Division{" "}
                {selectedCourseObject.division.name}
                {selectedCourseObject.batch &&
                  ` - Batch ${selectedCourseObject.batch}`}
                {selectedCourseObject.lectureType &&
                  ` (${selectedCourseObject.lectureType})`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          onClick={() => setIsMarkingDialogOpen(true)}
          disabled={!selectedCourse}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Mark Attendance
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadTemplate}
          disabled={!selectedCourse || downloadTemplateMutation.isPending}
        >
          {downloadTemplateMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}{" "}
          Download Template
        </Button>
        <Button variant="outline" asChild disabled={!selectedCourse}>
          <Label className="cursor-pointer">
            <Upload className="mr-2 h-4 w-4" /> Upload File
            <Input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".xlsx,.xls"
            />
          </Label>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Records for{" "}
            {selectedCourse
              ? courses.find((c) => c.id === selectedCourse)?.subject.name
              : "..."}{" "}
            on {dayjs(selectedDate).format("MMMM D, YYYY")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDataReady && existingAttendance.length > 0 ? (
            <div className="space-y-2">
              {existingAttendance.map((rec) => (
                <div
                  key={rec.id}
                  className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{rec.student.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {rec.student.enrollmentNumber}
                    </p>
                  </div>
                  <Badge
                    variant={
                      rec.status === "PRESENT" ? "default" : "destructive"
                    }
                  >
                    {rec.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              {isLoading ? "Loading..." : "No attendance marked for this date."}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isMarkingDialogOpen} onOpenChange={setIsMarkingDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
          </DialogHeader>
          <div className="h-[450px] w-full">
            <DataTable columns={columns} data={attendanceRecords} />
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsMarkingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAttendance}
              disabled={createBulkAttendanceMutation.isPending}
            >
              {createBulkAttendanceMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendancePage;
