// src/App.jsx
import React from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoutes from "./components/ProtectedRoutes";
import muiTheme from "./theme/muiTheme";
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

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
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
                      // minHeight: "100vh",
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
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/college" element={<CollegesPage />} />
                <Route path="/academic-year" element={<AcademicYearsPage />} />
                <Route path="/department" element={<DepartmentsPage />} />
                <Route path="/subject" element={<SubjectsPage />} />
                <Route path="/faculty" element={<FacultyPage />} />
                <Route path="/semester" element={<SemestersPage />} />
              </Route>

              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
