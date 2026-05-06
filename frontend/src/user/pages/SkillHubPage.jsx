import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SlidersHorizontal, Heart, X, Star, MapPin, Monitor, 
  Users, Activity, Loader2, ArrowLeftRight,
  Sparkles, Zap
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Avatar";

const SkillHubPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchData, setMatchData] = useState(null);
  const { showToast } = useToast();

  const userId = localStorage.getItem("userId");
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const userName = user?.name || "You";

  useEffect(() => {
    if (!userId) {
      setError(t('login_required'));
      setLoading(false);
      return;
    }

    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/user/matches/${userId}`);
        setMatches(res.data || []);
      } catch (err) {
        console.error("Match fetching failed:", err);
        setError(t('action_failed'));
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userId, t]);

  const handleAction = async (actionType, targetUserId) => {
    try {
      const res = await api.post(`/user/matches/${actionType}`, {
        fromUser: userId,
        toUser: targetUserId
      });

      const result = res.data;
      if (result && result.match) {
        setMatchData(result);
        return;
      }

      if (actionType === 'connect') showToast(t('connection_requested'));
      if (actionType === 'reject') showToast(t('match_skipped'), "info");
      if (actionType === 'star') showToast(t('saved'));

      setMatches(prev => prev.filter(m => m.userId !== targetUserId));
      if (currentIndex >= matches.length - 1 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    } catch (err) {
      console.error(`Action ${actionType} failed:`, err);
      showToast(t('action_failed'), "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Loader2 className="w-12 h-12 text-[#C4B5FD]" />
        </motion.div>
        <p className="text-xs font-bold tracking-widest uppercase opacity-40 mt-4">{t('balancing_mandala')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white p-8 text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-20 h-20 bg-red-900/10 rounded-full flex items-center justify-center text-red-500 mb-6">
           <X size={32} />
        </motion.div>
        <h2 className="text-2xl font-black mb-2">{t('sync_error')}</h2>
        <p className="text-slate-400 text-sm max-w-sm font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-8 px-6 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition"> {t('retry')} </button>
      </div>
    );
  }

  const currentMatch = matches[currentIndex] || {};
  const isTopMatch = currentMatch?.score > 85;

  return (
    <div className="w-full max-w-[1240px] mx-auto pt-8 pb-32 px-6 relative z-10 overflow-hidden text-left">
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      <AnimatePresence>
        {matchData && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg bg-gradient-to-br from-indigo-950/50 to-slate-900/50 border border-white/10 rounded-[48px] p-10 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 z-[-5] overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: Math.random() * 400 - 200, y: Math.random() * 400 - 200, opacity: 0, scale: 0 }}
                    animate={{ x: Math.random() * 800 - 400, y: Math.random() * 800 - 400, opacity: [0, 0.4, 0], scale: [0, 2, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2 }}
                    className="absolute w-1 h-1 rounded-full bg-indigo-400 blur-[1px]"
                  />
                ))}
              </div>

              <motion.div initial={{ rotate: -10, scale: 0 }} animate={{ rotate: 0, scale: 1 }}>
                  <h2 className="text-[12px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">{t('mandala_synchronized')}</h2>
                  <h1 className="text-6xl font-black text-white mb-8 tracking-tighter shadow-white/10">{t('its_a_match')}</h1>
              </motion.div>
              
              <div className="flex justify-center items-center gap-6 mb-10">
                 <motion.div initial={{ x: -100, opacity: 0, rotate: -20 }} animate={{ x: 0, opacity: 1, rotate: -6 }} className="w-24 h-24 rounded-3xl bg-indigo-600/20 border-2 border-indigo-400/30 p-1">
                    <Avatar src={user?.profilePictureUrl} name={userName} size="lg" border={false} className="w-full h-full rounded-2xl" />
                 </motion.div>
                 <ArrowLeftRight className="text-white/40" size={32} />
                 <motion.div initial={{ x: 100, opacity: 0, rotate: 20 }} animate={{ x: 0, opacity: 1, rotate: 6 }} className="w-24 h-24 rounded-3xl bg-emerald-600/20 border-2 border-emerald-400/30 p-1">
                    <Avatar src={matchData.matchedUser.profilePictureUrl} name={matchData.matchedUser.name} size="lg" border={false} className="w-full h-full rounded-2xl" />
                 </motion.div>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-10">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 leading-none">{t('the_exchange')}</p>
                 <p className="text-white text-sm font-medium" dangerouslySetInnerHTML={{ __html: t('exchange_for', { teach: matchData.commonSkills.teach[0], learn: matchData.commonSkills.learn[0] }) }} />
              </div>

              <div className="flex flex-col gap-3">
                 <button onClick={() => navigate('/messages', { state: { autoSelectUserId: matchData.matchedUser.id }})} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest transition shadow-lg">{t('open_chat')}</button>
                 <button onClick={() => { setMatchData(null); setMatches(prev => prev.filter(m => m.userId !== matchData.matchedUser.id)); }} className="w-full py-4 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition">{t('continue_swiping')}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-[350px] w-full flex flex-col gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#A78BFA] shadow-sm">
              <Sparkles size={12} /> Mandala Match v4.0
            </div>
            <h1 className="text-5xl font-black text-white leading-[0.9] tracking-tighter">
              Skill <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#C4B5FD] to-[#8B5CF6]">Hub</span>
            </h1>
            <p className="text-slate-400 text-[14px] font-medium leading-relaxed max-w-[280px]">
              {t('hub_subtitle')}
            </p>
          </div>

          <div className="bg-[#12182B]/60 backdrop-blur-md border border-slate-700/40 rounded-[32px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-white text-[11px] uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-indigo-400" /> {t('current_stack')}
              </h3>
              <span className="text-[12px] font-black text-slate-500">{currentIndex + 1} / {matches.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t('score')}</span>
                <span className="text-[18px] font-black text-white">{Math.round(currentMatch.score || 0)}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">{t('nearby')}</span>
                <span className="text-[18px] font-black text-white">{currentMatch.location ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
          
          <button className="flex items-center justify-center gap-3 w-full py-4 bg-[#12182B] border border-slate-700/40 rounded-2xl text-[13px] font-black text-slate-300 hover:text-white transition-all shadow-xl group">
             <SlidersHorizontal size={18} className="group-hover:rotate-90 transition-transform" /> 
             {t('match_filters')}
          </button>
        </div>

        <div className="flex-1 w-full flex flex-col items-center relative h-[660px]">
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 opacity-60">
                 <Users size={48} className="text-indigo-400 mb-8" />
                 <h3 className="text-2xl font-black text-white tracking-widest uppercase">{t('mandala_cooldown')}</h3>
                 <p className="max-w-xs text-[11px] font-bold mt-4 tracking-[0.2em] uppercase text-[#A78BFA] leading-relaxed">{t('cooldown_desc')}</p>
                <button onClick={() => navigate('/profile')} className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition">{t('update_profile')}</button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentMatch.userId}
                initial={{ scale: 0.9, opacity: 0, x: 200, rotate: 5 }}
                animate={{ scale: 1, opacity: 1, x: 0, rotate: 0 }}
                exit={{ scale: 0.8, opacity: 0, x: -200, rotate: -5 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute inset-0"
              >
                <div className={`w-full max-w-[480px] mx-auto h-full bg-gradient-to-br from-[#0B0B2A] to-[#010101] rounded-[48px] shadow-2xl border ${isTopMatch ? 'border-indigo-400/30' : 'border-slate-800/80'} relative flex flex-col p-8`}>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#C4B5FD] to-[#8B5CF6] rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-[#0B0B2A] z-20">
                     <span className="text-[9px] font-black text-[#2E1065] leading-none uppercase">{t('match_label')}</span>
                     <span className="text-[16px] font-black text-white leading-none">{Math.round(currentMatch.score || 0)}</span>
                  </div>

                  <div className="flex gap-4 items-center mb-6 mt-1">
                     <Avatar 
                       src={currentMatch.profilePictureUrl} 
                       name={currentMatch.name} 
                       size="lg" 
                       border={false} 
                       className="rounded-[22px] border-2 border-white/5 p-1" 
                     />
                     <div className="flex-1">
                        <h2 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{currentMatch.name}</h2>
                        
                        <div className="flex items-center gap-3 mb-2">
                           <div className="flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                              <Star size={12} fill="#10b981" /> {currentMatch.teachingReputation?.toFixed(1) || "5.0"}
                           </div>
                           <span className="text-[10px] font-bold text-slate-500">
                             {currentMatch.totalSessions || 0} {t('sessions')}
                           </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                           <span className="flex items-center gap-1"><MapPin size={10} className="text-indigo-400" /> {currentMatch.location || 'Remote Node'}</span>
                           <span className="flex items-center gap-1 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5"><Monitor size={10} /> {currentMatch.mode}</span>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 space-y-6 overflow-y-auto pr-3 custom-scrollbar">
                     <div className="bg-[#12182B]/40 rounded-[28px] p-5 border border-white/5 group hover:border-indigo-500/20 transition">
                        <h4 className="text-[9px] font-black text-[#A78BFA] uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Zap size={10} className="fill-current" /> {t('they_teach_you')}:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {(currentMatch.theyTeachYou || []).map(skill => <span key={skill} className="px-3 py-1.5 bg-indigo-600/10 text-white rounded-xl text-[11px] font-black border border-indigo-500/20">{skill}</span>)}
                        </div>
                     </div>

                     <div className="flex justify-center -my-3 relative z-10"><ArrowLeftRight className="text-slate-600" size={24} /></div>

                     <div className="bg-[#12182B]/40 rounded-[28px] p-5 border border-white/5 group hover:border-emerald-500/20 transition">
                        <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Star size={10} className="fill-current" /> {t('you_teach_them')}:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {(currentMatch.theyLearnFromYou || []).map(skill => <span key={skill} className="px-3 py-1.5 bg-emerald-500/5 text-white rounded-xl text-[11px] font-bold border border-emerald-500/10">{skill}</span>)}
                        </div>
                     </div>
                  </div>

                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 z-40">
                     <motion.button whileHover={{ scale: 1.1, rotate: -8 }} whileTap={{ scale: 0.9 }} onClick={() => handleAction('reject', currentMatch.userId)} className="w-14 h-14 rounded-full bg-[#12182B] border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all shadow-xl"><X size={24} strokeWidth={3} /></motion.button>
                     <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleAction('star', currentMatch.userId)} className="w-12 h-12 rounded-full bg-[#12182B] border border-white/10 flex items-center justify-center text-slate-400 hover:text-amber-400 transition-all shadow-xl"><Star size={20} strokeWidth={3} /></motion.button>
                     <motion.button whileHover={{ scale: 1.05, rotate: 8 }} whileTap={{ scale: 0.9 }} onClick={() => handleAction('connect', currentMatch.userId)} className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-[#A78BFA] to-[#7C3AED] flex items-center justify-center text-[#2E1065] shadow-indigo-600/50 transition-all group"><Heart size={40} className="fill-transparent group-hover:fill-current transition-all" strokeWidth={3} /></motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillHubPage;