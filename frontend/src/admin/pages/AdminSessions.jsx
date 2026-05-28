import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Filter, Plus, RefreshCw, CheckCircle, Star, TrendingUp, Clock, Calendar, ShieldCheck, Eye, MessageSquare, XCircle, MoreVertical, AlertOctagon } from "lucide-react";
import adminApi from "../adminApi";

const AdminSessions = () => {
  const [sessionsData, setSessionsData] = useState([]);
  const [metrics, setMetrics] = useState({ totalOngoing: 0, completedToday: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSessions = async () => {
    try {
      const res = await adminApi.get("/admin/sessions");
      setSessionsData(res.data.sessions);
      setMetrics(res.data.metrics);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load sessions data");
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, []);

  const handleTerminate = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const res = await adminApi.put(`/admin/sessions/${id}/terminate`);
      showToast(res.data.message, "success");
      setSessionsData(prev => prev.filter(s => s.id !== id));
      fetchSessions();
    } catch (err) {
      showToast("Failed to terminate session", "error");
    }
    setActionLoading(prev => ({ ...prev, [id]: false }));
  };

  if (loading) return <div className="min-h-screen bg-[#0d121c] text-slate-50 font-sans flex items-center justify-center">Loading session matrix...</div>;
  if (error) return <div className="min-h-screen bg-[#0d121c] text-slate-50 font-sans flex items-center justify-center">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0d121c] text-slate-50 font-sans">
      <AdminNavbar />
      <main className="ml-[200px] min-h-screen pt-20 px-8 pb-10">
        <div className="max-w-[1100px] mx-auto space-y-8">
          
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-white mb-2 leading-none">Session Management</h1>
              <p className="text-[14px] text-slate-400">Monitor and orchestrate ongoing skill exchanges across the global network.</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 text-[13px] font-bold text-slate-300 hover:bg-slate-800 transition">
                <Filter size={16} /> Filters
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d8c3ff] to-[#bd91ff] text-[#2b1654] text-[13px] font-bold shadow-[0_4px_15px_-3px_rgba(189,145,255,0.4)] hover:opacity-90 transition">
                <Plus size={16} strokeWidth={2.5} /> Create Session
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-[#181e2d] border border-slate-800/60 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute right-4 top-4 text-slate-800/50"><RefreshCw size={56} strokeWidth={1} /></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a890d3] mb-1 relative">Total Ongoing</p>
                <h2 className="text-[38px] font-bold text-white mb-2 relative leading-none">{metrics.totalOngoing}</h2>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 relative"><TrendingUp size={14} /> 12% from last week</div>
             </div>
             <div className="bg-[#181e2d] border border-slate-800/60 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute right-4 top-4 text-slate-800/50"><CheckCircle size={56} strokeWidth={1} /></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a890d3] mb-1 relative">Completed Today</p>
                <h2 className="text-[38px] font-bold text-white mb-2 relative leading-none">{metrics.completedToday}</h2>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 relative">Target: 150/day</div>
             </div>
             <div className="bg-[#181e2d] border border-slate-800/60 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute right-4 top-4 text-slate-800/50"><Star size={56} strokeWidth={1} fill="currentColor" /></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a890d3] mb-1 relative">Average Rating</p>
                <div className="flex items-baseline gap-2 mb-2 relative">
                  <h2 className="text-[38px] font-bold text-white leading-none">{metrics.averageRating}</h2>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 relative">
                  <div className="flex text-white gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                  </div>
                  from 2.4k reviews
                </div>
             </div>
          </section>

          <section className="bg-[#121827]/80 border border-slate-800/80 rounded-[28px] p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[18px] font-bold text-white">Active Exchange Pipeline</h2>
              <div className="flex items-center gap-1 bg-slate-900/60 rounded-full p-1 border border-slate-800">
                 <button className="px-4 py-1.5 rounded-full bg-slate-800 text-[11px] font-bold text-slate-200">All Sessions</button>
                 <button className="px-4 py-1.5 rounded-full text-[11px] font-bold text-slate-400 hover:text-white transition">Disputed</button>
                 <button className="px-4 py-1.5 rounded-full text-[11px] font-bold text-slate-400 hover:text-white transition">Priority</button>
              </div>
            </div>

            <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_100px] gap-4 mb-3 px-4">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Participants</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Skill Exchanged</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Status</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Duration</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 text-right pr-2">Actions</span>
            </div>

            <div className="space-y-3">
              {sessionsData.map((session) => (
                <div key={session.id} className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_100px] gap-4 items-center bg-[#1a2133] border border-slate-700/40 rounded-[20px] p-4 hover:border-slate-600/50 transition">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                       <img src={session.p1.img} alt="p1" className="w-9 h-9 border-2 border-[#1a2133] rounded-full bg-slate-800" />
                       <img src={session.p2.img} alt="p2" className="w-9 h-9 border-2 border-[#1a2133] rounded-full bg-slate-800" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white mb-0.5">{session.p1.name} <span className="text-slate-500 text-[10px]">→</span> {session.p2.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{session.roleDesc}</p>
                    </div>
                  </div>
                  <div><p className="text-[13px] font-bold text-slate-200">{session.skill}</p></div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest
                      ${session.statusColor === 'purple' ? 'bg-[#c8a8ff]/10 text-[#c8a8ff] border border-[#c8a8ff]/20' : ''}
                      ${session.statusColor === 'blue' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : ''}
                      ${session.statusColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full ${session.statusColor === 'purple' ? 'bg-[#c8a8ff]' : ''} ${session.statusColor === 'blue' ? 'bg-blue-400' : ''} ${session.statusColor === 'emerald' ? 'bg-emerald-400' : ''}`}></span>
                      {session.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-medium text-slate-400">
                    {session.status === 'ONGOING' ? <Clock size={14} /> : session.status === 'PENDING' ? <Calendar size={14} /> : <ShieldCheck size={14} />} {session.durationText}
                  </div>
                  <div className="flex items-center justify-end gap-3 text-slate-500 pr-2">
                     <button className="hover:text-white transition"><Eye size={16} /></button>
                     {session.status === 'COMPLETED' ? (
                       <button className="hover:text-amber-400 transition"><Star size={16} /></button>
                     ) : (
                       <button className="hover:text-white transition"><MessageSquare size={16} /></button>
                     )}
                     {session.status === 'COMPLETED' ? (
                       <button className="hover:text-white transition"><MoreVertical size={16} /></button>
                     ) : (
                       <button disabled={actionLoading[session.id]} onClick={() => handleTerminate(session.id)} className="hover:text-red-400 transition disabled:opacity-50">
                         <XCircle size={16} />
                       </button>
                     )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 px-2">
               <span className="text-[11px] text-slate-400 font-medium">Showing {sessionsData.length} sessions</span>
               <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-slate-700/60 rounded-lg text-[11px] font-bold text-slate-400 hover:bg-slate-800 transition">Previous</button>
                  <button className="px-4 py-2 border border-slate-700/60 rounded-lg text-[11px] font-bold text-slate-400 hover:bg-slate-800 transition">Next</button>
               </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
             <div className="bg-[#181e2d] border border-slate-800/60 rounded-[28px] p-7 shadow-xl">
                <h2 className="text-lg font-bold text-white mb-8">Real-time Performance Hub</h2>
                <div className="flex items-end justify-between h-[180px] gap-2 px-2 mt-4">
                   {[{l:"MON",h:"40%"},{l:"TUE",h:"60%"},{l:"WED",h:"90%"},{l:"THU",h:"50%"},{l:"FRI",h:"35%"},{l:"SAT",h:"85%"},{l:"SUN",h:"25%"},{l:"MON",h:"55%"},{l:"TUE",h:"75%"},{l:"WED",h:"30%"}].map((bar, i) => (
                     <div key={i} className="flex flex-col items-center flex-1 gap-4">
                        <div className="w-full bg-[#121623] rounded-t-lg h-full flex flex-col justify-end">
                           <div className={`w-full rounded-t-md transition-all duration-300 ${i === 7 ? 'bg-[#9880c5]' : 'bg-[#484e62]'}`} style={{ height: bar.h }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{bar.l}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-[#181e2d] border border-slate-800/60 rounded-[28px] p-7 shadow-xl flex flex-col h-full">
                <h2 className="text-lg font-bold text-white mb-6">System Logs</h2>
                <div className="flex-1 space-y-6">
                   {[
                     { color: "bg-[#c8a8ff]", shadow: "rgba(200,168,255,0.6)", text: "Session #4821 verified by Mentor", time: "2 minutes ago" },
                     { color: "bg-blue-400", shadow: "rgba(96,165,250,0.6)", text: "Matching algorithm updated", time: "15 minutes ago" },
                     { color: "bg-orange-400", shadow: "rgba(251,146,60,0.6)", text: "Dispute raised in Session #4810", time: "42 minutes ago" },
                     { color: "bg-[#c8a8ff]", shadow: "rgba(200,168,255,0.6)", text: "New high-tier Mentor joined", time: "1 hour ago" }
                   ].map((log, i) => (
                     <div key={i} className="flex gap-4 items-start">
                       <span className={`w-2 h-2 rounded-full ${log.color} shrink-0 mt-1.5`} style={{ boxShadow: `0 0 10px ${log.shadow}` }}></span>
                       <div>
                         <p className="text-[12px] font-bold text-white mb-0.5">{log.text}</p>
                         <p className="text-[10px] text-slate-500 font-medium">{log.time}</p>
                       </div>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-700/60 text-[12px] font-bold text-slate-300 hover:bg-slate-800 transition">View All Events</button>
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

export default AdminSessions;
