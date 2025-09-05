// src/pages/PublicStudentProfilePage.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  Tab,
  Tabs,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Link,
  Stack,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  School as GraduationCap,
  Business as Building2,
  CalendarToday as Calendar,
  Email as Mail,
  Phone,
  LocationOn as MapPin,
  OpenInNew as ExternalLink,
  Download,
  EmojiEvents as Trophy,
  MenuBook as BookOpen,
  Work as Briefcase,
  AccountBox,
  Share,
} from "@mui/icons-material";
import { format } from "date-fns";
import apiClient from "../api/apiClient";

// API calls
const getPublicStudentProfile = async (studentId) => {
  const response = await apiClient.get(`/students/${studentId}/public-profile`);
  return response.data;
};

const getStudentResults = async (studentId) => {
  const response = await apiClient.get(`/exam-results/student/${studentId}`);
  return response.data;
};

const getStudentCertificates = async (studentId) => {
  const response = await apiClient.get(`/certificates/student/${studentId}`);
  return response.data;
};

const getStudentInternships = async (studentId) => {
  const response = await apiClient.get(`/internships/student/${studentId}`);
  return response.data;
};

const INTERNSHIP_STATUSES = {
  APPLIED: { label: "Applied", color: "info" },
  ONGOING: { label: "Ongoing", color: "warning" },
  COMPLETED: { label: "Completed", color: "success" },
  CANCELLED: { label: "Cancelled", color: "error" },
};

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`student-profile-tabpanel-${index}`}
      aria-labelledby={`student-profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </Box>
  );
};

const StudentInfoCard = ({ student }) => {
  return (
    <Card
      sx={{
        mb: 4,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
        }}
      />
      <CardContent sx={{ p: 4, position: "relative", zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid xs={12} md={3} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: "3rem",
                fontWeight: "bold",
                bgcolor: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "3px solid rgba(255, 255, 255, 0.3)",
                mx: { xs: "auto", md: 0 },
              }}
            >
              {student?.fullName?.charAt(0)?.toUpperCase() || "S"}
            </Avatar>
          </Grid>

          <Grid xs={12} md={6}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 1,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {student?.fullName}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                mb: 2,
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {student?.GraduationCap?.email}
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ flexWrap: "wrap" }}
            >
              <Chip
                icon={<AccountBox />}
                label={`Roll: ${student?.enrollmentNumber}`}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
              <Chip
                icon={<GraduationCap />}
                label={student?.department?.name}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
              <Chip
                icon={<BookOpen />}
                label={`Semester ${student?.semester?.semesterNumber}`}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={3}
            sx={{ textAlign: { xs: "center", md: "right" } }}
          >
            <Stack spacing={1}>
              <Chip
                icon={<Building2 />}
                label={student?.division?.name}
                variant="outlined"
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.5)",
                  color: "white",
                  "& .MuiChip-icon": { color: "white" },
                }}
              />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Batch: {student?.batch}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ResultsTab = ({ studentId }) => {
  const {
    data: resultsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-results", studentId],
    queryFn: () => getStudentResults(studentId),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading results: {error.message}
      </Alert>
    );
  }

  const results = resultsData?.data || [];

  if (results.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "grey.50",
          border: "2px dashed",
          borderColor: "grey.300",
        }}
      >
        <Trophy sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Results Available
        </Typography>
        <Typography color="textSecondary">
          Academic results will appear here once they are published.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {results.map((result) => (
        <Grid item xs={12} sm={6} lg={4} key={result.id}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {result.exam?.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {result.exam?.subject?.name}
                  </Typography>
                </Box>
                <Chip
                  label={result.grade}
                  color={
                    result.grade === "A" || result.grade === "B"
                      ? "success"
                      : "default"
                  }
                  sx={{ ml: 1 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Marks Obtained
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {result.marksObtained}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Total Marks
                  </Typography>
                  <Typography variant="h6">{result.totalMarks}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Percentage
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {((result.marksObtained / result.totalMarks) * 100).toFixed(
                      2
                    )}
                    %
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography variant="body2">
                    {result.exam?.date
                      ? format(new Date(result.exam.date), "MMM dd, yyyy")
                      : "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const CertificatesTab = ({ studentId }) => {
  const {
    data: certificatesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-certificates", studentId],
    queryFn: () => getStudentCertificates(studentId),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading certificates: {error.message}
      </Alert>
    );
  }

  const certificates = certificatesData?.data || [];

  if (certificates.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "grey.50",
          border: "2px dashed",
          borderColor: "grey.300",
        }}
      >
        <GraduationCap sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Certificates
        </Typography>
        <Typography color="textSecondary">
          Certificates and achievements will appear here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {certificates.map((certificate) => (
        <Grid item xs={12} sm={6} lg={4} key={certificate.id}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <GraduationCap sx={{ color: "primary.main", mr: 1, mt: 0.5 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {certificate.title}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    {certificate.issuingOrganization}
                  </Typography>
                </Box>
              </Box>

              {certificate.description && (
                <Typography
                  variant="body2"
                  sx={{ mb: 2, color: "text.secondary" }}
                >
                  {certificate.description}
                </Typography>
              )}

              <Stack spacing={1} sx={{ mb: 2 }}>
                {certificate.issueDate && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Calendar sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2">
                      Issued:{" "}
                      {format(new Date(certificate.issueDate), "MMM dd, yyyy")}
                    </Typography>
                  </Box>
                )}

                {certificate.expiryDate && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Calendar sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2">
                      Expires:{" "}
                      {format(new Date(certificate.expiryDate), "MMM dd, yyyy")}
                    </Typography>
                  </Box>
                )}
              </Stack>

              {certificate.certificateUrl && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ExternalLink />}
                  href={certificate.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                >
                  View Certificate
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const InternshipsTab = ({ studentId }) => {
  const {
    data: internshipsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["student-internships", studentId],
    queryFn: () => getStudentInternships(studentId),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading internships: {error.message}
      </Alert>
    );
  }

  const internships = internshipsData?.data || [];

  if (internships.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "grey.50",
          border: "2px dashed",
          borderColor: "grey.300",
        }}
      >
        <Briefcase sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="textSecondary" gutterBottom>
          No Internships
        </Typography>
        <Typography color="textSecondary">
          Internship experiences will appear here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {internships.map((internship) => (
        <Grid item xs={12} md={6} key={internship.id}>
          <Card
            sx={{
              height: "100%",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", flex: 1 }}
                >
                  <Building2 sx={{ color: "primary.main", mr: 1, mt: 0.5 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {internship.companyName}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                      sx={{ fontWeight: 500 }}
                    >
                      {internship.role}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={
                    INTERNSHIP_STATUSES[internship.status]?.label ||
                    internship.status
                  }
                  color={
                    INTERNSHIP_STATUSES[internship.status]?.color || "default"
                  }
                  size="small"
                />
              </Box>

              {internship.description && (
                <Typography
                  variant="body2"
                  sx={{
                    mb: 2,
                    color: "text.secondary",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {internship.description}
                </Typography>
              )}

              <Stack spacing={1} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Calendar sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2">
                    {internship.startDate
                      ? format(new Date(internship.startDate), "MMM dd, yyyy")
                      : "N/A"}{" "}
                    -
                    {internship.endDate
                      ? format(new Date(internship.endDate), "MMM dd, yyyy")
                      : "Ongoing"}
                  </Typography>
                </Box>

                {internship.location && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MapPin sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2">
                      {internship.location}
                    </Typography>
                  </Box>
                )}

                {internship.stipend && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: 16, color: "text.secondary" }}>
                      💰
                    </Typography>
                    <Typography variant="body2">
                      ₹{Number(internship.stipend).toLocaleString()}/month
                    </Typography>
                  </Box>
                )}
              </Stack>

              {internship.offerLetterPath && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ExternalLink />}
                  href={internship.offerLetterPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                >
                  View Certificate
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default function PublicStudentProfilePage() {
  const { id: studentId } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: studentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["public-student-profile", studentId],
    queryFn: () => getPublicStudentProfile(studentId),
    enabled: !!studentId,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
        }}
      >
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Loading student profile...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error || !studentData?.data) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.50",
        }}
      >
        <Paper sx={{ p: 4, textAlign: "center", maxWidth: 400 }}>
          <GraduationCap sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Student Not Found
          </Typography>
          <Typography color="textSecondary">
            The student profile you're looking for doesn't exist or isn't
            available.
          </Typography>
        </Paper>
      </Box>
    );
  }

  const student = studentData.data;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", py: 4 }}>
      <Container maxWidth="lg">
        <StudentInfoCard student={student} />

        <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1rem",
                  py: 2,
                },
              }}
            >
              <Tab
                icon={<Trophy />}
                label="Academic Results"
                iconPosition="start"
              />
              <Tab
                icon={<GraduationCap />}
                label="Certificates"
                iconPosition="start"
              />
              <Tab
                icon={<Briefcase />}
                label="Internships"
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            <TabPanel value={activeTab} index={0}>
              <ResultsTab studentId={studentId} />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <CertificatesTab studentId={studentId} />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <InternshipsTab studentId={studentId} />
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
