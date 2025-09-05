// src/pages/admin/UploadPage.jsx
import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Box,
  LinearProgress,
  Chip,
  FormHelperText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  CloudUpload as UploadIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  MenuBook as SubjectIcon,
  Assignment as MatrixIcon,
  Assessment as ResultsIcon,
  EventNote as AttendanceIcon,
} from "@mui/icons-material";
import { useUploadData } from "../../hooks/useUpload";
import { useGetDepartments } from "../../hooks/useDepartments";
import { useGetAcademicYears } from "../../hooks/useAcademicYears";
import { useGetDivisions } from "../../hooks/useDivisions";
import { useGetSubjects } from "../../hooks/useSubjects";

const UploadCard = ({
  title,
  description,
  icon,
  uploadKey,
  fields = [],
  onUpload,
  isLoading,
  error,
  success,
}) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleUpload = () => {
    if (!file) return;
    onUpload(uploadKey, file, formData);
    setFile(null);
    setFormData({});
  };

  const isFormValid = () => {
    if (!file) return false;
    return fields.every((field) => !field.required || formData[field.name]);
  };

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" component="h2" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {description}
        </Typography>

        {/* File Upload */}
        <Box mb={2}>
          <input
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            id={`file-upload-${uploadKey}`}
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor={`file-upload-${uploadKey}`}>
            <Button
              variant="outlined"
              component="span"
              startIcon={<UploadIcon />}
              fullWidth
            >
              {file ? file.name : "Choose Excel File"}
            </Button>
          </label>
        </Box>

        {/* Dynamic Form Fields */}
        {fields.map((field) => (
          <Box key={field.name} mb={2}>
            {field.type === "select" ? (
              <FormControl fullWidth>
                <InputLabel>{field.label}</InputLabel>
                <Select
                  value={formData[field.name] || ""}
                  label={field.label}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {field.helperText && (
                  <FormHelperText>{field.helperText}</FormHelperText>
                )}
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label={field.label}
                type={field.type || "text"}
                value={formData[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
                helperText={field.helperText}
              />
            )}
          </Box>
        ))}

        {/* Status Messages */}
        {isLoading && <LinearProgress sx={{ mb: 2 }} />}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!isFormValid() || isLoading}
          fullWidth
        >
          {isLoading ? "Uploading..." : "Upload"}
        </Button>
      </CardActions>
    </Card>
  );
};

