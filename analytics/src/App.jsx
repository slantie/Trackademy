import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
import Layout from "./components/layout/Layout";
import AuthLayout from "./components/layout/AuthLayout";

// Pages
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Authentication from "./pages/Authentication";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Toast Provider
import ToastProvider from "./providers/ToastProvider";
import Error from "./components/Error";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/setup"
          element={
            <Layout>
              <Setup />
            </Layout>
          }
        />

        {/* Auth Routes with Auth Layout - Redirect if already logged in */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthLayout>
                <Authentication />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Protected Routes with Role Requirements */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Layout>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p>This page is only for administrators.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Layout>
              <Error />
            </Layout>
          }
        />
      </Routes>

      <ToastProvider />
    </Router>
  );
}

export default App;
