// src/MainApp.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Admin Components
import AdminNavbar from "./admin/components/AdminNavbar"; // Make sure filename is AdminNavbar.jsx
import AdminDashboard from "./admin/pages/AdminDashboard"; // Make sure filename is AdminDashboard.jsx
import AdminUsers from "./admin/pages/AdminUsers"; // Make sure filename is AdminUsers.jsx

const MainApp = () => {
  return (
    <div className="admin-container" style={{ display: "flex", height: "100vh" }}>
      {/* Navbar / Sidebar */}
      <AdminNavbar />

      {/* Main Content Area */}
      <div className="admin-content" style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <Routes>
          {/* Redirect /admin to /admin/dashboard */}
          <Route path="/" element={<Navigate to="dashboard" replace />} />

          {/* Admin Pages */}
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainApp;
