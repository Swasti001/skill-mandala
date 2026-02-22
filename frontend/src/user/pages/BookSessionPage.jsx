import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserContext";
import {
  Calendar, Clock, BookOpen, Coins,
  ArrowLeft, Loader2, CheckCircle2, Sparkles,
  User, Timer, CreditCard, Zap, Video
} from "lucide-react";

const DURATION_OPTIONS = [
  { value: 30, label: "30 min", credits: 10 },
  { value: 60, label: "1 hour", credits: 20 },
  { value: 90, label: "1.5 hours", credits: 30 },
];

const BookSessionPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, refreshUser } = useUser();

  // Pre-filled from chat context
  const teacherId = state?.teacherId;
  const teacherName = state?.teacherName || "Skill Partner";
  const teacherProfilePic = state?.teacherProfilePic;
  const conversationId = state?.conversationId;

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [topic, setTopic] = useState(state?.suggestedTopic || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);

  const credits = user?.credits || 0;
  const creditCost = Math.ceil(duration / 30) * 10;
  const hasEnoughCredits = credits >= creditCost;

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
    setSelectedTime("14:00");
  }, []);

  useEffect(() => {
    if (!teacherId) {
      navigate("/messages");
    }
  }, [teacherId, navigate]);

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime || !topic.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!hasEnoughCredits) {
      setError("Insufficient credits. Visit your wallet to earn more!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dateTime = `${selectedDate}T${selectedTime}:00`;
      const res = await api.post("/user/sessions/create", {
        teacherId,
        teacherName,
        dateTime,
        duration,
        topic: topic.trim(),
        conversationId,
      });

      setBookingResult(res.data);
      setSuccess(true);
      refreshUser(); // Refresh credits
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to book session";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (success) {
    return (
      <div className="w-full max-w-[800px] mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#12182B]/60 backdrop-blur-xl border border-emerald-500/30 rounded-[48px] p-16 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Glow Effects */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle2 className="text-emerald-400" size={48} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white mb-4 tracking-tight"
          >
            Session Booked!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg mb-2"
          >
            Your session with <span className="text-white font-bold">{teacherName}</span> has been confirmed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 mt-8 mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-300">
              <Calendar size={14} className="text-indigo-400" />
              {selectedDate} at {selectedTime}
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-300 ml-3">
              <BookOpen size={14} className="text-purple-400" />
              {topic}
            </div>
            {bookingResult?.remainingCredits !== undefined && (
              <div className="block">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-sm text-amber-400">
                  <Coins size={14} />
                  {creditCost} credits used • {bookingResult.remainingCredits} remaining
                </span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate("/sessions")}
              className="px-8 py-4 bg-indigo-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-400 transition shadow-xl"
            >
              View Sessions
            </button>
            <button
              onClick={() => navigate("/messages", { state: { autoSelectUserId: teacherId } })}
              className="px-8 py-4 bg-white/5 border border-white/10 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition"
            >
              Back to Chat
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto px-6 py-12 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to Chat</span>
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
            <Sparkles size={10} /> Book Session
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          Schedule a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Session</span>
        </h1>
        <p className="text-slate-400 text-sm mt-3 max-w-lg">
          Book a 1-on-1 learning session with your skill partner. Credits will be deducted upon confirmation.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Teacher Card */}
          <div className="bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[36px] p-8 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5">Session Partner</h3>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black overflow-hidden shadow-xl">
                {teacherProfilePic ? (
                  <img src={teacherProfilePic} alt={teacherName} className="w-full h-full object-cover" />
                ) : (
                  teacherName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h4 className="text-xl font-black text-white">{teacherName}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Topic */}
          <div className="bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[36px] p-8 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5 flex items-center gap-2">
              <BookOpen size={12} className="text-purple-400" /> Session Topic
            </h3>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., React Hooks Deep Dive, UI/UX Basics..."
              className="w-full bg-[#1C2133] border border-slate-700/50 rounded-2xl px-6 py-4 text-white text-sm font-medium placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition"
            />
          </div>

          {/* Date & Time */}
          <div className="bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[36px] p-8 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5 flex items-center gap-2">
              <Calendar size={12} className="text-indigo-400" /> Date & Time
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-2 block">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-[#1C2133] border border-slate-700/50 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 mb-2 block">Time</label>
                <input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-[#1C2133] border border-slate-700/50 rounded-2xl px-6 py-4 text-white text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[36px] p-8 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-5 flex items-center gap-2">
              <Timer size={12} className="text-sky-400" /> Duration
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  className={`p-5 rounded-[24px] border-2 transition-all text-center group ${
                    duration === opt.value
                      ? "bg-indigo-500/10 border-indigo-500/40 shadow-xl shadow-indigo-500/10"
                      : "bg-[#1C2133] border-slate-700/50 hover:border-slate-600"
                  }`}
                >
                  <p className={`text-xl font-black mb-1 ${duration === opt.value ? "text-indigo-400" : "text-white"}`}>
                    {opt.label}
                  </p>
                  <div className="flex items-center justify-center gap-1.5">
                    <Coins size={12} className="text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-400">{opt.credits} credits</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar - Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[36px] p-8 shadow-2xl sticky top-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 flex items-center gap-2">
              <CreditCard size={12} className="text-amber-400" /> Booking Summary
            </h3>

            <div className="space-y-5 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium flex items-center gap-2"><User size={14} /> Teacher</span>
                <span className="text-sm text-white font-bold truncate ml-2 max-w-[140px]">{teacherName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium flex items-center gap-2"><Calendar size={14} /> Date</span>
                <span className="text-sm text-white font-bold">{selectedDate || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium flex items-center gap-2"><Clock size={14} /> Start Time</span>
                <span className="text-sm text-white font-bold">{selectedTime || "-"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium flex items-center gap-2"><Clock size={14} /> End Time</span>
                <span className="text-sm text-white font-bold">
                  {selectedDate && selectedTime ? 
                    new Date(new Date(`${selectedDate}T${selectedTime}`).getTime() + duration * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium flex items-center gap-2"><Timer size={14} /> Duration</span>
                <span className="text-sm text-white font-bold">{duration} min</span>
              </div>
              {topic && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400 font-medium flex items-center gap-2"><BookOpen size={14} /> Topic</span>
                  <span className="text-sm text-white font-bold truncate ml-2 max-w-[140px]">{topic}</span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-sky-400 font-bold bg-sky-500/10 border border-sky-500/20 rounded-xl px-3 py-2 mb-6">
              Need more time? You will have the option to extend the session later using your credits if both parties agree.
            </p>

            <div className="border-t border-slate-700/50 pt-6 mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-400 font-medium">Credit Cost</span>
                <span className="text-xl font-black text-amber-400 flex items-center gap-1">
                  <Coins size={16} /> {creditCost}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400 font-medium">Your Balance</span>
                <span className={`text-lg font-black ${hasEnoughCredits ? "text-emerald-400" : "text-rose-400"}`}>
                  {credits} CR
                </span>
              </div>
              {!hasEnoughCredits && (
                <p className="text-[11px] text-rose-400 font-bold mt-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                  Insufficient credits. You need {creditCost - credits} more.
                </p>
              )}
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-4 py-3 text-rose-400 text-[12px] font-bold"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleBookSession}
              disabled={loading || !hasEnoughCredits || !topic.trim() || !selectedDate || !selectedTime}
              className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[13px] font-black uppercase tracking-widest rounded-[20px] hover:from-indigo-400 hover:to-purple-400 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.97]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Zap size={18} /> Confirm Booking
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-600 font-medium text-center mt-4 leading-relaxed">
              A Zoom meeting link will be automatically generated and shared in your chat.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookSessionPage;
