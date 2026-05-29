import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, MapPin, Monitor, 
  ChevronRight, ArrowRightLeft, Sparkles, 
  CheckCircle2, Timer, AlertCircle, Loader2,
  CalendarDays, Check, X, Video, MessageSquare,
  BookOpen, CalendarCheck, Award
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MatchAnimation from "../components/MatchAnimation";
import Avatar from "../components/Avatar";
import FeedbackModal from "../components/FeedbackModal";

const SessionsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  
  const [showMatch, setShowMatch] = useState(false);
  const [exchangeInfo, setExchangeInfo] = useState(null);
  const [matchedUserName, setMatchedUserName] = useState("");
  const [matchedUserId, setMatchedUserId] = useState(null);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackSession, setFeedbackSession] = useState(null);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const sessionsRef = useRef([]);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  const fetchSessions = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/user/sessions/${userId}`);
      const newSessions = res.data || [];
      
      // ✅ AUTO-TRIGGER: Detect new completions and pop the feedback form
      newSessions.forEach(s => {
          if (s.status === 'COMPLETED' && !s.feedbackSubmitted) {
              const oldSess = sessionsRef.current.find(os => os.sessionId === s.sessionId);
              
              // Case 1: Session changed from Active -> Completed
              const justFinished = oldSess && oldSess.status !== 'COMPLETED';
              // Case 2: User just came to this page and has a pending feedback session
              const pageLoadPending = sessionsRef.current.length === 0;

              if (justFinished || pageLoadPending) {
                  setFeedbackSession(s);
                  setIsFeedbackOpen(true);
              }
          }
      });

      setSessions(newSessions);
    } catch (err) {
      console.error("Session sync error:", err.response || err);
      const msg = err.response?.data?.message || err.message || "Network Error";
      setError(`Critical Sync Failure: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add polling for real-time updates every 15 seconds
  useEffect(() => {
    if (!userId) {
      setError(t('login_required'));
      setLoading(false);
      return;
    }
    fetchSessions();
    const interval = setInterval(fetchSessions, 15000);
    return () => clearInterval(interval);
  }, [userId, fetchSessions, t]);

  const handleAction = async (sessionId, type) => {
    // Optimistic local UI updates
    if (type === 'accept') {
      setSessions(prev => prev.map(s => s.sessionId === sessionId ? { ...s, status: 'ACCEPTED' } : s));
    } else if (type === 'reject') {
      setSessions(prev => prev.map(s => s.sessionId === sessionId ? { ...s, status: 'DECLINED' } : s));
    }

    setActionLoading(sessionId);
    try {
      await api.post(`/user/sessions/${sessionId}/${type}`, {});
      
      if (type === 'complete') {
        const sess = sessions.find(s => s.sessionId === sessionId);
        if (sess) {
          setFeedbackSession(sess);
          setIsFeedbackOpen(true);
        }
      }
      
      fetchSessions();
    } catch (err) {
      console.error(`${type} failed:`, err);
      alert(`Unable to ${type} session. Please try again.`);
      fetchSessions(); // Rollback to actual backend state
    } finally {
      setActionLoading(null);
    }
  };

  const [activeTab, setActiveTab] = useState("active");

  const filteredSessions = sessions.filter(s => {
    const status = s.status?.toUpperCase();
    if (activeTab === "pending") return ["PENDING", "ACCEPTED", "MATCHED"].includes(status);
    if (activeTab === "active") return ["ACTIVE", "BOOKED"].includes(status);
    if (activeTab === "completed") return ["COMPLETED", "CANCELLED", "DECLINED"].includes(status);
    return false;
  });

  const handleStartZoom = async (sessionId) => {
    setActionLoading(sessionId);
    try {
      const res = await api.post(`/zoom/create-meeting`, { sessionId });
      const joinUrl = res.data?.meeting?.joinUrl;
      if (joinUrl) {
         window.open(joinUrl, "_blank");
      }
      fetchSessions();
    } catch (err) {
      console.error("Zoom start failed:", err);
      alert("Failed to start Zoom meeting.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleJoinZoom = async (sessionId) => {
    try {
        const res = await api.get(`/zoom/meeting/${sessionId}`);
        const joinUrl = res.data?.meeting?.joinUrl;
        if (joinUrl) {
            window.open(joinUrl, "_blank");
        } else {
            alert("Meeting link not available.");
        }
        fetchSessions(); // Trigger refresh to show 'ACTIVE'
    } catch(err) {
        alert("Unable to fetch the meeting URL.");
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'accepted' || s === 'matched') return 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.15)]';
    if (s === 'active') return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    if (s === 'booked') return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
    if (s === 'completed') return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    if (s === 'pending') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (s === 'cancelled' || s === 'declined') return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase();
    if (s === 'accepted' || s === 'matched') return <CheckCircle2 size={14} />;
    if (s === 'active') return <Video size={14} />;
    if (s === 'booked') return <CalendarCheck size={14} />;
    if (s === 'completed') return <Sparkles size={14} />;
    if (s === 'cancelled' || s === 'declined') return <X size={14} />;
    return <Timer size={14} />;
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-white">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
          <Loader2 className="w-12 h-12 text-indigo-400" />
        </motion.div>
        <p className="text-xs font-black uppercase tracking-widest opacity-40 mt-6">{t('syncing_schedule')}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-6 py-12 relative overflow-hidden">
      
      <MatchAnimation 
        isVisible={showMatch} 
        onClose={() => setShowMatch(false)} 
        otherUserName={matchedUserName} 
        otherUserId={matchedUserId}
        otherUserProfilePictureUrl={sessions.find(s => s.otherUserId === matchedUserId)?.otherUserProfilePictureUrl}
        exchangeInfo={exchangeInfo}
      />
      
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 shadow-sm">
            <CalendarDays size={12} /> {t('scheduled_engagements')}
          </div>
          <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">
            Weaving <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{t('weaving_sessions')}</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium max-w-sm">
            {t('sessions_subtitle')}
          </p>
        </div>

        <div className="flex items-center bg-[#12182B]/60 p-1.5 rounded-[24px] border border-slate-700/50 backdrop-blur-md">
          {["active", "pending", "completed"].map((tab) => {
            const count = tab === "pending" ? sessions.filter(s => s.status === 'PENDING' && s.incoming).length : 0;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab 
                    ? "bg-indigo-500 text-[#0B101E] shadow-xl" 
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {t(tab)}
                {tab === "pending" && count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black transition-all duration-300 ${activeTab === 'pending' ? 'bg-[#0B101E] text-indigo-400' : 'bg-indigo-500 text-[#0B101E]'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#12182B]/30 border border-slate-800/40 rounded-[40px] text-center">
           <AlertCircle className="text-red-400 mb-4" size={32} />
           <p className="text-slate-400 font-medium">{error}</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#12182B]/30 border border-slate-800/40 rounded-[40px] text-center backdrop-blur-sm">
           <Calendar className="w-16 h-16 text-slate-800 mb-6" />
           <h3 className="text-xl font-black text-white mb-2">{t('no_exchanges', { tab: t(activeTab) })}</h3>
           <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('sessions_empty_desc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <AnimatePresence>
            {filteredSessions.map((session, idx) => {
              const isIncomingPending = activeTab === 'pending' && session.incoming && session.status === 'PENDING';
              const isAccepted = session.status === 'ACCEPTED' || session.status === 'MATCHED';

              return (
                <motion.div 
                  key={session.sessionId}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative rounded-[48px] transition-all duration-500 ${
                    session.status === 'ACTIVE' 
                      ? 'ring-2 ring-sky-500 ring-offset-4 ring-offset-[#0B101E] shadow-[0_0_40px_rgba(14,165,233,0.2)]' 
                      : isIncomingPending 
                        ? 'ring-2 ring-purple-500/50 ring-offset-4 ring-offset-[#0B101E] shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-[pulse_3s_infinite_ease-in-out]' 
                        : ''
                  }`}
                >
                   <div className={`bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[48px] p-10 hover:border-purple-500/40 transition-all duration-500 shadow-2xl relative overflow-hidden ${session.status === 'ACTIVE' ? 'bg-sky-500/5' : ''} ${isIncomingPending ? 'bg-purple-500/[0.02]' : ''}`}>
                      
                      <div className="absolute top-10 right-10 flex flex-col items-end gap-3">
                         <div className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(session.status)} shadow-lg`}>
                            {getStatusIcon(session.status)}
                            {t(session.status?.toLowerCase()) || session.status}
                         </div>
                         {session.status === 'ACTIVE' && (
                           <div className="flex items-center gap-2 text-[9px] font-black text-sky-400 uppercase tracking-widest bg-sky-500/10 px-3 py-1 rounded-full">
                              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                              {t('live_now')}
                           </div>
                         )}
                      </div>

                      <div className="flex items-start gap-8 mb-10">
                         <Avatar 
                           src={session.otherUserProfilePictureUrl} 
                           name={session.otherUserName} 
                           size="lg" 
                           border={true} 
                           className="rounded-3xl" 
                         />
                         <div>
                            <p className="text-[10px] font-black uppercase text-purple-400 tracking-[0.3em] mb-2">{t('co_weaver')}</p>
                            <h3 className="text-3xl font-black text-white leading-tight tracking-tight">{session.otherUserName}</h3>
                            <div className="flex flex-wrap items-center gap-5 mt-3">
                               <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400">
                                  <Clock size={14} className="text-purple-400" /> {session.dateTime}
                               </div>
                               <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400">
                                  {session.mode?.toLowerCase() === 'online' ? <Monitor size={14} className="text-purple-400" /> : <MapPin size={14} className="text-purple-400" />}
                                  {session.mode?.replace('_', ' ')}
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="bg-white/5 rounded-[32px] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
                         <div className="flex-1 space-y-3">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-center md:text-left">{t('synced_learning')}</p>
                            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                               {session.youLearn?.map(s => (
                                 <span key={s} className="px-4 py-1.5 bg-indigo-500/10 text-white border border-indigo-500/20 rounded-2xl text-[12px] font-black">{s}</span>
                               ))}
                            </div>
                         </div>

                         <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 shadow-inner shrink-0 rotate-90 md:rotate-0">
                            <ArrowRightLeft size={18} />
                         </div>

                         <div className="flex-1 space-y-3 text-center md:text-right">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{t('expertise_shared')}</p>
                            <div className="flex flex-wrap gap-2.5 justify-center md:justify-end">
                               {session.youTeach?.map(s => (
                                 <span key={s} className="px-4 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-2xl text-[12px] font-bold">{s}</span>
                               ))}
                            </div>
                         </div>
                      </div>

                       {/* Topic Badge for booked sessions */}
                       {session.topic && (
                         <div className="flex items-center gap-2 mb-6 flex-wrap">
                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-2xl">
                             <BookOpen size={14} className="text-purple-400" />
                             <span className="text-[12px] font-bold text-purple-400">{session.topic}</span>
                           </div>
                           {session.duration && (
                             <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/20 rounded-2xl">
                               <Timer size={14} className="text-sky-400" />
                               <span className="text-[12px] font-bold text-sky-400">{session.duration} min</span>
                             </div>
                           )}
                         </div>
                       )}

                      {activeTab === 'pending' && session.incoming ? (
                         isAccepted ? (
                           <button 
                             disabled
                             className="w-full py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white text-[13px] font-black uppercase tracking-widest rounded-[24px] shadow-lg shadow-purple-500/30 flex items-center justify-center gap-3 transition-all duration-500 border-0 cursor-not-allowed"
                           >
                              <CheckCircle2 size={18} strokeWidth={3} />
                              {t('accepted')}
                           </button>
                         ) : (
                           <div className="flex items-center gap-4 w-full">
                              <button 
                                disabled={actionLoading === session.sessionId}
                                onClick={() => handleAction(session.sessionId, 'accept')}
                                className="flex-1 py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white text-[13px] font-black uppercase tracking-widest rounded-[24px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 border-0"
                              >
                                 {actionLoading === session.sessionId ? <Loader2 className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                                 {t('accept_sync')}
                              </button>
                              <button 
                                disabled={actionLoading === session.sessionId}
                                onClick={() => handleAction(session.sessionId, 'reject')}
                                className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-6 py-5 rounded-[24px] hover:bg-rose-500 hover:text-white transition shadow-lg flex items-center justify-center disabled:opacity-50"
                              >
                                 <X size={20} strokeWidth={3} />
                              </button>
                           </div>
                         )
                      ) : activeTab === 'pending' ? (
                         isAccepted ? (
                           <div className="w-full py-5 bg-purple-500/10 border border-purple-500/20 rounded-[24px] text-center shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                              <p className="text-[12px] font-black text-purple-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                 <CheckCircle2 size={14} /> {t('accepted')}
                              </p>
                           </div>
                         ) : (
                           <div className="w-full py-5 bg-white/5 border border-white/5 rounded-[24px] text-center">
                              <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest">{t('awaiting_calibration')}</p>
                           </div>
                         )
                      ) : activeTab === 'active' ? (
                         <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {session.hasZoomMeeting ? (
                                 <button 
                                   onClick={() => handleJoinZoom(session.sessionId)}
                                   className="py-5 bg-sky-500 text-white text-[13px] font-black uppercase tracking-widest rounded-[24px] hover:bg-white hover:text-sky-600 transition shadow-xl flex items-center justify-center gap-3"
                                 >
                                    <Video size={18} /> {t('join_zoom')}
                                 </button>
                               ) : (
                                 <button 
                                   disabled={actionLoading === session.sessionId}
                                   onClick={() => handleStartZoom(session.sessionId)}
                                   className="py-5 bg-indigo-500 text-[#0B101E] text-[13px] font-black uppercase tracking-widest rounded-[24px] hover:bg-white transition shadow-xl flex items-center justify-center gap-3 disabled:opacity-40"
                                 >
                                    {actionLoading === session.sessionId ? <Loader2 className="animate-spin text-white" /> : <Video size={18} />}
                                    {t('start_zoom')}
                                 </button>
                               )}
                               <button 
                                 onClick={() => navigate('/messages', { state: { autoSelectUserId: session.otherUserId } })}
                                 className="py-5 bg-white/5 border border-white/5 hover:bg-white/10 text-white text-[13px] font-black uppercase tracking-widest rounded-[24px] transition flex items-center justify-center gap-3"
                                >
                                  <MessageSquare size={18} /> {t('chat')}
                               </button>
                            </div>
                            
                            {/* NEW: Complete Session Button */}
                            {session.status === 'ACTIVE' && (
                               <button 
                                 onClick={() => handleAction(session.sessionId, 'complete')}
                                 className="w-full py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-500 hover:text-white transition flex items-center justify-center gap-2"
                               >
                                  <CheckCircle2 size={14} /> {t('mark_as_completed')}
                               </button>
                            )}
                         </div>
                      ) : (
                          <div className="space-y-4">
                             <div className="w-full py-5 bg-white/5 border border-white/5 rounded-[24px] text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                                <p className="relative z-10 text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-2">
                                  <Sparkles size={12} /> FEEDBACK REQUIRED
                                </p>
                                <p className="relative z-10 text-[12px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('history_logged')}</p>
                             </div>
                             <button 
                               onClick={() => { setFeedbackSession(session); setIsFeedbackOpen(true); }}
                               className="w-full py-3 bg-indigo-500 text-[#0B101E] text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                             >
                                <Award size={14} /> {t('leave_review')}
                             </button>
                          </div>
                      )}
                   </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)}
        session={feedbackSession}
        onFeedbackSubmitted={() => {
          fetchSessions();
        }}
      />
    </div>
  );
};

export default SessionsPage;
