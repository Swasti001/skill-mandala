import React from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      <AdminNavbar />
      <main className="pt-28 pb-8 w-full">
        <div className="space-y-6 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
