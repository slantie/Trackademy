// src/App.jsx
import React from "react";
import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CollegesPage from "./pages/admin/CollegesPage";
import AcademicYearsPage from "./pages/admin/AcademicYearsPage";
import DepartmentsPage from "./pages/admin/DepartmentsPage";
import SemestersPage from "./pages/admin/SemesterPage";
import FacultyPage from "./pages/admin/FacultyPage";
import SubjectsPage from "./pages/admin/SubjectsPage";
import DivisionsPage from "./pages/admin/DivisionsPage";
import StudentsPage from "./pages/admin/StudentsPage";
import CoursesPage from "./pages/admin/CoursesPage";
import DashboardHub from "./pages/DashboardHub";
import AssignmentsPage from "./pages/faculty/AssignmentsPage";
import AttendancePage from "./pages/faculty/AttendancePage";
import SubmissionsPage from "./pages/faculty/SubmissionsPage";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "100vh",
                      background: (theme) => theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #1B1B1F 0%, #161618 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F6F6F7 100%)',
                    }}
                  >
                    <Header />
                    <LandingPage />
                    <Footer />
                  </Box>
                }
              />
              <Route
                path="/auth"
                element={
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      minHeight: "100vh",
                      background: (theme) => theme.palette.mode === 'dark' 
                        ? 'linear-gradient(135deg, #1B1B1F 0%, #161618 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F6F6F7 100%)',
                    }}
                  >
                    <Header />
                    <AuthPage />
                    <Footer />
                  </Box>
                }
              />

              {/* Protected Routes using the Layout component */}
              <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<DashboardHub />} />
                <Route path="/college" element={<CollegesPage />} />
                <Route path="/academic-year" element={<AcademicYearsPage />} />
                <Route path="/department" element={<DepartmentsPage />} />
                <Route path="/subject" element={<SubjectsPage />} />
                <Route path="/faculty" element={<FacultyPage />} />
                <Route path="/semester" element={<SemestersPage />} />
                <Route path="/division" element={<DivisionsPage />} />
                <Route path="/student" element={<StudentsPage />} />
                <Route path="/course" element={<CoursesPage />} />
                <Route
                  path="/faculty/assignment"
                  element={<AssignmentsPage />}
                />
                <Route
                  path="/faculty/attendance"
                  element={<AttendancePage />}
                />
                <Route
                  path="/faculty/submissions"
                  element={<SubmissionsPage />}
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
