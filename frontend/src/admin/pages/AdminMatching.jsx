import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { ListFilter, CheckCircle, AlertOctagon, ArrowRight, Activity, Users, Layers, Filter, Clock, CheckCircle2, History } from "lucide-react";
import adminApi from "../adminApi";

const statusStyles = {
  ONGOING: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/20",
  COMPLETED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  PENDING: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  REJECTED: "bg-red-500/15 text-red-300 border-red-500/20",
};

const AdminMatching = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, ONGOING, COMPLETED, PENDING
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ ongoing: 0, completed: 0, pending: 0 });

  const fetchRealMatches = async () => {
    try {
      const response = await adminApi.get("/admin/sessions");
      const data = response.data.sessions || [];
      setSessions(data);
      setFilteredSessions(data);
      
      const ongoing = data.filter(s => s.status === 'ONGOING').length;
      const completed = data.filter(s => s.status === 'COMPLETED').length;
      const pending = data.filter(s => s.status === 'PENDING').length;
      setStats({ ongoing, completed, pending });
    } catch (err) {
      setError("Failed to fetch live exchange data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealMatches();
  }, []);

  useEffect(() => {
    if (activeTab === "ALL") {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(s => s.status === activeTab));
    }
  }, [activeTab, sessions]);

  if (loading) return <div className="min-h-screen bg-[#0f1523] text-violet-300 flex items-center justify-center">Synchronizing Global Match Lattice...</div>;

  return (
    <div className="min-h-screen bg-[#0f1523] text-slate-50 font-sans selection:bg-violet-500/30">
      <AdminNavbar />

      <main className="ml-[200px] min-h-screen pt-20 px-8 pb-10">
        <div className="max-w-[1200px] mx-auto space-y-8">
          
          {/* Header row */}
          <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                 <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-violet-400">Match Registry Alpha</span>
              </div>
              <h1 className="text-[36px] font-black tracking-tighter text-white mb-2 leading-none">
                All Matches
              </h1>
              <p className="text-[14px] text-slate-400 max-w-xl mt-4 italic">
                 Comprehensive audit of every knowledge exchange bridge established within the Skill Mandala ecosystem.
              </p>
            </div>

            <div className="flex items-center gap-3">
               <div className="bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
                  {[
                    { id: "ALL", label: "Full Registry", icon: <History size={14}/> },
                    { id: "ONGOING", label: "Active", icon: <Activity size={14}/> },
                    { id: "COMPLETED", label: "Synthesized", icon: <CheckCircle2 size={14}/> },
                    { id: "PENDING", label: "Pending", icon: <Clock size={14}/> }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}>
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
               </div>
            </div>
          </section>

          {/* Audit Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
             {[
               { label: "Total Pairs", val: sessions.length, icon: <Users />, color: "text-white" },
               { label: "Currently Weaving", val: stats.ongoing, icon: <Activity />, color: "text-fuchsia-400" },
               { label: "Successful Synthesis", val: stats.completed, icon: <CheckCircle />, color: "text-emerald-400" },
               { label: "Temporal Latency", val: "24m", icon: <Layers />, color: "text-indigo-400" }
             ].map((m, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[32px] p-6 relative overflow-hidden group">
                   <div className="flex flex-col gap-1 relative z-10">
                      <h3 className="text-[9px] font-black uppercase tracking-[2px] text-slate-500 mb-2">{m.label}</h3>
                      <div className="flex items-end gap-3">
                         <p className={`text-3xl font-black ${m.color}`}>{m.val}</p>
                      </div>
                   </div>
                </div>
             ))}
          </section>

          {/* Matches List Section */}
          <section className="space-y-6 pt-4">
             <div className="grid grid-cols-1 gap-4">
               {filteredSessions.map((session) => (
                 <div key={session.id} className="bg-[#121827]/80 border border-slate-800/60 rounded-[32px] p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-violet-500/30 hover:bg-[#161d2e] transition-all group shadow-xl">
                   
                   {/* Compact Exchange Pairing */}
                   <div className="flex items-center gap-8 lg:w-[50%]">
                      {/* Person 1 */}
                      <div className="flex items-center gap-4 w-[160px]">
                         <div className="h-12 w-12 rounded-2xl bg-slate-800 p-0.5 border border-slate-700 relative overflow-hidden group-hover:border-violet-500/50 transition duration-500">
                            <img src={session.p1.img} alt="p1" className="w-full h-full object-cover rounded-[14px]" />
                         </div>
                         <div>
                            <p className="text-[13px] font-black text-white leading-tight truncate">{session.p1.name}</p>
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Requester</span>
                         </div>
                      </div>

                      {/* Knowledge Bridge */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                         <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-black text-violet-400 uppercase tracking-tighter">
                            {session.skill}
                         </div>
                         <div className="relative w-full h-px bg-slate-800">
                            <ArrowRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-700 bg-[#121827] px-1" />
                         </div>
                         <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black border uppercase tracking-[1px] ${statusStyles[session.status]}`}>
                            {session.status}
                         </span>
                      </div>

                      {/* Person 2 */}
                      <div className="flex items-center gap-4 w-[160px] flex-row-reverse text-right">
                         <div className="h-12 w-12 rounded-2xl bg-slate-800 p-0.5 border border-slate-700 relative overflow-hidden group-hover:border-violet-500/50 transition duration-500">
                            <img src={session.p2.img} alt="p2" className="w-full h-full object-cover rounded-[14px]" />
                         </div>
                         <div>
                            <p className="text-[13px] font-black text-white leading-tight truncate">{session.p2.name}</p>
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Contributor</span>
                         </div>
                      </div>
                   </div>

                   {/* Meta Details */}
                   <div className="lg:w-[35%] flex items-center justify-end gap-10">
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Exchange ID</p>
                         <p className="text-[12px] font-mono text-slate-400">#MX-{session.id.toString().padStart(4, '0')}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Context</p>
                         <p className="text-[13px] font-bold text-slate-200">1v1 Web Sync</p>
                      </div>
                      <button className="p-2.5 rounded-xl bg-slate-800/80 text-slate-500 hover:text-white hover:bg-slate-700 transition">
                         <ListFilter size={16} />
                      </button>
                   </div>
                 </div>
               ))}

               {filteredSessions.length === 0 && (
                 <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-[48px] py-40 text-center">
                    <Activity size={64} className="mx-auto text-slate-800 mb-8" />
                    <h3 className="text-3xl font-black text-slate-700">Filter Sequence Empty</h3>
                    <p className="text-slate-800 max-w-sm mx-auto">No matches found within the '{activeTab}' segment of the registry.</p>
                 </div>
               )}
             </div>
          </section>

        </div>
      </main>

      {/* Audit Toast */}
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-8 py-5 rounded-[24px] bg-red-500/90 text-white shadow-2xl flex items-center gap-4 border border-white/20">
           <AlertOctagon size={24} />
           <p className="text-[15px] font-black">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AdminMatching;
