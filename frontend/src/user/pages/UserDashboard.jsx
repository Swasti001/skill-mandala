import React, { useState, useEffect } from "react";
import api from "../api";
import { 
  Presentation, Loader2, Zap, 
  CheckCircle2, ArrowRight, AlertCircle,
  Star, Award, Bell, TrendingUp, Sparkles,
  Play, Calendar, Users, ShieldCheck, Coins,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Avatar from "../components/Avatar";
import MandalaTracker from "../components/MandalaTracker";

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userId = localStorage.getItem("userId");
  const userJson = localStorage.getItem("user");
  const localUser = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/user/dashboard/${userId}`);
        setData(response.data);
      } catch (error) {
        console.error("[UserDashboard] Failed to sync dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Loader2 className="w-16 h-16 text-indigo-400 opacity-20" />
        </motion.div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mt-8 animate-pulse">Neural Synchronization in Progress...</p>
      </div>
    );
  }

  const { 
    stats = {}, 
    recentMatches = [], 
    upcomingSessions = [], 
    todaySessions = [], 
    pendingIncomingSessions = [], 
    notifications = [], 
    badges = [] 
  } = data || {};
  const displayName = localUser?.name || "Weaver";

  // Identify "Live" session (Today)
  const liveSession = todaySessions?.[0]; // Strategy: Most immediate session for today
  const agendaSessions = todaySessions || [];
  const futureSessions = upcomingSessions || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-10 space-y-12 pb-32 text-left">
      
      {/* SECTION 1: Profile + Reputation + Credits */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-[#12182B]/40 backdrop-blur-2xl border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full -z-10" />
         <div className="flex items-center gap-8 relative z-10">
            <Avatar src={localUser?.profilePictureUrl} name={displayName} size="xl" border={true} className="rounded-3xl shadow-2xl scale-110" />
            <div className="space-y-3">
               <h1 className="text-4xl font-black text-white tracking-tighter leading-none inline-flex items-center gap-3">
                  {displayName} <ShieldCheck className="text-indigo-400" size={24} />
               </h1>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">{t('guide_aura')}</span>
                     <div className="flex gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(stats?.teachingReputation || 5) ? "currentColor" : "none"} className={i < Math.floor(stats?.teachingReputation || 5) ? "" : "opacity-20"} />)}
                     </div>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{t('seeker_clarity')}</span>
                     <div className="flex gap-0.5 text-indigo-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(stats?.learningReputation || 5) ? "currentColor" : "none"} className={i < Math.floor(stats?.learningReputation || 5) ? "" : "opacity-20"} />)}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex flex-col items-end gap-3 p-8 bg-black/20 rounded-[32px] border border-white/5 shadow-inner">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Universal Credits</span>
            <div className="flex items-center gap-4">
               <Coins className="text-amber-400" size={32} />
               <span className="text-5xl font-black text-white tracking-tighter">{stats?.credits?.toLocaleString()}</span>
            </div>
            <button onClick={() => navigate("/wallet")} className="mt-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition">Manage Assets →</button>
         </div>
      </header>

      {/* MANDALA HABIT TRACKER (CENTERPIECE) */}
      <MandalaTracker 
        streak={stats?.currentStreak || 5} 
        teachingHours={stats?.totalTeachingSessions || 0} 
        learningHours={stats?.totalLearningSessions || 0} 
        completedGoals={3} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* LEFT COLUMN: Actions & Live */}
        <div className="lg:col-span-2 space-y-12">
           
           {/* SECTION 3: Active Session (If Live) */}
           {liveSession && (
             <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-4 right-6 flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full animate-pulse">
                   <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Channel Live</span>
                </div>
                <div className="relative z-10 space-y-6">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Priority Action Required</span>
                   <h2 className="text-4xl font-black tracking-tighter leading-none">Your session with <span className="underline decoration-indigo-400 decoration-4 underline-offset-8">{liveSession.otherUserName}</span> is ready.</h2>
                   <p className="text-white/70 text-lg font-medium max-w-xl">Deep dive into <span className="text-white font-bold">{liveSession.topic}</span>. Ensure your camera and aura are tuned.</p>
                   <div className="flex gap-4 pt-4">
                      <button onClick={() => navigate("/sessions")} className="px-8 py-5 rounded-2xl bg-white text-indigo-600 text-sm font-black uppercase tracking-widest shadow-xl hover:scale-105 transition flex items-center gap-3">
                         <Play size={18} fill="currentColor" /> Initialize Zoom
                      </button>
                   </div>
                </div>
                <Sparkles className="absolute -bottom-10 -right-10 opacity-20" size={200} />
             </motion.div>
           )}

           {/* SECTION 2: Today’s Sessions */}
           <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 inline-flex items-center gap-3">
                    <Calendar size={16} /> Today's Agenda
                 </h3>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{todaySessions.length} Events Scheduled</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {agendaSessions.length > 0 ? agendaSessions.map(session => (
                    <div key={session.sessionId} className="bg-[#1C2333]/40 border border-white/5 rounded-3xl p-8 hover:bg-[#1C2333]/80 transition group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition">
                          <ArrowRight size={20} className="text-indigo-400" />
                       </div>
                       <Avatar src={session.otherUserProfilePictureUrl} name={session.otherUserName} size="sm" border={false} className="mb-6 rounded-2xl" />
                       <h4 className="text-[20px] font-black text-white leading-tight mb-2">{session.topic}</h4>
                       <p className="text-[12px] text-slate-500 font-bold mb-6 flex items-center gap-2">
                          {session.dateTime} • <span className="text-indigo-400">{session.mode}</span>
                       </p>
                       <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{session.status}</span>
                       </div>
                    </div>
                 )) : (
                    <div className="md:col-span-2 p-16 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center opacity-40">
                       <p className="text-[10px] font-black uppercase tracking-[0.3em]">Temporal Void: No sessions scheduled today</p>
                    </div>
                 )}
              </div>
           </section>

           {/* SECTION 2: Upcoming Horizon */}
           <section className="space-y-6 pt-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 inline-flex items-center gap-3">
                    <TrendingUp size={16} /> Upcoming Horizon
                 </h3>
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{futureSessions.length} Future Syncs</span>
              </div>
              <div className="space-y-3">
                 {futureSessions.length > 0 ? futureSessions.map(session => (
                    <div key={session.sessionId} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition cursor-pointer" onClick={() => navigate("/sessions")}>
                       <div className="flex items-center gap-6">
                          <Avatar src={session.otherUserProfilePictureUrl} name={session.otherUserName} size="xs" border={false} className="rounded-xl" />
                          <div>
                             <p className="text-[14px] font-bold text-white mb-0.5">{session.topic}</p>
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{session.dateTime}</p>
                          </div>
                       </div>
                       <ChevronRight className="text-slate-600" size={16} />
                    </div>
                 )) : (
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] text-center py-10">No future vibrations detected</p>
                 )}
              </div>
           </section>

           {/* SECTION 4: Matches (Social Layer) */}
           <section className="space-y-6 pt-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 inline-flex items-center gap-3">
                    <Users size={16} /> Neural Resonators (Matches)
                 </h3>
                 <button onClick={() => navigate("/skill-hub")} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition">Explore Hub →</button>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
                 {recentMatches?.map(match => (
                    <motion.div key={match.userId} whileHover={{ y: -5 }} className="min-w-[280px] bg-[#0B101E]/60 border border-white/5 rounded-[32px] p-6 space-y-6 hover:border-indigo-500/30 transition cursor-pointer" onClick={() => navigate(`/profile/${match.userId}`)}>
                       <div className="flex items-center gap-4">
                          <Avatar src={match.profilePictureUrl} name={match.name} size="sm" border={false} className="rounded-xl shadow-lg" />
                          <div>
                             <h4 className="text-[15px] font-black text-white leading-tight">{match.name}</h4>
                             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{match.score}% Resonance</p>
                          </div>
                       </div>
                       <div className="flex flex-wrap gap-1.5">
                          {match.theyTeachYou?.slice(0, 2).map(s => <span key={s} className="px-3 py-1 bg-white/5 text-white/50 text-[9px] font-black uppercase rounded-lg border border-white/5">{s}</span>)}
                       </div>
                    </motion.div>
                 ))}
              </div>
           </section>

        </div>

        {/* RIGHT COLUMN: Growth, Badges, Feed */}
        <div className="space-y-12">
            
            {/* SECTION 6 & 7: Growth & Badges */}
            <div className="bg-[#12182B]/60 backdrop-blur-xl border border-white/5 rounded-[40px] overflow-hidden">
               <div className="p-8 border-b border-white/5 bg-indigo-500/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 flex items-center gap-3">
                     <TrendingUp size={16} /> Mandala Mastery
                  </h3>
               </div>
               <div className="p-8 space-y-10">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Knowledge Given</span>
                        <span className="text-2xl font-black text-white leading-none">{stats?.totalTeachingSessions || 0}h</span>
                     </div>
                     <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Knowledge Gained</span>
                        <span className="text-2xl font-black text-white leading-none">{stats?.totalLearningSessions || 0}h</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Unlocked Archetypes</span>
                     <div className="flex flex-wrap gap-3">
                        {badges?.length > 0 ? badges.map(badge => (
                           <div key={badge} className="group relative">
                              <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center text-amber-400 shadow-xl hover:bg-amber-400 hover:text-[#0B101E] transition cursor-help">
                                 <Award size={24} />
                              </div>
                              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-[#0B101E] text-[8px] font-black uppercase rounded shadow-2xl opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">{badge}</span>
                           </div>
                        )) : (
                          <p className="text-[8px] italic text-slate-600 uppercase tracking-widest">Achieve greatness to unlock badges</p>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* SECTION 8: Notifications Feed */}
            <div className="bg-[#0B101E]/60 border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
               <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                     <Bell size={16} /> Mandala Feed
                  </h3>
               </div>
               <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto no-scrollbar">
                  {notifications?.length > 0 ? notifications.map((notif, idx) => (
                     <div key={idx} className="p-6 flex gap-4 hover:bg-white/5 transition group cursor-pointer">
                        <div className={`w-2 h-2 rounded-full mt-1.5 transition-all group-hover:scale-150 ${notif.isReadStatus ? 'bg-white/10' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                        <div className="space-y-1">
                           <p className="text-[13px] font-bold text-white leading-tight">{notif.message}</p>
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Pulse • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                     </div>
                  )) : (
                    <div className="p-10 text-center opacity-30 text-[9px] font-black uppercase tracking-[0.3em]">The flow is silent</div>
                  )}
               </div>
               <div className="p-8 bg-black/20 text-center border-t border-white/5">
                  <button className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition">Clear Stream</button>
               </div>
            </div>

            {/* SECTION 5: Feedback Reminder */}
            <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-[40px] text-center space-y-4 shadow-xl">
               <Sparkles className="mx-auto text-indigo-400" size={32} />
               <h4 className="text-[15px] font-black text-white leading-tight">Elevate the Ecosystem</h4>
               <p className="text-[11px] text-slate-500 font-medium leading-relaxed px-4 italic">Recent interactions contribute to your aura. Shared wisdom is verified wisdom.</p>
               <button onClick={() => navigate("/sessions")} className="w-full py-3 bg-white text-[#0B101E] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition">Provide Feedback</button>
            </div>

        </div>

      </div>

    </div>
  );
};

export default UserDashboard;
