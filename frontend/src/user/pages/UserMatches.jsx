import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, User, MapPin, Monitor, 
  Sparkles, Zap, Star, Loader2, ArrowRight,
  Heart, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Avatar from "../components/Avatar";

const UserMatches = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMutualMatches = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/api/user/matches/mutual/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMatches(res.data || []);
      } catch (err) {
        console.error("Failed to fetch mutual matches:", err);
        setError("Unable to sync your skill-weaving partners.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchMutualMatches();
    } else {
      setLoading(false);
    }
  }, [userId, token]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Loader2 className="w-12 h-12 text-indigo-400" />
        </motion.div>
        <p className="text-xs font-black uppercase tracking-widest opacity-40 mt-6">{t('loading_mandala')}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1240px] mx-auto px-6 py-12 relative z-10">
      
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      <div className="mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#A78BFA] shadow-sm">
          <ShieldCheck size={12} /> {t('verified_connections')}
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-none">
          {t('skill')} <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">{t('partners')}</span>
          {matches.length > 0 && (
            <span className="ml-4 text-2xl align-top px-3 py-1 bg-white/5 border border-white/10 rounded-2xl text-slate-400 font-black">
              {matches.length}
            </span>
          )}
        </h1>
        <p className="text-slate-400 text-sm font-medium max-w-sm">
          {t('partners_subtitle')}
        </p>
      </div>

      {error ? (
        <div className="py-20 text-center bg-[#12182B]/30 border border-slate-800/40 rounded-[40px]">
          <p className="text-slate-400 font-medium">{error}</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#12182B]/30 border border-slate-800/40 rounded-[40px] text-center backdrop-blur-sm">
          <Heart className="w-16 h-16 text-slate-800 mb-6" />
          <h3 className="text-xl font-black text-white mb-2">{t('no_matches_yet')}</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('find_experts_desc')}</p>
          <button 
            onClick={() => navigate('/skill-hub')}
            className="mt-8 px-8 py-3 bg-indigo-500 text-[#0B101E] text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-xl"
          >
            {t('go_to_hub')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {matches.map((match, idx) => (
              <motion.div
                key={match.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[40px] p-8 hover:border-indigo-500/40 transition-all duration-300 shadow-2xl flex flex-col h-full"
              >
                <div className="flex items-center gap-4 mb-8">
                  <Avatar 
                    src={match.profilePictureUrl} 
                    name={match.name} 
                    size="lg" 
                    border={false} 
                    className="rounded-2xl shrink-0" 
                  />
                   <div className="flex-1 overflow-hidden">
                     <h3 className="text-xl font-black text-white truncate leading-tight tracking-tight">{match.name}</h3>
                     
                     <div className="flex items-center gap-3 mt-1.5 pt-1 border-t border-white/5">
                        <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                           <Star size={10} fill="#10b981" /> {match.teachingReputation?.toFixed(1) || "5.0"}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                        <div className="flex items-center gap-1 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                           <Zap size={10} fill="#6366f1" /> {match.learningReputation?.toFixed(1) || "5.0"}
                        </div>
                     </div>

                     <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 mt-2">
                       <MapPin size={10} className="text-indigo-400" /> {match.location || 'Remote'}
                       <span className="opacity-20">•</span>
                       <Monitor size={10} className="text-indigo-400" /> {match.mode}
                     </div>
                   </div>
                </div>

                <div className="flex-1 space-y-6 mb-8">
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                       <Zap size={10} className="fill-current" /> {t('they_teach_you')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.theyTeachYou?.slice(0, 3).map(s => (
                        <span key={s} className="px-3 py-1 bg-white/5 border border-white/5 rounded-xl text-[10px] text-white font-bold">{s}</span>
                      ))}
                      {match.theyTeachYou?.length > 3 && <span className="text-[10px] text-slate-600 font-black">{t('moreCount', { count: match.theyTeachYou.length - 3 })}</span>}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                       <Star size={10} className="fill-current" /> {t('you_teach_them')}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.theyLearnFromYou?.slice(0, 3).map(s => (
                        <span key={s} className="px-3 py-1 bg-white/5 border border-white/5 rounded-xl text-[10px] text-white font-bold">{s}</span>
                      ))}
                      {match.theyLearnFromYou?.length > 3 && <span className="text-[10px] text-slate-600 font-black">{t('moreCount', { count: match.theyLearnFromYou.length - 3 })}</span>}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (match.chatId) {
                      navigate(`/messages/${match.chatId}`);
                    } else {
                      navigate('/messages', { state: { autoSelectUserId: match.userId } });
                    }
                  }}
                  className="w-full py-4 bg-white text-[#0B101E] rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group-hover:bg-indigo-400 transition-colors shadow-xl"
                >
                  <MessageSquare size={16} /> {t('open_channel')} <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-20 text-center opacity-20">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Secure Neural Loop v4.2</p>
      </div>

    </div>
  );
};

export default UserMatches;
