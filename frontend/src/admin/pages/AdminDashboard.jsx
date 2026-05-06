import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";
import {
  Users,
  CalendarRange,
  Sparkles,
  Target,
} from "lucide-react";

const statusStyles = {
  Completed: "text-emerald-400",
  "In Progress": "text-violet-300",
  Scheduled: "text-slate-300",
};

const statusDots = {
  Completed: "bg-emerald-400",
  "In Progress": "bg-violet-300",
  Scheduled: "bg-slate-400",
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("Monthly");

  const fetchStats = async (currentPeriod) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`http://localhost:8080/api/admin/dashboard-stats?period=${currentPeriod}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch platform statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(period);
  }, [period]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06142b] text-slate-50 flex items-center justify-center">
        <div className="text-violet-300 animate-pulse text-xl">Initializing System...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#06142b] text-slate-50 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: data.totalUsers.toLocaleString(),
      meta: "Registered",
      icon: Users,
    },
    {
      title: "Active Sessions",
      value: data.activeSessions.toLocaleString(),
      meta: "Accepted",
      icon: CalendarRange,
    },
    {
      title: "Skills Listed",
      value: data.skillsListed.toLocaleString(),
      meta: "System Wide",
      icon: Sparkles,
    },
    {
      title: "Successful Matches",
      value: data.successfulMatches.toLocaleString(),
      meta: "Completed",
      icon: Target,
    },
  ];

  return (
    <div className="min-h-screen bg-[#06142b] text-slate-50">
      <AdminNavbar />

      <main className="ml-[200px] min-h-screen px-5 pb-5 pt-24">
        <div className="space-y-6">
          {/* Top Stat Cards */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-violet-500/20 hover:border-violet-500/30"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/60 text-violet-200">
                      <Icon size={18} />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400">
                      {stat.meta}
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold tracking-tight text-slate-100">
                    {stat.value}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-wider text-slate-400">
                    {stat.title}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Middle Grid */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2.2fr_1fr]">
            {/* Platform Growth */}
            <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-violet-500/20 hover:border-violet-500/30">
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Platform Growth
                  </h2>
                  <p className="mt-2 text-[13px] text-slate-400">
                    User engagement and skill sharing activity
                  </p>
                </div>

                <div className="inline-flex w-fit rounded-lg bg-slate-950/80 p-1">
                  <button 
                    onClick={() => setPeriod("Daily")}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${period === 'Daily' ? 'bg-slate-700/70 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Daily
                  </button>
                  <button 
                    onClick={() => setPeriod("Weekly")}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${period === 'Weekly' ? 'bg-slate-700/70 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setPeriod("Monthly")}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${period === 'Monthly' ? 'bg-slate-700/70 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Real dynamic growth graph */}
              <div className="relative h-[280px] overflow-hidden rounded-xl bg-gradient-to-b from-slate-900/30 to-slate-950/40 border border-slate-800/50">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_40px]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_100%]" />

                <svg
                  viewBox="0 0 1000 420"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(196,181,253,0.45)" />
                      <stop offset="100%" stopColor="rgba(196,181,253,0.02)" />
                    </linearGradient>
                  </defs>

                  {data.acquisitionData && data.acquisitionData.length > 0 && (() => {
                    const points = data.acquisitionData.map((d, i) => {
                      const x = (i * 1000) / (data.acquisitionData.length - 1);
                      // Scale proportionally. Assume max scale is slightly above current total for visual space
                      const maxVal = Math.max(...data.acquisitionData.map(v => v.users)) * 1.2 || 10;
                      const y = 380 - (d.users / maxVal) * 320;
                      return { x, y };
                    });

                    // Construct Cubic Bezier path
                    let dArr = [`M ${points[0].x} ${points[0].y}`];
                    for (let i = 0; i < points.length - 1; i++) {
                      const p0 = points[i];
                      const p1 = points[i + 1];
                      const cp1x = p0.x + (p1.x - p0.x) / 2;
                      dArr.push(`C ${cp1x} ${p0.y}, ${cp1x} ${p1.y}, ${p1.x} ${p1.y}`);
                    }
                    const dLine = dArr.join(" ");
                    const dArea = `${dLine} L 1000 420 L 0 420 Z`;

                    return (
                      <>
                        <path d={dArea} fill="url(#lineFill)" />
                        <path d={dLine} fill="none" stroke="#d8b4fe" strokeWidth="4" strokeLinecap="round" />
                      </>
                    );
                  })()}
                </svg>
                
                <div className="absolute bottom-2 left-0 right-0 px-10 flex justify-between">
                   {data.acquisitionData.map((d, i) => (
                     <span key={i} className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{d.month}</span>
                   ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {/* Trending Skills */}
              <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-violet-500/20 hover:border-violet-500/30">
                <h3 className="mb-4 text-[15px] font-semibold text-slate-100">
                  Trending Skills
                </h3>

                <div className="space-y-4">
                  {data.trendingSkills.length > 0 ? (
                    data.trendingSkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold text-white ${skill.color}`}
                          >
                            {skill.short}
                          </div>
                          <span className="text-[15px] font-medium text-slate-100">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-xs text-slate-300">{skill.sessions}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-400">No active skills yet.</div>
                  )}
                </div>
              </div>

              {/* Promo Card */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#c4b5fd] via-[#b388ff] to-[#9b6dff] p-5 text-slate-900">
                <div className="relative z-10">
                  <h3 className="text-lg font-bold">Mandala Pro</h3>
                  <p className="mt-1 text-xs font-medium text-slate-800/90 leading-relaxed max-w-[200px]">
                    Unlock advanced cross-platform matching algorithms.
                  </p>

                  <button className="mt-4 rounded-lg bg-[#4c1d95] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#5b21b6]">
                    Upgrade Now
                  </button>
                </div>

                <div className="absolute -bottom-6 -right-4 text-[100px] leading-none text-white/20">
                  ★
                </div>
              </div>
            </div>
          </section>

          {/* Bottom Table */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-[17px] font-semibold text-slate-100">
                Recent Matching Sessions
              </h2>

              <button className="text-xs text-violet-300 transition-all duration-200 hover:text-white hover:scale-105 active:scale-95">
                View all transactions →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                    <th className="px-1 py-3 font-medium">Mentor</th>
                    <th className="px-4 py-3 font-medium">Mentee</th>
                    <th className="px-4 py-3 font-medium">Skill Domain</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Time (UTC)</th>
                  </tr>
                </thead>

                <tbody>
                  {data.recentSessions.map((session, index) => (
                    <tr
                      key={session.id}
                      className={`${index !== data.recentSessions.length - 1 ? 'border-b border-slate-800/50' : ''} transition hover:bg-slate-800/30`}
                    >
                      <td className="px-1 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-500 text-sm font-bold text-slate-900">
                            {session.mentor.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[15px] font-medium text-slate-100">
                              {session.mentor}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-400">{session.role}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-[15px] text-slate-100">
                        {session.mentee}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-md bg-violet-500/20 px-2.5 py-1 text-xs font-medium text-violet-200 border border-violet-500/10">
                          {session.domain}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-2 text-xs font-medium ${statusStyles[session.status]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusDots[session.status]}`}
                          />
                          {session.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right text-xs text-slate-300">
                        {new Date(session.time).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {data.recentSessions.length === 0 && (
                     <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                           No recent sessions found.
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;