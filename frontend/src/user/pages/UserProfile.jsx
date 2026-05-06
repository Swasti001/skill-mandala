import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, X, Plus, Save, Camera, BookOpen, 
  RefreshCw, MessageSquare, UserPlus, MapPin, Award, Star,
  Image as ImageIcon, Trash2, Mail, Phone, Edit3, AlertOctagon,
  ArrowUpRight
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useUser } from "../../context/UserContext";
import Avatar from "../components/Avatar";
import MatchAnimation from "../components/MatchAnimation";
import api from "../api";

/**
 * UserProfile Component
 * A high-end profile dashboard with full editing capabilities and portfolio management.
 */
const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refreshUser } = useUser();
  
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isOwner = !id || id === currentUserId;
  const targetId = id || currentUserId;

  const [user, setUser] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Edit States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editTeachSkills, setEditTeachSkills] = useState([]);
  const [editLearnSkills, setEditLearnSkills] = useState([]);
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [newTeachSkill, setNewTeachSkill] = useState("");
  const [newLearnSkill, setNewLearnSkill] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [pendingPortfolioFile, setPendingPortfolioFile] = useState(null);
  const [showPortfolioConfirm, setShowPortfolioConfirm] = useState(false);
  
  const [profileStats, setProfileStats] = useState({ sessions: 0, matches: 0 });
  const [connectionStatus, setConnectionStatus] = useState("NONE");
  
  const [showMatch, setShowMatch] = useState(false);
  const [exchangeInfo, setExchangeInfo] = useState(null);

  // Report States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState("HARASSMENT");
  const [reportDesc, setReportDesc] = useState("");
  const [reporting, setReporting] = useState(false);

  // Availability States
  const [editTeachAvailability, setEditTeachAvailability] = useState({});
  const [editLearnAvailability, setEditLearnAvailability] = useState({});

  const fileInputRef = React.useRef(null);
  const portfolioInputRef = React.useRef(null);

  const parseJson = (json, defaultValue = {}) => {
    try {
      if (!json) return defaultValue;
      if (typeof json === 'object' && json !== null) return json;
      const parsed = typeof json === 'string' ? JSON.parse(json) : defaultValue;
      return (parsed === null || parsed === undefined) ? defaultValue : parsed;
    } catch (e) {
      return defaultValue;
    }
  };

  const fetchProfileData = React.useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = isOwner ? "/user/me" : `/user/${targetId}`;
      const userRes = await api.get(endpoint);
      const userData = userRes.data;
      
      setUser(userData);
      setEditName(userData.name || userData.username || "");
      setEditEmail(userData.email || "");
      setEditPhone(userData.phone || "");
      setPortfolioImages(parseJson(userData.portfolioImages, []));
      setConnectionStatus(userData.connectionStatus || "NONE");
      
        if (!isOwner) {
          setEditBio(userData.bio || "");
          setEditTeachSkills(parseJson(userData.teachSkills, []));
          setEditLearnSkills(parseJson(userData.learnSkills, []));
          setEditTeachAvailability(parseJson(userData.teachAvailability, {}));
          setEditLearnAvailability(parseJson(userData.learnAvailability, {}));
          setOnboarding(userData);
        } else {
          const obRes = await api.get(`/user/onboarding/${currentUserId}`);
          setOnboarding(obRes.data);
          setEditBio(obRes.data.bio || "");
          setEditTeachSkills(parseJson(obRes.data.teachSkills, []));
          setEditLearnSkills(parseJson(obRes.data.learnSkills, []));
          setEditTeachAvailability(parseJson(obRes.data.teachAvailability, {}));
          setEditLearnAvailability(parseJson(obRes.data.learnAvailability, {}));
        }
    } catch (err) {
      console.error("Profile fetch failed:", err);
      showToast("Could not load profile details.", "error");
    } finally {
      setLoading(false);
    }
  }, [isOwner, targetId, currentUserId, showToast]);

  useEffect(() => {
    if (token) fetchProfileData();
  }, [id, token, fetchProfileData]);

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        name: editName,
        bio: editBio,
        email: editEmail,
        phone: editPhone,
        profilePictureUrl: user?.profilePictureUrl,
        teachSkills: editTeachSkills,
        learnSkills: editLearnSkills,
        teachAvailability: editTeachAvailability,
        learnAvailability: editLearnAvailability,
        portfolioImages: portfolioImages
      };
      await api.put("/user/me", payload);
      await fetchProfileData();
      refreshUser(); // Global Navbar Sync
      showToast("Profile identity updated!", "success");
      setIsEditMode(false);
    } catch (err) {
      showToast("Failed to save changes.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.url) {
        // Update user state and notify backend of new URL
        const updatedUser = { ...user, profilePictureUrl: response.data.url };
        setUser(updatedUser);
        
        await api.put("/user/me", {
            ...updatedUser,
            teachSkills: editTeachSkills,
            learnSkills: editLearnSkills,
            portfolioImages: portfolioImages,
            bio: editBio
        });
        
        refreshUser();
        showToast("Avatar synchronized!", "success");
      }
    } catch (err) {
      showToast("Upload failed.", "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const triggerPortfolioUpload = (e) => {
     const file = e.target.files[0];
     if (!file) return;
     setPendingPortfolioFile(file);
     setShowPortfolioConfirm(true);
  };

  const handlePortfolioConfirm = async () => {
    if (!pendingPortfolioFile) return;
    try {
      setShowPortfolioConfirm(false);
      setUploadingPortfolio(true);
      const formData = new FormData();
      formData.append("file", pendingPortfolioFile);
      const response = await api.post("/user/upload-portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.url) {
        const updatedImages = [...portfolioImages, response.data.url];
        setPortfolioImages(updatedImages);
        // Persist to backend immediately for portfolio
        await api.put("/user/me", {
            name: editName,
            bio: editBio,
            email: editEmail,
            phone: editPhone,
            profilePictureUrl: user?.profilePictureUrl,
            teachSkills: editTeachSkills,
            learnSkills: editLearnSkills,
            portfolioImages: updatedImages
        });
        showToast("Work added to showcase!", "success");
      }
    } catch (err) {
      showToast("Failed to upload work.", "error");
    } finally {
      setUploadingPortfolio(false);
      setPendingPortfolioFile(null);
    }
  };

  const removePortfolioImage = async (url) => {
    const updatedImages = portfolioImages.filter(img => img !== url);
    setPortfolioImages(updatedImages);
    try {
        await api.put("/user/me", {
            name: editName,
            bio: editBio,
            email: editEmail,
            phone: editPhone,
            profilePictureUrl: user?.profilePictureUrl,
            teachSkills: editTeachSkills,
            learnSkills: editLearnSkills,
            portfolioImages: updatedImages
        });
    } catch (e) {}
  };

  const handleConnect = async () => {
    try {
        setSaving(true);
        const res = await api.post(`/user/matches/connect`, { 
            fromUser: currentUserId,
            toUser: targetId 
        });
        if (res.data.match) {
            setConnectionStatus("MATCHED");
            const common = res.data.commonSkills;
            setExchangeInfo({
                give: common?.teaching?.[0] || "Skill",
                receive: common?.learning?.[0] || "Knowledge"
            });
            setShowMatch(true);
        } else {
            showToast("Connection request sent!", "success");
            setConnectionStatus("REQUEST_SENT");
        }
    } catch (err) {
        showToast("Connection failed.", "error");
    } finally {
        setSaving(false);
    }
  };

  const handleReport = async () => {
    if (!reportDesc.trim()) {
        showToast("Please provide a description for the report.", "error");
        return;
    }
    try {
        setReporting(true);
        await api.post("/reports", {
            reportedId: targetId,
            category: reportCategory,
            description: reportDesc
        });
        showToast("Report submitted successfully. We will review it.", "success");
        setIsReportModalOpen(false);
        setReportDesc("");
    } catch (err) {
        showToast("Failed to submit report.", "error");
    } finally {
        setReporting(false);
    }
  };

  if (loading) return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-white">
      <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
      <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Syncing Mandala...</p>
    </div>
  );

  const displayName = user?.name || user?.username || "Weaver";

  return (
    <div className="w-full max-w-[1240px] mx-auto text-slate-100 flex flex-col gap-6 pt-6 px-6 pb-24 relative z-10 text-left overflow-hidden">
        <div className="fixed inset-0 pointer-events-none -z-10 bg-indigo-600/[0.02] blur-[150px]" />
        
        <MatchAnimation 
            isVisible={showMatch} 
            onClose={() => setShowMatch(false)} 
            otherUserName={user?.name || user?.username} 
            otherUserId={targetId} 
            otherUserProfilePictureUrl={user?.profilePictureUrl}
            exchangeInfo={exchangeInfo}
        />

        {/* Portfolio Confirmation Popup */}
        <AnimatePresence>
            {showPortfolioConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-[400px] bg-[#111827] border border-slate-700/60 rounded-[32px] p-10 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6"><ImageIcon size={28} /></div>
                        <h2 className="text-xl font-black text-white mb-3 tracking-tighter italic italic">Add to Showcase?</h2>
                        <p className="text-slate-400 text-[13px] leading-relaxed mb-8">Are you sure you want to add this work to your visual portfolio? This will be visible to all weavers.</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handlePortfolioConfirm} className="w-full py-4 rounded-xl bg-indigo-600 text-white font-black text-[12px] uppercase tracking-widest hover:bg-indigo-500 transition shadow-lg">Confirm & Sync</button>
                            <button onClick={() => { setShowPortfolioConfirm(false); setPendingPortfolioFile(null); }} className="w-full py-4 rounded-xl bg-white/5 text-slate-300 font-black text-[12px] uppercase tracking-widest hover:bg-white/10 transition">Cancel</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full h-[240px] lg:h-[280px] rounded-[3rem] bg-gradient-to-br from-indigo-950 via-[#0B101E] to-slate-950 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           {isOwner && (
               <button onClick={() => setIsEditMode(!isEditMode)} className="absolute top-8 right-8 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition backdrop-blur-md">
                   {isEditMode ? <><Plus className="rotate-45" size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Mode</>}
               </button>
           )}
        </motion.div>

        <div className="px-6 lg:px-12 -mt-24 relative z-10">
           <div className="glassmorphism rounded-[3.5rem] p-10 border border-white/5 shadow-2xl flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">
                 <div className="relative group p-1 rounded-[2.8rem] bg-gradient-to-br from-indigo-500 to-purple-500 shadow-2xl">
                    <Avatar src={user?.profilePictureUrl} name={displayName} size="xxl" className="rounded-[2.6rem] border-8 border-[#0B1224]" border={false} />
                    {isOwner && (
                        <>
                            {uploadingAvatar ? (
                                <div className="absolute inset-0 bg-black/60 rounded-[2.6rem] flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>
                            ) : (
                                <button onClick={() => fileInputRef.current.click()} className="absolute inset-2 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm border-2 border-white/20">
                                <Camera size={24} />
                                </button>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        </>
                    )}
                 </div>
                 <div className="text-center lg:text-left space-y-3 pb-2">
                    {isEditMode ? (
                        <input value={editName} onChange={e => setEditName(e.target.value)} className="bg-white/5 border border-white/10 p-2 rounded-xl text-3xl font-black italic italic tracking-tighter text-white" />
                    ) : (
                        <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter leading-none">{displayName}</h1>
                    )}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-slate-400 text-sm font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-2">@{user?.username}</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                       <span className="flex items-center gap-2"><MapPin size={16} /> Mandala Global</span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-4 pb-2">
                {!isOwner ? (
                <>
                    <button 
                        onClick={handleConnect} 
                        disabled={saving || connectionStatus === "MATCHED" || connectionStatus === "REQUEST_SENT"}
                        className={`px-10 py-5 rounded-2xl font-black uppercase text-[12px] tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95 ${
                            connectionStatus === "MATCHED" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                            : connectionStatus === "REQUEST_SENT"
                            ? "bg-slate-800 text-slate-500 border border-slate-700 opacity-60"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                    >
                        {connectionStatus === "MATCHED" ? <><Award size={18} /> Matched</> : connectionStatus === "REQUEST_SENT" ? <><RefreshCw size={18} /> Request Sent</> : <><UserPlus size={18} /> Connect</>}
                    </button>
                    {!isOwner && (
                        <button 
                            onClick={() => setIsReportModalOpen(true)}
                            className="p-5 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center justify-center shadow-xl"
                            title="Report User"
                        >
                            <AlertOctagon size={20} />
                        </button>
                    )}
                </>
              ) : isEditMode && (
                <button onClick={handleSaveProfile} disabled={saving} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Synchronize
                </button>
              )}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 mt-8">
           <div className="lg:col-span-8 space-y-8">
              <div className="glass-card rounded-[3rem] p-10">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8 flex items-center gap-2">Node Description (Bio) {isOwner && !isEditMode && <button onClick={() => setIsEditMode(true)}><Edit3 size={12} /></button>}</h2>
                 {isEditMode ? (
                     <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-[15px] font-medium text-slate-300 leading-relaxed focus:border-indigo-500 focus:outline-none transition-all resize-none" />
                 ) : (
                     <p className="text-xl font-medium text-slate-400 leading-relaxed">{onboarding?.bio || "Expert Weaver focused on high-fidelity knowledge exchange."}</p>
                 )}
              </div>

              {/* Visual Showcase */}
              <div className="glass-card rounded-[3rem] p-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 flex items-center gap-2">
                        <ImageIcon size={14} /> Visual Showcase
                    </h2>
                    {isOwner && (
                        <>
                            <button onClick={() => portfolioInputRef.current.click()} disabled={uploadingPortfolio} className="p-2 bg-white/5 rounded-lg border border-white/10 text-indigo-400 hover:bg-white/10 transition flex items-center gap-2 text-[10px] uppercase font-black tracking-widest">
                                {uploadingPortfolio ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Add Work
                            </button>
                            <input type="file" ref={portfolioInputRef} onChange={triggerPortfolioUpload} className="hidden" accept="image/*" />
                        </>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioImages.length > 0 ? portfolioImages.map((img, idx) => (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="group relative h-48 rounded-2xl overflow-hidden border border-white/10">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Work" />
                        <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                           {isOwner && (
                               <button onClick={() => removePortfolioImage(img)} className="p-3 bg-rose-500 text-white rounded-full shadow-lg"><Trash2 size={18} /></button>
                           )}
                           <button className="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white"><Plus size={18} /></button>
                        </div>
                      </motion.div>
                    )) : (
                        <div className="col-span-full py-12 text-center opacity-10 flex flex-col items-center">
                            <ImageIcon size={48} className="mb-2" />
                            <p className="text-[10px] uppercase font-black tracking-widest">No visual data yet</p>
                        </div>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="glass-card rounded-[3rem] p-10 border border-emerald-500/10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 italic">Teaching Tokens</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {editTeachSkills.map(s => (
                            <span key={s} className="px-5 py-2.5 bg-emerald-500/10 text-emerald-100 rounded-2xl text-[13px] font-bold border border-emerald-500/20 flex items-center gap-2">
                                {s} {isEditMode && <button onClick={() => setEditTeachSkills(editTeachSkills.filter(sk => sk !== s))} className="opacity-40 hover:opacity-100"><X size={12} /></button>}
                            </span>
                        ))}
                    </div>
                    {isEditMode && (
                        <form onSubmit={(e) => { e.preventDefault(); if (newTeachSkill.trim()) { setEditTeachSkills([...editTeachSkills, newTeachSkill.trim()]); setNewTeachSkill(""); } }} className="flex gap-2">
                            <input value={newTeachSkill} onChange={e => setNewTeachSkill(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-emerald-500 focus:outline-none" placeholder="Add Skill..." />
                            <button type="submit" className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all"><Plus size={14} /></button>
                        </form>
                    )}
                 </div>
                 <div className="glass-card rounded-[3rem] p-10 border border-indigo-500/10">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 italic">Learning Pursuits</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {editLearnSkills.map(s => (
                            <span key={s} className="px-5 py-2.5 bg-indigo-500/10 text-indigo-100 rounded-2xl text-[13px] font-bold border border-indigo-500/20 flex items-center gap-2">
                                {s} {isEditMode && <button onClick={() => setEditLearnSkills(editLearnSkills.filter(sk => sk !== s))} className="opacity-40 hover:opacity-100"><X size={12} /></button>}
                            </span>
                        ))}
                    </div>
                    {isEditMode && (
                        <form onSubmit={(e) => { e.preventDefault(); if (newLearnSkill.trim()) { setEditLearnSkills([...editLearnSkills, newLearnSkill.trim()]); setNewLearnSkill(""); } }} className="flex gap-2">
                            <input value={newLearnSkill} onChange={e => setNewLearnSkill(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none" placeholder="Add Skill..." />
                            <button type="submit" className="p-3 bg-indigo-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all"><Plus size={14} /></button>
                        </form>
                    )}
                 </div>
              </div>
           </div>
           
           <div className="lg:col-span-4 space-y-8">
              <div className="glass-card rounded-[3rem] p-10 bg-gradient-to-br from-[#12182B] to-[#0B101E]">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-10">Signal Connection</h2>
                 <div className="space-y-6">
                    <div className="space-y-1.5 px-1 py-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">Email Bridge</label>
                        {isEditMode ? (
                            <input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[13px] text-white focus:border-indigo-500 focus:outline-none" />
                        ) : (
                            <div className="flex items-center gap-3 text-slate-300"><Mail size={16} className="text-indigo-400 opacity-60" /> <span className="text-[14px] font-bold">{user?.email || "No email connected"}</span></div>
                        )}
                    </div>
                    <div className="space-y-1.5 px-1 py-1">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-600 block">Phone Frequency</label>
                        {isEditMode ? (
                            <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[13px] text-white focus:border-indigo-500 focus:outline-none" />
                        ) : (
                            <div className="flex items-center gap-3 text-slate-300"><Phone size={16} className="text-indigo-400 opacity-60" /> <span className="text-[14px] font-bold">{user?.phone || "+977-XXXXXXXXXX"}</span></div>
                        )}
                    </div>
                 </div>
              </div>

              <div className="glass-card rounded-[3rem] p-10 bg-[#0B101E] border border-white/5">
                 <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Mandala Wisdom</h2>
                 
                 <div className="space-y-8">
                    {/* Teaching Reputation */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Guide Aura</span>
                            <span className="text-xl font-black text-white italic">{user?.teachingReputation?.toFixed(1) || "5.0"}</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={14} fill={star <= (user?.teachingReputation || 5) ? "#10b981" : "none"} className={star <= (user?.teachingReputation || 5) ? "text-emerald-500" : "text-slate-800"} />
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{user?.totalTeachingSessions || 0} Sessions Led</p>
                    </div>

                    {/* Learning Reputation */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Seeker Clarity</span>
                            <span className="text-xl font-black text-white italic">{user?.learningReputation?.toFixed(1) || "5.0"}</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={14} fill={star <= (user?.learningReputation || 5) ? "#6366f1" : "none"} className={star <= (user?.learningReputation || 5) ? "text-indigo-500" : "text-slate-800"} />
                            ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{user?.totalLearningSessions || 0} Pursuits Finished</p>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 font-bold">Resonance</span>
                            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400 italic">
                                {(((user?.teachingReputation || 5) + (user?.learningReputation || 5)) / 2).toFixed(1)}
                            </span>
                        </div>
                    </div>
                 </div>
              </div>

              {/* AVAILABILITY SECTION */}
              <div className="glass-card rounded-[3rem] p-10 bg-gradient-to-br from-[#12182B] to-[#0B101E]">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-8 flex items-center gap-2">
                    <ArrowUpRight size={14} /> Availability Flow
                </h2>
                
                <div className="space-y-8">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                        <div key={day} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                            <span className="text-[12px] font-black uppercase tracking-widest text-slate-400">{day}</span>
                            
                            <div className="flex gap-4">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-bold uppercase text-emerald-500 block text-right">To Teach</span>
                                    {isEditMode ? (
                                        <select 
                                            value={(editTeachAvailability?.[day]) || ""} 
                                            onChange={(e) => setEditTeachAvailability({...editTeachAvailability, [day]: e.target.value})}
                                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="">Off</option>
                                            <option value="Morning">Morning</option>
                                            <option value="Afternoon">Afternoon</option>
                                            <option value="Evening">Evening</option>
                                        </select>
                                    ) : (
                                        <span className="text-[11px] font-bold text-slate-200 block text-right">{(editTeachAvailability?.[day]) || "None"}</span>
                                    )}
                                </div>
                                
                                <div className="space-y-1">
                                    <span className="text-[8px] font-bold uppercase text-indigo-400 block text-right">To Learn</span>
                                    {isEditMode ? (
                                        <select 
                                            value={(editLearnAvailability?.[day]) || ""} 
                                            onChange={(e) => setEditLearnAvailability({...editLearnAvailability, [day]: e.target.value})}
                                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="">Off</option>
                                            <option value="Morning">Morning</option>
                                            <option value="Afternoon">Afternoon</option>
                                            <option value="Evening">Evening</option>
                                        </select>
                                    ) : (
                                        <span className="text-[11px] font-bold text-slate-200 block text-right">{(editLearnAvailability?.[day]) || "None"}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
           </div>
        </div>

        {/* Report User Modal */}
        <AnimatePresence>
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        exit={{ scale: 0.9, opacity: 0 }} 
                        className="w-full max-w-[500px] bg-[#111827] border border-slate-700/60 rounded-[32px] p-8 shadow-2xl overflow-hidden relative"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-white italic tracking-tighter">Report Weaver</h2>
                            <button onClick={() => setIsReportModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition text-slate-400"><X size={20} /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reason Category</label>
                                <select 
                                    value={reportCategory}
                                    onChange={(e) => setReportCategory(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-white font-medium text-[14px] focus:outline-none focus:border-rose-500 transition cursor-pointer"
                                >
                                    <option value="HARASSMENT">Harassment or Abuse</option>
                                    <option value="POTENTIAL SCAM">Potential Scam / Fraud</option>
                                    <option value="INAPPROPRIATE CONTENT">Inappropriate Profile Data</option>
                                    <option value="SPAM">Spam Content</option>
                                    <option value="OTHER">Other Issue</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Detailed Description</label>
                                <textarea 
                                    rows={4}
                                    value={reportDesc}
                                    onChange={(e) => setReportDesc(e.target.value)}
                                    placeholder="Please provide details about the violation..."
                                    className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3.5 text-slate-200 font-medium text-[14px] focus:outline-none focus:border-rose-500 transition resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    onClick={handleReport}
                                    disabled={reporting}
                                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-black text-[12px] uppercase tracking-widest shadow-lg hover:from-rose-500 hover:to-rose-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {reporting ? <Loader2 className="animate-spin" size={16} /> : <AlertOctagon size={16} />}
                                    Submit Report
                                </button>
                                <button 
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="px-6 py-4 rounded-xl bg-white/5 text-slate-400 font-black text-[12px] uppercase tracking-widest hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </div>
  );
};

export default UserProfile;
