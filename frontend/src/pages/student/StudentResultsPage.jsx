// src/pages/student/StudentResultsPage.jsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useGetStudentResults } from "../../hooks/useExamResults";

const StudentResultsPage = () => {
  const {
    data: resultsData,
    isLoading,
    isError,
    error,
  } = useGetStudentResults();

  if (isLoading)
    return (
      <Container
        maxWidth="md"
        sx={{ my: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );

  if (isError) {
    console.error("Error loading results:", error);
    return (
      <Container maxWidth="2xl" sx={{ my: 4 }}>
        <Alert severity="error">
          Failed to load your results. Please try again later.
          {error?.message && <div>Error: {error.message}</div>}
        </Alert>
      </Container>
    );
  }

  const results = resultsData?.data?.results || [];

  return (
    <Container maxWidth="2xl" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Exam Results
      </Typography>

      {results.length === 0 ? (
        <Alert severity="info">No exam results found for your account.</Alert>
      ) : (
        results.map((result) => (
          <Accordion key={result.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">{result.exam.name}</Typography>
                <Typography variant="subtitle1">
                  SPI: {result.spi} | CPI: {result.cpi}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {result.results.map((subjectResult) => (
                  <Grid item xs={12} sm={6} key={subjectResult.id}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2">
                        {subjectResult.subject.name} (
                        {subjectResult.subject.code})
                      </Typography>
                      <Typography>Grade: {subjectResult.grade}</Typography>
                      <Typography>Credits: {subjectResult.credits}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

export default StudentResultsPage;
