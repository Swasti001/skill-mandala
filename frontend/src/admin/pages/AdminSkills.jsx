import React, { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { Filter, CheckCircle2, XCircle, TrendingUp, Sparkles, MessageSquare, Briefcase, Plus, Terminal, Trash2, Pencil, X, CheckCircle } from "lucide-react";
import axios from "axios";

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [metrics, setMetrics] = useState({ totalSkills: 0, activeLearners: 0, pendingReview: 0, engagementRate: "" });
  const [trending, setTrending] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("ADD"); // ADD or EDIT
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [formData, setFormData] = useState({ title: "", desc: "", category: "Engineering", iconId: 0, badge: "NEW" });
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  const getIcon = (id) => {
    switch (parseInt(id)) {
      case 0: return <Terminal size={16} className="text-indigo-400" />;
      case 1: return <Sparkles size={16} className="text-pink-400" />;
      case 2: return <MessageSquare size={16} className="text-blue-400" />;
      case 3: return <Briefcase size={16} className="text-emerald-400" />;
      case 4: return <TrendingUp size={16} className="text-amber-400" />;
      default: return <Sparkles size={16} className="text-indigo-400" />;
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/skills", { headers });
      setSkills(res.data.skillsList);
      setMetrics(res.data.metrics);
      setTrending(res.data.trendingSkill);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (mode, skill = null) => {
    setModalMode(mode);
    if (mode === "EDIT" && skill) {
        setSelectedSkill(skill);
        setFormData({ title: skill.title, desc: skill.desc, category: skill.category, iconId: skill.iconId, badge: skill.badge });
    } else {
        setFormData({ title: "", desc: "", category: "Engineering", iconId: 0, badge: "NEW" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "ADD") {
        await axios.post("http://localhost:8080/api/admin/skills", formData, { headers });
        showToast("Skill established in catalog!");
      } else {
        await axios.put(`http://localhost:8080/api/admin/skills/${selectedSkill.id}`, formData, { headers });
        showToast("Skill metadata synchronized!");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast("Audit failed. Check parameters.", "error");
    }
  };

  const handleDelete = async (id) => {
     if (!window.confirm("Commence skill decommissioning? This cannot be undone.")) return;
     try {
        await axios.delete(`http://localhost:8080/api/admin/skills/${id}`, { headers });
        showToast("Skill removed from catalog.");
        fetchData();
     } catch (err) {
        showToast("Failed to decommission skill.", "error");
     }
  };

  if (loading) return <div className="min-h-screen bg-[#0b101b] text-slate-50 font-sans flex items-center justify-center">Loading Skill Catalog...</div>;

  return (
    <div className="min-h-screen bg-[#0b101b] text-slate-50 font-sans">
      <AdminNavbar />

      <main className="ml-[200px] min-h-screen pt-20 px-8 pb-10">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header Row */}
          <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-white mb-2">Skill Catalog</h1>
              <p className="text-[15px] text-slate-400 max-w-2xl leading-relaxed">
                 Coordinate the institutional knowledge bank of the Mandala. Expand or refine the exchange taxonomy.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleOpenModal("ADD")}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#b687ff] hover:bg-[#a674f5] text-[#2d1b4e] text-[13px] font-bold transition shadow-[0_4px_20px_-4px_rgba(182,135,255,0.4)]">
                <Plus size={16} strokeWidth={2.5} /> Establish New Skill
              </button>
            </div>
          </section>

          {/* Metrics */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-5">
             {[
               { label: "Total Skills", val: metrics.totalSkills, sub: "Dynamic + Managed" },
               { label: "Active Learners", val: metrics.activeLearners, sub: "Global engagement" },
               { label: "Verified Review", val: metrics.pendingReview, sub: "High priority flags" },
               { label: "Network Vitality", val: metrics.engagementRate, sub: "Retention score" }
             ].map((m, i) => (
                <div key={i} className="bg-[#151c2c] border border-slate-700/40 rounded-2xl p-5">
                   <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2">{m.label}</p>
                   <p className="text-3xl font-semibold text-white mb-1">{m.val}</p>
                   <p className="text-[11px] text-slate-600">{m.sub}</p>
                </div>
             ))}
          </section>

          {/* Main Grid */}
          <section className="flex gap-6 items-start">
            <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-5">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-[#111726] border border-slate-700/30 rounded-3xl p-6 flex flex-col shadow-lg hover:border-violet-500/30 transition duration-300 group relative">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center border border-slate-700/50 group-hover:bg-slate-700/40 transition">
                      {getIcon(skill.iconId)}
                    </div>
                    <span className={`px-2.5 py-1 text-[9px] font-bold tracking-wider rounded-md uppercase ${skill.badgeColor}`}>
                      {skill.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{skill.title}</h3>
                  <p className="text-[13px] text-slate-400 leading-relaxed mb-6 flex-1 line-clamp-2">{skill.desc}</p>

                  <div className="flex gap-4 mb-6">
                    <div className="bg-[#0b101b] rounded-xl p-3 flex-1 border border-slate-800/80">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mb-1">Teachers</p>
                      <p className="text-lg font-semibold text-slate-200">{skill.teachers}</p>
                    </div>
                    <div className="bg-[#0b101b] rounded-xl p-3 flex-1 border border-slate-800/80">
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mb-1">Learners</p>
                      <p className="text-lg font-semibold text-slate-200">{skill.learners}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div className="flex gap-2">
                       {skill.isManaged && (
                         <>
                            <button onClick={() => handleOpenModal("EDIT", skill)} className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600/50 transition">
                                <Pencil size={15} />
                            </button>
                            <button onClick={() => handleDelete(skill.id)} className="w-9 h-9 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
                                <Trash2 size={15} />
                            </button>
                         </>
                       )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        {skill.isManaged ? "Institutional" : "Organic"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trending Sidebar */}
            <div className="hidden lg:block w-[340px] shrink-0 sticky top-24">
               <div className="bg-gradient-to-b from-[#111626] to-[#0c1220] border border-slate-700/50 rounded-[32px] p-8 shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center border border-indigo-400/20">
                       <TrendingUp size={24} strokeWidth={2.5} />
                    </div>
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-[10px] font-black uppercase">Top Velocity</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{trending.title || "Subject Prime"}</h2>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">This domain represents the highest engagement density within the last 30 network cycles.</p>
                  <div className="space-y-4">
                     <div className="flex justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <span className="text-xs text-slate-500">Mentorship Yield</span>
                        <span className="text-xs font-bold text-white">+88.4%</span>
                     </div>
                     <div className="flex justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <span className="text-xs text-slate-500">Exchange Depth</span>
                        <span className="text-xs font-bold text-white">Advanced</span>
                     </div>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#060b13]/80 backdrop-blur-md">
           <div className="bg-[#121b2d] border border-slate-700/60 rounded-[32px] p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition">
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold text-white mb-1">{modalMode === "ADD" ? "Establish Skill" : "Refine Metadata"}</h2>
              <p className="text-[13px] text-slate-500 mb-8">{modalMode === "ADD" ? "Provision a new domain into the global catalog." : "Adjust the taxonomy or descriptors for this skill."}</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block ml-1">Skill Title</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block ml-1">Description</label>
                    <textarea rows="3" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} required className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition resize-none"></textarea>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block ml-1">Icon Profile</label>
                        <select value={formData.iconId} onChange={(e) => setFormData({...formData, iconId: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition">
                            <option value="0">Terminal / Engineering</option>
                            <option value="1">Sparkles / Creative</option>
                            <option value="2">Message / Social</option>
                            <option value="3">Briefcase / Business</option>
                            <option value="4">Stats / Marketing</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block ml-1">Tag Profile</label>
                        <select value={formData.badge} onChange={(e) => setFormData({...formData, badge: e.target.value})} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition">
                            <option value="NEW">New</option>
                            <option value="HOT">Hot</option>
                            <option value="TRENDING">Trending</option>
                            <option value="CORE">Core</option>
                        </select>
                    </div>
                 </div>
                 <button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-4 rounded-xl shadow-lg hover:opacity-90 transition active:scale-[0.98]">
                    {modalMode === "ADD" ? "Authorize Entry" : "Commit Synchronized Edit"}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-10 duration-500 ${toast.type === 'success' ? 'bg-slate-900 border border-emerald-500/50 text-white' : 'bg-slate-900 border border-red-500/50 text-white'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
             {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertOctagon size={18} />}
          </div>
          <p className="text-[13px] font-bold">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

const AlertOctagon = ({ size }) => (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    </div>
);

export default AdminSkills;
