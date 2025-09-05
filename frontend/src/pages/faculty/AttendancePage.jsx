// src/pages/faculty/AttendancePage.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Save as SaveIcon,
  Upload as UploadIcon,
  Add as AddIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import {
  useGetFacultyCourses,
  useGetCourseStudents,
  useGetAttendance,
  useCreateBulkAttendance,
  useUploadAttendanceFile,
  useDownloadAttendanceTemplate,
} from "../../hooks/useAttendance";

const AttendancePage = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch faculty courses
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useGetFacultyCourses();

  // Fetch course students
  const { data: studentsData, isLoading: studentsLoading } =
    useGetCourseStudents(selectedCourse);

  // Fetch existing attendance
  const shouldFetchAttendance = selectedCourse && selectedDate.isValid();
  const attendanceParams = shouldFetchAttendance
    ? {
        courseId: selectedCourse,
        date: selectedDate.toISOString(),
      }
    : null;

  const { data: existingAttendanceData, isLoading: attendanceLoading } =
    useGetAttendance(attendanceParams);

  // Mutations
  const createBulkAttendanceMutation = useCreateBulkAttendance();
  const uploadAttendanceMutation = useUploadAttendanceFile();
  const downloadTemplateMutation = useDownloadAttendanceTemplate();

  // Extract data from API responses with memoization
  const courses = useMemo(
    () => coursesData?.data?.courses || [],
    [coursesData]
  );
  const students = useMemo(
    () => studentsData?.data?.students || [],
    [studentsData]
  );
  const existingAttendance = useMemo(
    () => existingAttendanceData?.data?.attendance || [],
    [existingAttendanceData]
  );

  // Initialize attendance records when students or existing attendance changes
  useEffect(() => {
    if (students.length > 0) {
      const records = students.map((student) => {
        const existingRecord = existingAttendance.find(
          (record) => record.studentId === student.id
        );
        return {
          id: existingRecord?.id || `temp-${student.id}`,
          studentId: student.id,
          student: student,
          status: existingRecord?.status || "PRESENT",
          isExisting: !!existingRecord,
        };
      });
      setAttendanceRecords(records);
    }
  }, [students, existingAttendance]);

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.studentId === studentId
          ? { ...record, status: newStatus }
          : record
      )
    );
  };

  const handleSaveAttendance = () => {
    if (!selectedCourse || !selectedDate.isValid()) {
      toast.error("Please select a course and date");
      return;
    }

    const attendanceData = {
      date: selectedDate.toISOString(),
      courseId: selectedCourse,
      attendanceRecords: attendanceRecords.map((record) => ({
        studentId: record.studentId,
        status: record.status,
      })),
    };

    createBulkAttendanceMutation.mutate(attendanceData, {
      onSuccess: () => {
        toast.success("Attendance saved successfully!");
        setIsDialogOpen(false);
      },
      onError: (error) => {
        console.error("Failed to save attendance:", error);
        toast.error(
          `Failed to save attendance: ${
            error.response?.data?.message || error.message
          }`
        );
      },
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const selectedCourseData = courses.find((c) => c.id === selectedCourse);
    if (!selectedCourseData || !selectedDate.isValid()) {
      toast.error("Please select a course and date before uploading.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "academicYearId",
      selectedCourseData.semester.academicYear.id
    );
    formData.append("departmentId", selectedCourseData.semester.department.id);
    formData.append(
      "semesterNumber",
      selectedCourseData.semester.semesterNumber.toString()
    );
    formData.append("divisionId", selectedCourseData.division.id);
    formData.append("subjectId", selectedCourseData.subject.id);
    formData.append("lectureType", selectedCourseData.lectureType);
    if (selectedCourseData.batch) {
      formData.append("batch", selectedCourseData.batch);
    }
    formData.append("date", selectedDate.format("DD-MM-YYYY"));

    uploadAttendanceMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Attendance file uploaded successfully!");
        setIsUploading(false);
      },
      onError: (error) => {
        console.error("Upload failed:", error.response?.data || error);
        toast.error(
          `Upload failed: ${error.response?.data?.message || error.message}`
        );
        setIsUploading(false);
      },
    });
  };

  const handleDownloadTemplate = () => {
    if (!selectedCourse) {
      toast.error("Please select a course first.");
      return;
    }

    downloadTemplateMutation.mutate(selectedCourse, {
      onSuccess: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance_template_${selectedCourse}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Template downloaded successfully!");
      },
      onError: (error) => {
        console.error("Download failed:", error);
        toast.error(
          `Download failed: ${error.response?.data?.message || error.message}`
        );
      },
    });
  };

  const columns = [
    {
      field: "studentName",
      headerName: "Student Name",
      flex: 1,
      valueGetter: (params) => params.row.student?.fullName || "N/A",
    },
    {
      field: "enrollmentNumber",
      headerName: "Enrollment No.",
      flex: 1,
      valueGetter: (params) => params.row.student?.enrollmentNumber || "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "PRESENT"
              ? "success"
              : params.value === "MEDICAL_LEAVE"
              ? "warning"
              : "error"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={params.row.status}
            onChange={(e) =>
              handleStatusChange(params.row.studentId, e.target.value)
            }
          >
            <MenuItem value="PRESENT">Present</MenuItem>
            <MenuItem value="ABSENT">Absent</MenuItem>
            <MenuItem value="MEDICAL_LEAVE">Medical Leave</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];

  if (coursesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (coursesError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Failed to load courses. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="2xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Management
        </Typography>

        {/* Course and Date Selection */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Select Course and Date
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    label="Course"
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {`${course.subject?.name} - ${course.division?.name} (Sem ${course.semester?.semesterNumber})`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    maxDate={dayjs()}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {selectedCourse && selectedDate.isValid() && (
          <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsDialogOpen(true)}
              disabled={studentsLoading}
            >
              Mark Attendance
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
              disabled={downloadTemplateMutation.isLoading}
            >
              {downloadTemplateMutation.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Download Template"
              )}
            </Button>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              disabled={isUploading || studentsLoading}
            >
              {isUploading ? <CircularProgress size={20} /> : "Upload File"}
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
                accept=".xlsx,.xls,.csv"
              />
            </Button>
          </Box>
        )}

        {/* Existing Attendance Display */}
        {!selectedCourse || !selectedDate.isValid() ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Please select a course and date to manage attendance records.
          </Alert>
        ) : attendanceLoading || studentsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : existingAttendance.length > 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Existing Attendance Records
              </Typography>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={existingAttendance}
                  columns={columns.slice(0, 3)} // Remove actions column for existing records
                  getRowId={(row) => row.id}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableSelectionOnClick
                />
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Alert severity="info">
            No attendance records found for the selected course and date.
          </Alert>
        )}

        {/* Attendance Marking Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Mark Attendance - {selectedDate.format("DD/MM/YYYY")}
          </DialogTitle>
          <DialogContent>
            {studentsLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
              </Box>
            ) : students.length === 0 ? (
              <Alert severity="warning">
                No students found for the selected course.
              </Alert>
            ) : (
              <Box sx={{ height: 500, width: "100%", mt: 2 }}>
                <DataGrid
                  rows={attendanceRecords}
                  columns={columns}
                  getRowId={(row) => row.id}
                  pageSize={10}
                  rowsPerPageOptions={[10, 20, 50]}
                  disableSelectionOnClick
                  checkboxSelection={false}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveAttendance}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={
                createBulkAttendanceMutation.isLoading || students.length === 0
              }
            >
              {createBulkAttendanceMutation.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Save Attendance"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AttendancePage;
