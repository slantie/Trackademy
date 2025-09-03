// src/pages/faculty/AttendancePage.jsx
import React, { useState } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetCourses } from "../../hooks/useCourses";
import {
  useGetAttendance,
  useUpdateAttendance,
  useUploadAttendance,
} from "../../hooks/useUploadAttendance";
import { useAuth } from "../../hooks/useAuth";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";

const AttendancePage = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isUploading, setIsUploading] = useState(false);

  const { data: coursesData, isLoading: coursesLoading } = useGetCourses({
    facultyId: user?.id,
  });

  console.log("AttendancePage - User:", user);
  console.log("AttendancePage - Courses data:", coursesData);
  console.log("AttendancePage - Courses loading:", coursesLoading);

  // Only fetch attendance when we have valid courseId and date
  const shouldFetchAttendance = selectedCourse && selectedDate.isValid();
  const attendanceParams = shouldFetchAttendance
    ? {
        courseId: selectedCourse,
        date: selectedDate.toISOString(), // ISO format for backend validation
      }
    : null;

  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    isError: attendanceError,
  } = useGetAttendance(attendanceParams);

  const updateAttendanceMutation = useUpdateAttendance();
  const uploadAttendanceMutation = useUploadAttendance();

  const handleUpdateStatus = (attendanceId, newStatus) => {
    updateAttendanceMutation.mutate(
      { attendanceId, attendanceData: { status: newStatus } },
      {
        onSuccess: () => toast.success("Attendance status updated!"),
        onError: (error) =>
          toast.error(`Failed to update status: ${error.message}`),
      }
    );
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!selectedCourse || !selectedDate.isValid()) {
      toast.error("Please select a course and date before uploading.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", selectedCourse);
    formData.append("date", selectedDate.toISOString()); // Use ISO format for consistency

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

  const courses = coursesData?.data?.courses?.data || [];
  const attendanceRecords = attendanceData?.data?.attendance || [];
  console.log("Attendance records:", attendanceRecords);
  console.log("Courses array:", courses);
  console.log("Courses array length:", courses.length);

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
          color={params.value === "PRESENT" ? "success" : "error"}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={params.row.status}
            onChange={(e) => handleUpdateStatus(params.row.id, e.target.value)}
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

  if (attendanceError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Failed to load courses for attendance management.
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance Management
        </Typography>

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
                        {`${course.subject?.name} (${course.division?.name}, ${course.semester?.semesterNumber})`}
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
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {!selectedCourse || !selectedDate.isValid() ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            Please select a course and date to view and manage attendance
            records.
          </Alert>
        ) : (
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Student Attendance</Typography>
                <Button
                  variant="contained"
                  component="label"
                  disabled={isUploading}
                >
                  {isUploading ? <CircularProgress size={24} /> : "Upload File"}
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>
              </Box>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={attendanceRecords}
                  columns={columns}
                  getRowId={(row) => row.id}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  loading={attendanceLoading}
                  disableSelectionOnClick
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default AttendancePage;
