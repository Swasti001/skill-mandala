import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Brain,
  CalendarDays,
  GitMerge,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Search,
  CircleHelp,
  LogOut,
  User,
} from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Skills", path: "/admin/skills", icon: Brain },
  { name: "Sessions", path: "/admin/sessions", icon: CalendarDays },
  { name: "Reports", path: "/admin/reports", icon: FileText },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    setIsProfileOpen(false);
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 h-screen w-[200px] border-r border-slate-800 bg-[#08142d] text-slate-100">
        <div className="flex h-full flex-col px-3 py-2">
          {/* Brand */}
          <div
            className="mb-4 flex cursor-pointer items-center gap-2 px-3"
            onClick={() => navigate("/admin/dashboard")}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 text-white shadow-lg">
              <Brain size={22} />
            </div>

            <div>
              <h1 className="text-[11px] font-bold leading-none tracking-wide text-violet-100">
                Skill Mandala
              </h1>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Admin Console
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-1 flex-col gap-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-2 rounded-lg px-3 py-2 text-[15px] font-medium transition ${isActive
                      ? "bg-slate-800/80 text-violet-200 shadow-inner"
                      : "text-slate-300 hover:bg-slate-900/50 hover:text-white"
                    }`
                  }
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Top Header */}
      <header className="fixed left-[200px] right-0 top-0 z-20 border-b border-slate-800 bg-[#08142d]/90 px-3 py-2 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          {/* Search */}
          <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-2 text-slate-400">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search platform analytics..."
              className="w-full bg-transparent text-[11px] text-slate-200 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="text-slate-300 transition hover:text-white">
              <Bell size={14} />
            </button>

            <button className="text-slate-300 transition hover:text-white">
              <CircleHelp size={14} />
            </button>

            <div className="h-8 w-px bg-slate-800" />

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-2 transition hover:bg-slate-800"
              >
                <span className="hidden text-[11px] font-medium text-slate-100 md:inline">
                  Admin Account
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-orange-400 text-slate-900">
                  <User size={14} />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-1 w-52 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-2xl">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/admin/profile");
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-slate-200 transition hover:bg-slate-800"
                  >
                    <User size={14} />
                    My Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[11px] text-red-300 transition hover:bg-slate-800"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminNavbar;