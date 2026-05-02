import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";

// USER SIDE
import UserApp from "./UserApp";

// ADMIN SIDE
import AdminLogin from "./admin/pages/AdminLogin";
import AdminProtectedRoute from "./admin/routes/AdminProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminSkills from "./admin/pages/AdminSkills";
import AdminAnalytics from "./admin/pages/AdminAnalytics";
import AdminSettings from "./admin/pages/AdminSettings";
import AdminReports from "./admin/pages/AdminReports";
import AdminSessions from "./admin/pages/AdminSessions";

// Stub component for links without mockups
const AdminStub = ({ title }) => (
  <div className="min-h-screen bg-[#0e121e] text-slate-50 flex items-center justify-center">
     <h1 className="text-2xl text-slate-500">{title} - Coming Soon</h1>
  </div>
);

function App() {

  return (
    <Routes>
      {/* ---------------- ADMIN ROUTES ---------------- */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="sessions" element={<AdminSessions />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* ---------------- USER ROUTES ---------------- */}
      
      {/* keep this LAST */}
      <Route path="/*" element={<UserApp />} />
    </Routes>
  );
}

export default App;