const UploadPage = () => {
  const { mutate: uploadData } = useUploadData();
  const {
    data: departmentsData,
    isLoading: isDepartmentsLoading,
    error: departmentsError,
  } = useGetDepartments();
  const {
    data: academicYearsData,
    isLoading: isAcademicYearsLoading,
    error: academicYearsError,
  } = useGetAcademicYears();
  const {
    data: divisionsData,
    isLoading: isDivisionsLoading,
    error: divisionsError,
  } = useGetDivisions();
  const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    error: subjectsError,
  } = useGetSubjects();

  const [uploadStatus, setUploadStatus] = useState({});

  // Safely extract data with proper fallbacks
  const departments = Array.isArray(departmentsData?.data?.departments?.data)
    ? departmentsData.data.departments.data
    : Array.isArray(departmentsData?.data?.departments)
    ? departmentsData.data.departments
    : [];

  const academicYears = Array.isArray(academicYearsData?.data?.academicYears)
    ? academicYearsData.data.academicYears
    : [];

  const divisions = Array.isArray(divisionsData?.data?.divisions)
    ? divisionsData.data.divisions
    : [];

  const subjects = Array.isArray(subjectsData?.data?.subjects)
    ? subjectsData.data.subjects
    : [];

  // Show loading if any required data is still loading
  const isLoading =
    isDepartmentsLoading ||
    isAcademicYearsLoading ||
    isDivisionsLoading ||
    isSubjectsLoading;
  const hasErrors =
    departmentsError || academicYearsError || divisionsError || subjectsError;

  const handleUpload = async (uploadKey, file, formData) => {
    setUploadStatus((prev) => ({
      ...prev,
      [uploadKey]: { loading: true, error: null, success: null },
    }));

    try {
      await uploadData(
        { uploadType: uploadKey, file, ...formData },
        {
          onSuccess: () => {
            setUploadStatus((prev) => ({
              ...prev,
              [uploadKey]: {
                loading: false,
                error: null,
                success: "Upload completed successfully!",
              },
            }));
          },
          onError: (error) => {
            setUploadStatus((prev) => ({
              ...prev,
              [uploadKey]: {
                loading: false,
                error: error.message || "Upload failed",
                success: null,
              },
            }));
          },
        }
      );
    } catch (err) {
      setUploadStatus((prev) => ({
        ...prev,
        [uploadKey]: {
          loading: false,
          error: err.message || "Upload failed",
          success: null,
        },
      }));
    }
  };

  const uploadConfigs = [
    {
      key: "students",
      title: "Student Data",
      description: "Upload student information from Excel file",
      icon: <PeopleIcon color="primary" />,
      fields: [],
    },
    {
      key: "faculty",
      title: "Faculty Data",
      description: "Upload faculty information from Excel file",
      icon: <SchoolIcon color="primary" />,
      fields: [],
    },
    {
      key: "subjects",
      title: "Subject Data",
      description: "Upload subject information from Excel file",
      icon: <SubjectIcon color="primary" />,
      fields: [],
    },
    {
      key: "faculty-matrix",
      title: "Faculty Matrix",
      description: "Upload faculty-subject assignments",
      icon: <MatrixIcon color="primary" />,
      fields: [
        {
          name: "academicYear",
          label: "Academic Year",
          type: "text",
          required: true,
          helperText: "Format: YYYY-YYYY (e.g., 2024-2025)",
        },
        {
          name: "semesterType",
          label: "Semester Type",
          type: "select",
          required: true,
          options: [
            { value: "ODD", label: "Odd Semester" },
            { value: "EVEN", label: "Even Semester" },
          ],
        },
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((dept) => ({
            value: dept.id,
            label: `${dept.name} (${dept.abbreviation})`,
          })),
        },
      ],
    },
    {
      key: "results",
      title: "Exam Results",
      description: "Upload exam results from Excel file",
      icon: <ResultsIcon color="primary" />,
      fields: [
        {
          name: "examName",
          label: "Exam Name",
          type: "text",
          required: false,
          helperText: "Optional: Will be auto-generated if not provided",
        },
        {
          name: "examType",
          label: "Exam Type",
          type: "select",
          required: true,
          options: [
            { value: "MINOR", label: "Minor Exam" },
            { value: "MAJOR", label: "Major Exam" },
            { value: "FINAL", label: "Final Exam" },
          ],
        },
        {
          name: "academicYearId",
          label: "Academic Year",
          type: "select",
          required: true,
          options: academicYears.map((year) => ({
            value: year.id,
            label: year.year,
          })),
        },
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((dept) => ({
            value: dept.id,
            label: `${dept.name} (${dept.abbreviation})`,
          })),
        },
        {
          name: "semesterNumber",
          label: "Semester Number",
          type: "number",
          required: true,
          helperText: "Enter semester number (1-8)",
        },
      ],
    },
    {
      key: "attendance",
      title: "Attendance Data",
      description: "Upload attendance data from Excel file",
      icon: <AttendanceIcon color="primary" />,
      fields: [
        {
          name: "academicYearId",
          label: "Academic Year",
          type: "select",
          required: true,
          options: academicYears.map((year) => ({
            value: year.id,
            label: year.year,
          })),
        },
        {
          name: "departmentId",
          label: "Department",
          type: "select",
          required: true,
          options: departments.map((dept) => ({
            value: dept.id,
            label: `${dept.name} (${dept.abbreviation})`,
          })),
        },
        {
          name: "semesterNumber",
          label: "Semester Number",
          type: "number",
          required: true,
        },
        {
          name: "divisionId",
          label: "Division",
          type: "select",
          required: true,
          options: divisions.map((div) => ({
            value: div.id,
            label: div.name,
          })),
        },
        {
          name: "subjectId",
          label: "Subject",
          type: "select",
          required: true,
          options: subjects.map((subject) => ({
            value: subject.id,
            label: `${subject.name} (${subject.code})`,
          })),
        },
        {
          name: "lectureType",
          label: "Lecture Type",
          type: "select",
          required: true,
          options: [
            { value: "THEORY", label: "Theory" },
            { value: "PRACTICAL", label: "Practical" },
            { value: "TUTORIAL", label: "Tutorial" },
          ],
        },
        {
          name: "batch",
          label: "Batch",
          type: "text",
          required: false,
          helperText: "Optional: Specify batch if applicable",
        },
        {
          name: "date",
          label: "Date",
          type: "text",
          required: true,
          helperText: "Format: DD-MM-YYYY",
        },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Upload Center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload bulk data using Excel files. Ensure your files follow the
          required format for successful processing.
        </Typography>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Box mb={4}>
          <Alert severity="info">
            Loading required data for upload forms...
          </Alert>
          <LinearProgress sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Error State */}
      {hasErrors && (
        <Box mb={4}>
          <Alert severity="error">
            Error loading data:{" "}
            {departmentsError?.message ||
              academicYearsError?.message ||
              divisionsError?.message ||
              subjectsError?.message}
          </Alert>
        </Box>
      )}

      {/* Debug Info - Remove this in production */}
      {import.meta.env.DEV && (
        <Box mb={2} p={2} bgcolor="grey.100" borderRadius={1}>
          <Typography variant="caption" display="block">
            Debug: Departments: {departments.length}, Academic Years:{" "}
            {academicYears.length}, Divisions: {divisions.length}, Subjects:{" "}
            {subjects.length}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {uploadConfigs.map((config) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={config.key}>
            <UploadCard
              title={config.title}
              description={config.description}
              icon={config.icon}
              uploadKey={config.key}
              fields={config.fields}
              onUpload={handleUpload}
              isLoading={uploadStatus[config.key]?.loading || false}
              error={uploadStatus[config.key]?.error}
              success={uploadStatus[config.key]?.success}
            />
          </Grid>
        ))}
      </Grid>

      {/* Upload Guidelines */}
      <Box mt={4}>
        <Typography variant="h5" component="h2" gutterBottom>
          Upload Guidelines
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  File Format
                </Typography>
                <Typography variant="body2">
                  • Only Excel files (.xlsx, .xls) are supported
                  <br />
                  • Ensure proper column headers
                  <br />• No empty rows in data
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Data Quality
                </Typography>
                <Typography variant="body2">
                  • Remove duplicate entries
                  <br />
                  • Validate email formats
                  <br />• Check date formats (DD-MM-YYYY)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upload Order
                </Typography>
                <Typography variant="body2">
                  1. Students & Faculty Data
                  <br />
                  2. Subject Data
                  <br />
                  3. Faculty Matrix
                  <br />
                  4. Results & Attendance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UploadPage;
