import React from "react";
import { Outlet } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import { useUser } from "../../context/UserContext";
import { Loader2 } from "lucide-react";

const UserLayout = () => {
  const { user, loading } = useUser();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B101E] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest opacity-40">Syncing Mandala...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B101E] text-slate-50 font-sans">
      <UserNavbar />
      {/* 220px left margin for sidebar, pt-20 for top navbar */}
      <main className="ml-[220px] pt-24 px-8 pb-12 min-h-screen relative overflow-hidden">
        {/* Background glow effects strictly decorative */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
