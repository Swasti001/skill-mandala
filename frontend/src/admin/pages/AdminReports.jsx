import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Filter, History, AlertCircle, AlertOctagon, ShieldCheck, Clock, Eye, Ban, AlertTriangle, X, Lock, CheckCircle } from "lucide-react";
import axios from "axios";

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("All Reports");
  const [showPanel, setShowPanel] = useState(false);
  const [reportsData, setReportsData] = useState([]);
  const [metrics, setMetrics] = useState({ pendingHighPriority: 0, totalReports24H: 0, moderatedToday: 0, avgResponseTime: "0m" });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/reports", { headers });
      setReportsData(res.data.reportsList);
      setMetrics(res.data.metrics);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReportAction = async (id, action, e) => {
    e.stopPropagation();
    setActionLoading(prev => ({ ...prev, [`${id}-${action}`]: true }));
    try {
      const res = await axios.put(`http://localhost:8080/api/admin/reports/${id}/${action}`, {}, { headers });
      showToast(res.data.message, "success");
      // Remove from the list with animation
      setReportsData(prev => prev.filter(r => r.id !== id));
      // Refresh metrics
      fetchData();
    } catch (err) {
      showToast("Action failed. Please try again.", "error");
    }
    setActionLoading(prev => ({ ...prev, [`${id}-${action}`]: false }));
  };

  if (loading) return <div className="min-h-screen bg-[#111623] text-slate-50 font-sans flex items-center justify-center">Loading Moderation Queue...</div>;

  return (
    <div className="min-h-screen bg-[#111623] text-slate-50 font-sans flex overflow-hidden">
      <AdminNavbar />

      <main className={`flex-1 min-h-screen pt-20 px-8 pb-10 transition-all duration-300 ${showPanel ? 'mr-[350px]' : ''} ml-[200px] overflow-y-auto`}>
        <div className="max-w-[1000px] mx-auto space-y-8">
          
          {/* Header */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-white mb-2 leading-none">
                Reports & Moderation
              </h1>
              <p className="text-[14px] text-slate-400">
                Review flagged content and maintain community safety protocols.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/30 text-[13px] font-bold text-slate-300 hover:bg-slate-800 transition">
                <Filter size={16} /> Filters
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d8c3ff] to-[#bd91ff] text-[#2b1654] text-[13px] font-bold shadow-[0_4px_15px_-3px_rgba(189,145,255,0.4)] hover:opacity-90 transition">
                <History size={16} /> Action Log
              </button>
            </div>
          </section>

          {/* Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-[#181f30] border border-slate-800/60 rounded-2xl p-5 shadow-lg relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                     <AlertOctagon size={18} />
                  </div>
                  <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-400">+12%</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">{metrics.pendingHighPriority}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pending High Priority</p>
             </div>

             <div className="bg-[#181f30] border border-slate-800/60 rounded-2xl p-5 shadow-lg relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                     <AlertCircle size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">Steady</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">{metrics.totalReports24H}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Total Reports 24H</p>
             </div>

             <div className="bg-[#181f30] border border-slate-800/60 rounded-2xl p-5 shadow-lg relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                     <ShieldCheck size={18} />
                  </div>
                  <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-400">99.2%</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">{metrics.moderatedToday}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Moderated Today</p>
             </div>

             <div className="bg-[#181f30] border border-slate-800/60 rounded-2xl p-5 shadow-lg relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                     <Clock size={18} />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-1">{metrics.avgResponseTime}</h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Avg. Response Time</p>
             </div>
          </section>

          {/* Report List Section */}
          <section className="bg-[#181f30]/60 border border-slate-800/50 rounded-[24px] p-6 shadow-xl">
             
             {/* Tabs & Sort */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
               <div className="flex flex-wrap gap-2">
                 {["All Reports", "Inappropriate Content", "Scams", "Harassment"].map((tab) => (
                   <button 
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition ${activeTab === tab ? "bg-[#c8a8ff] text-[#2b1654] shadow-sm" : "bg-slate-800/50 text-slate-400 hover:text-white"}`}
                   >
                     {tab}
                   </button>
                 ))}
               </div>
               <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  Sorted by: <span className="text-white">Urgency</span>
               </div>
             </div>

             {/* Reports List */}
             <div className="space-y-4">
               {reportsData.map((report) => (
                 <div key={report.id} className="bg-[#1f2639] border border-slate-700/60 rounded-[20px] p-5 flex flex-col xl:flex-row gap-6 relative overflow-hidden group hover:border-[#c8a8ff]/30 transition" onClick={() => setShowPanel(true)}>
                    
                    {/* Left Color Bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${report.color === 'red' ? 'bg-red-400' : report.color === 'purple' ? 'bg-[#c8a8ff]' : 'bg-slate-500'}`}></div>

                    {/* Icon & Details */}
                    <div className="flex items-start gap-4 flex-1 pl-2">
                       <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${report.color === 'red' ? 'bg-red-500/20 text-red-400' : report.color === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-400'}`}>
                          {report.color === 'red' ? <AlertOctagon size={20} /> : report.color === 'purple' ? <AlertTriangle size={20} /> : <Ban size={20} />}
                       </div>
                       <div>
                         <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${report.color === 'red' ? 'bg-red-500/10 text-red-400' : report.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>{report.priority}</span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{report.category}</span>
                         </div>
                         <h3 className="text-[16px] font-bold text-white mb-1.5">{report.title}</h3>
                         <p className="text-[13px] text-slate-400 line-clamp-1">{report.desc}</p>
                       </div>
                    </div>

                    {/* Users Info */}
                    <div className="flex items-center gap-8 xl:w-[350px] shrink-0">
                       {/* Reporter */}
                       <div className="flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">Reporter</p>
                          <div className="flex items-center gap-2.5">
                             {report.reporter.type === 'system' ? (
                               <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                  <span className="text-[8px] font-bold text-indigo-300 tracking-wider">SYS</span>
                               </div>
                             ) : report.reporter.type === 'text' ? (
                               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px] text-slate-300">
                                  {report.reporter.initials}
                               </div>
                             ) : (
                               <img src={report.reporter.img} alt="reporter" className="w-8 h-8 rounded-full" />
                             )}
                             <div>
                               <p className="text-[12px] font-bold text-white">{report.reporter.name}</p>
                               <p className="text-[10px] text-slate-400 font-medium">{report.reporter.sub}</p>
                             </div>
                          </div>
                       </div>
                       
                       {/* Reported */}
                       <div className="flex-1">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">Reported</p>
                          <div className="flex items-center gap-2.5">
                             {report.reported.type === 'text' ? (
                               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px] text-slate-300">
                                  {report.reported.initials}
                               </div>
                             ) : (
                               <img src={report.reported.img} alt="reported" className="w-8 h-8 rounded-full" />
                             )}
                             <div>
                               <p className="text-[12px] font-bold text-white">{report.reported.name}</p>
                               <p className="text-[10px] text-slate-400 font-medium">{report.reported.sub}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-center">
                       <button className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition" title="View Details" onClick={(e) => { e.stopPropagation(); setShowPanel(true); }}>
                         <Eye size={16} />
                       </button>
                       <button disabled={actionLoading[`${report.id}-resolve`]} onClick={(e) => handleReportAction(report.id, 'resolve', e)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-[12px] font-bold text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 transition disabled:opacity-50">
                         {actionLoading[`${report.id}-resolve`] ? '...' : 'Resolve'}
                       </button>
                       <button disabled={actionLoading[`${report.id}-warn`]} onClick={(e) => handleReportAction(report.id, 'warn', e)} className="px-5 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 text-[12px] font-bold hover:bg-indigo-500 hover:text-white transition disabled:opacity-50">
                         {actionLoading[`${report.id}-warn`] ? '...' : 'Warn'}
                       </button>
                       <button disabled={actionLoading[`${report.id}-ban`]} onClick={(e) => handleReportAction(report.id, 'ban', e)} className="px-5 py-2.5 rounded-xl bg-red-500/20 text-red-500 text-[12px] font-bold hover:bg-red-500 hover:text-white transition disabled:opacity-50">
                         {actionLoading[`${report.id}-ban`] ? '...' : 'Ban'}
                       </button>
                    </div>

                 </div>
               ))}
             </div>

             {/* Footer Pagination */}
             <div className="flex items-center justify-between mt-6 px-2">
                <span className="text-[11px] font-medium text-slate-400">Showing {reportsData.length} of {metrics.totalReports24H} reports</span>
                <div className="flex items-center gap-1.5">
                   <button className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 transition">&lt;</button>
                   <button className="w-8 h-8 rounded-lg bg-[#c8a8ff] text-[#2b1654] font-bold flex items-center justify-center">1</button>
                   <button className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition">2</button>
                   <button className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition">3</button>
                   <button className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 transition">&gt;</button>
                </div>
             </div>
          </section>

          {/* Floating Lock Action Botton */}
          <div className="fixed bottom-8 right-8 z-40">
            <button className="w-14 h-14 rounded-full bg-red-400/20 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-red-400 hover:text-[#2b1654] transition bg-gradient-to-br from-[#fcb3b3] to-[#e47e7e]">
               <Lock size={20} className="fill-[#2b1654] text-[#2b1654]" />
            </button>
          </div>

        </div>
      </main>

      {/* Slide-out Report Details Panel */}
      <aside className={`fixed top-0 right-0 bottom-0 w-[350px] bg-[#1a2133] border-l border-slate-700/60 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showPanel ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-lg font-bold text-white">Report Details</h2>
               <button className="text-slate-400 hover:text-white transition" onClick={() => setShowPanel(false)}>
                 <X size={20} />
               </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
               Select a report to view full conversation history and evidence logs.
            </div>
         </div>
      </aside>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-[slideIn_0.3s_ease] ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertOctagon size={20} />}
          <span className="text-[13px] font-bold">{toast.message}</span>
        </div>
      )}

    </div>
  );
};

export default AdminReports;
