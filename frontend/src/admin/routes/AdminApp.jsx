import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

const isAdminLoggedIn = () => !!localStorage.getItem("adminToken");

const AdminApp = () => {
  return (
    <Routes>
      <Route
        path="login"
        element={
          isAdminLoggedIn() ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminLogin />
          )
        }
      />

      <Route element={<AdminProtectedRoute />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminApp;