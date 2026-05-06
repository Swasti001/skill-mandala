import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { TrendingUp, MoreHorizontal, Download, Share2, Search, TriangleAlert, Activity, Network, CheckCircle, AlertOctagon, RefreshCw } from "lucide-react";
import axios from "axios";

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/analytics", { headers });
      setData(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, []);

  const handleExport = () => {
    showToast("Report exported successfully!", "success");
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAnalytics();
    showToast("Analytics data refreshed", "success");
  };

  if (loading) return <div className="min-h-screen bg-[#0e121e] text-slate-50 font-sans flex items-center justify-center">Loading Analytics Engine...</div>;

  return (
    <div className="min-h-screen bg-[#0e121e] text-slate-50 font-sans">
      <AdminNavbar />

      <main className="ml-[200px] min-h-screen pt-20 px-8 pb-10">
        <div className="max-w-[1100px] mx-auto space-y-6">
          
          {/* Header Row */}
          <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#a882ff]">
                <span>Admin</span> <span className="opacity-50">›</span> <span>Insights Center</span>
              </div>
              <h1 className="text-[32px] font-bold tracking-tight text-white leading-none">
                Advanced Analytics
              </h1>
              <p className="text-[13px] text-slate-400 mt-2">{data?.totalUsers || 0} total users · {data?.activeSessions || 0} active sessions</p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700/60 text-[12px] font-bold text-slate-300 hover:bg-slate-800 transition">
                <RefreshCw size={14} /> Refresh
              </button>
              <div className="flex items-center gap-2 bg-[#1b2336] p-1.5 rounded-xl border border-slate-800">
                 <button className="px-4 py-2 rounded-lg text-[12px] font-bold text-slate-400 hover:text-white transition">Weekly</button>
                 <button className="px-5 py-2 rounded-lg bg-[#a682ff]/20 text-[#c8a8ff] text-[12px] font-bold shadow-sm border border-[#a682ff]/20">Monthly</button>
                 <button className="px-4 py-2 rounded-lg text-[12px] font-bold text-slate-400 hover:text-white transition">Yearly</button>
              </div>
            </div>
          </section>

          {/* Top Row: Chart + 2 Small Cards */}
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            
            {/* User Acquisition Chart */}
            <div className="bg-[#181f30]/80 border border-slate-800/60 rounded-[24px] p-7 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
               <div className="flex justify-between items-start z-10">
                 <div>
                   <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Growth Analytics</p>
                   <h2 className="text-2xl font-bold text-white">User Acquisition</h2>
                   <p className="text-[12px] text-slate-500 mt-1">{data?.totalUsers || 0} total registered users</p>
                 </div>
                 <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg text-emerald-400 text-[11px] font-bold">
                    <TrendingUp size={14} /> 24.8%
                 </div>
               </div>

               {/* CSS/SVG Area Chart */}
               <div className="w-full h-[200px] mt-8 relative z-10 flex flex-col justify-end">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#c8a8ff" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#c8a8ff" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                     {data.acquisitionData && data.acquisitionData.length > 0 && (() => {
                        const maxUsers = Math.max(...data.acquisitionData.map(d => d.users)) * 1.5 || 10;
                        const points = data.acquisitionData.map((d, i) => ({
                          x: (i * 100) / (data.acquisitionData.length - 1),
                          y: 90 - (d.users / maxUsers) * 80
                        }));
                        
                        let dStr = `M ${points[0].x} ${points[0].y}`;
                        for (let i = 0; i < points.length - 1; i++) {
                           const p0 = points[i];
                           const p1 = points[i+1];
                           const cx = p0.x + (p1.x - p0.x) / 2;
                           dStr += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
                        }
                        
                        return (
                          <>
                            <path d={`${dStr} L 100 100 L 0 100 Z`} fill="url(#grad1)" />
                            <path d={dStr} fill="none" stroke="#e0cfff" strokeWidth="2" strokeLinecap="round" />
                          </>
                        )
                     })()}
                  </svg>
                  <div className="flex justify-between w-full mt-4 absolute bottom-[-30px]">
                     {(data?.acquisitionData || []).map((p, i) => (
                       <span key={i} className="text-[11px] font-medium text-slate-500">{p.month}</span>
                     ))}
                  </div>
               </div>
            </div>

            {/* Right Side Cards */}
            <div className="flex flex-col gap-6">
              
              <div className="bg-[#181f30]/80 border border-slate-800/60 rounded-[24px] p-7 shadow-xl flex-1 flex flex-col justify-center">
                 <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Avg Session Time</p>
                 <div className="flex items-baseline gap-2 mb-6">
                   <h2 className="text-[40px] font-bold text-white leading-none">{data?.avgSessionTime || 45}</h2>
                   <span className="text-slate-400 font-medium">min</span>
                 </div>
                 <div className="h-2 w-full bg-slate-800 rounded-full mb-4">
                   <div className="h-full bg-indigo-500 w-[70%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                 </div>
                 <p className="text-[11px] text-slate-500 flex items-center gap-1.5">⚡ 12% increase from last month</p>
              </div>

              <div className="bg-[#181f30]/80 border border-slate-800/60 rounded-[24px] p-7 shadow-xl flex-1 flex flex-col justify-center">
                 <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">Session Success Rate</p>
                 <div className="flex items-baseline gap-2 mb-6">
                   <h2 className="text-[40px] font-bold text-white leading-none">{data?.successRate || 0}</h2>
                   <span className="text-slate-400 font-medium">%</span>
                 </div>
                 <div className="flex gap-2 h-8 mb-4">
                   <div className="flex-1 bg-indigo-400/20 rounded"></div>
                   <div className="flex-1 bg-indigo-400/40 rounded"></div>
                   <div className="flex-1 bg-indigo-400/60 rounded"></div>
                   <div className="flex-1 bg-indigo-400/80 rounded"></div>
                   <div className="flex-1 bg-[#c8a8ff] rounded shadow-[0_0_15px_rgba(200,168,255,0.4)]"></div>
                 </div>
                 <p className="text-[11px] text-slate-500">Based on {data?.completedSessions || 0} completed sessions</p>
              </div>

            </div>
          </section>

          {/* Middle Row: Trending Skills + Session Success */}
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            
            {/* Trending Skills - Live Data */}
            <div className="bg-[#181f30]/80 border border-slate-800/60 rounded-[24px] p-7 shadow-xl">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-xl font-bold text-white">Trending Skills</h2>
                 <button className="text-slate-500 hover:text-white transition p-1"><MoreHorizontal size={20} /></button>
               </div>

               <div className="space-y-6">
                 {(data?.trendingSkills || []).map((skill, i) => (
                   <div key={skill.name}>
                     <div className="flex justify-between items-end mb-2">
                       <span className="text-[13px] font-bold text-slate-200">{skill.name}</span>
                       <span className="text-[11px] text-slate-400 font-medium font-mono">{skill.count} learners · {skill.percentage}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-800/60 rounded-full">
                       <div className="h-full bg-[#ae8bff] rounded-full shadow-[0_0_8px_rgba(174,139,255,0.3)]" style={{ width: `${Math.min(skill.percentage * 2, 100)}%` }}></div>
                     </div>
                   </div>
                 ))}
                 {(!data?.trendingSkills || data.trendingSkills.length === 0) && (
                   <p className="text-slate-500 text-sm text-center py-4">No skill data available yet</p>
                 )}
               </div>
            </div>

            {/* Session Success Donut */}
            <div className="bg-[#181f30]/80 border border-slate-800/60 rounded-[24px] p-7 shadow-xl flex flex-col justify-between">
               <h2 className="text-xl font-bold text-white mb-2">Session Success</h2>
               
               <div className="flex-1 flex items-center justify-center my-6">
                 <div className={`relative w-40 h-40 rounded-full flex items-center justify-center p-4 shadow-[0_0_30px_rgba(189,145,255,0.15)]`} style={{ background: `conic-gradient(#bd91ff 0 ${(data?.successRate || 0) * 3.6}deg, #1e263a ${(data?.successRate || 0) * 3.6}deg 360deg)` }}>
                    <div className="w-full h-full bg-[#181f30] rounded-full flex flex-col items-center justify-center shadow-inner">
                       <span className="text-3xl font-bold text-white">{data?.successRate || 0}%</span>
                       <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-1">Rate</span>
                    </div>
                 </div>
               </div>

               <div className="flex gap-4">
                 <div className="flex-1 bg-[#121827] border border-slate-800 rounded-xl p-3">
                   <div className="flex items-center gap-1.5 mb-2">
                     <span className="w-2 h-2 rounded-full bg-[#bd91ff]"></span>
                     <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Completed</span>
                   </div>
                   <p className="text-lg font-bold text-white whitespace-nowrap">{data?.completedSessions || 0}</p>
                 </div>
                 <div className="flex-1 bg-[#121827] border border-slate-800 rounded-xl p-3">
                   <div className="flex items-center gap-1.5 mb-2">
                     <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                     <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Active</span>
                   </div>
                   <p className="text-lg font-bold text-white whitespace-nowrap">{data?.activeSessions || 0}</p>
                 </div>
               </div>
            </div>

          </section>

          {/* Bottom Row: Matching Efficiency */}
          <section className="bg-[#181f30]/80 border border-slate-800/60 rounded-[24px] p-7 shadow-xl">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <div>
                  <h2 className="text-xl font-bold text-white mb-1">Matching Efficiency</h2>
                  <p className="text-[13px] text-slate-400">Cross-reference matching algorithm performance</p>
               </div>
               <button onClick={handleExport} className="flex items-center gap-2 px-6 py-2.5 bg-slate-800/40 border border-slate-700/60 rounded-xl text-[13px] font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition">
                 <Download size={16} /> Export Detailed Report
               </button>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                <div className="hidden lg:block w-px h-12 bg-slate-800 absolute left-[25%] top-1/2 -translate-y-1/2"></div>
                <div className="hidden lg:block w-px h-12 bg-slate-800 absolute left-[50%] top-1/2 -translate-y-1/2"></div>
                <div className="hidden lg:block w-px h-12 bg-slate-800 absolute left-[75%] top-1/2 -translate-y-1/2"></div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                    <Network size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Network Density</p>
                    <p className="text-2xl font-bold text-white">{data?.networkDensity || '—'}</p>
                    <p className="text-[9px] text-emerald-400 font-medium">+0.05 index</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                    <Search size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Search Relevancy</p>
                    <p className="text-2xl font-bold text-white">{data?.searchRelevancy || '—'}</p>
                    <p className="text-[9px] text-slate-500 font-medium">Industry leading</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                    <TriangleAlert size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Churn Risk</p>
                    <p className="text-2xl font-bold text-white">{data?.churnRisk || '—'}</p>
                    <p className="text-[9px] text-red-400 font-medium">Low risk zone</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Api Latency</p>
                    <p className="text-2xl font-bold text-white">{data?.apiLatency || '—'}</p>
                    <p className="text-[9px] text-emerald-400 font-medium">Stable connection</p>
                  </div>
                </div>

             </div>
          </section>

        </div>
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertOctagon size={20} />}
          <span className="text-[13px] font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;