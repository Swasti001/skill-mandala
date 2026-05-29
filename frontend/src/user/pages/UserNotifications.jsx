import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCheck, Users, Presentation, FileText,
  Loader2, Inbox, Zap, Heart, MessageSquare, ShieldAlert, X, AlertOctagon
} from "lucide-react";
import api from "../api";

const TYPE_CONFIG = {
  MATCH: {
    icon: Users,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    dot: "bg-indigo-400",
    label: "New Match",
  },
  SESSION: {
    icon: Presentation,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    dot: "bg-purple-400",
    label: "Session",
  },
  POST: {
    icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
    label: "Post",
  },
  LIKE: {
    icon: Heart,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    dot: "bg-rose-400",
    label: "Like",
  },
  MESSAGE: {
    icon: MessageSquare,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    dot: "bg-sky-400",
    label: "Message",
  },
  SAFETY_REPORT: {
    icon: ShieldAlert,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-400",
    label: "Safety Notice",
  },
};

const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG["POST"];

const formatNotificationMessage = (message) => {
  if (!message) return "";
  
  // Common pattern: "Sender Name sent..." or "Sender Name matched..."
  const actionWords = ["sent", "matched", "has", "liked", "requested", "started", "accepted", "rejected", "joined", "booked", "created"];
  const tokens = message.split(" ");
  let actionIndex = -1;
  
  for (let i = 0; i < tokens.length; i++) {
    if (actionWords.includes(tokens[i].toLowerCase())) {
      actionIndex = i;
      break;
    }
  }
  
  if (actionIndex > 0) {
    const sender = tokens.slice(0, actionIndex).join(" ");
    const rest = tokens.slice(actionIndex).join(" ");
    return (
      <span>
        <strong className="text-white font-extrabold text-[15px] border-b border-purple-500/20 pb-0.5 hover:text-[#A78BFA] transition-colors">{sender}</strong>{" "}
        <span className="text-slate-300 font-semibold">{rest}</span>
      </span>
    );
  }
  
  return message;
};

const formatTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
};

const UserNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [markingAll, setMarkingAll] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState(null);

  const userId = localStorage.getItem("userId");

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.get(`/notifications/${userId}`);
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sorted);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    try {
      setMarkingAll(true);
      await Promise.all(unread.map((n) => api.put(`/notifications/${n.id}/read`)));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      window.dispatchEvent(new CustomEvent("notifications-updated"));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const FILTERS = ["ALL", "MATCH", "SESSION", "POST", "SAFETY_REPORT"];

  const filtered =
    filter === "ALL"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="w-full max-w-[860px] mx-auto px-6 pb-24 pt-8 text-slate-100">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Bell size={22} />
            </div>
            <h1 className="text-[32px] font-black tracking-tighter text-white leading-none">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-purple-500 text-white text-[11px] font-black rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-slate-500 text-[13px] font-medium ml-[52px]">
            Your activity feed across sessions, matches, and the community.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-[12px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 shrink-0"
          >
            {markingAll ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCheck size={14} />
            )}
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {FILTERS.map((f) => {
          const cfg = f !== "ALL" ? getTypeConfig(f) : null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all ${
                filter === f
                  ? "bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20"
                  : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f === "ALL" ? (
                <span className="flex items-center gap-2">
                  <Zap size={11} /> All
                </span>
              ) : (
                <span className={`flex items-center gap-2 ${filter === f ? "text-white" : cfg?.color}`}>
                  {cfg && React.createElement(cfg.icon, { size: 11 })}
                  {f}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-30">
          <Loader2 className="animate-spin mb-4" size={32} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">
            Syncing Feed...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 opacity-30"
        >
          <Inbox size={56} className="mb-4" />
          <p className="text-[13px] font-black uppercase tracking-widest">
            All Clear
          </p>
          <p className="text-[11px] mt-2 text-slate-500 font-medium">
            No notifications in this category
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((notif, idx) => {
              const cfg = getTypeConfig(notif.type);
              const Icon = cfg.icon;
              const isUnread = !notif.read;

              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => {
                    if (!notif.read) handleMarkRead(notif.id);
                    if (notif.type === "SAFETY_REPORT") {
                      const rId = parseReportId(notif.message);
                      if (rId) setSelectedDisputeId(rId);
                    } else if (notif.type === "MATCH") {
                      navigate("/matches");
                    } else if (notif.type === "SESSION") {
                      navigate("/sessions");
                    } else if (notif.type === "POST") {
                      navigate("/community");
                    }
                  }}
                  className={`group relative flex items-start gap-5 p-5 rounded-[28px] border transition-all cursor-pointer
                    ${isUnread
                      ? "bg-purple-500/[0.04] border-purple-500/20 hover:border-purple-500/40 shadow-lg shadow-purple-500/5"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/5 opacity-60 hover:opacity-100"
                    }`}
                >
                  {/* Unread indicator */}
                  {isUnread && (
                    <div
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`shrink-0 w-12 h-12 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center ${cfg.color} transition-all group-hover:scale-110`}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span
                          className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${cfg.bg} ${cfg.border} ${cfg.color} mb-2`}
                        >
                          {cfg.label}
                        </span>
                        <p
                          className={`text-[14px] leading-snug ${
                            isUnread ? "text-white font-semibold" : "text-slate-400 font-medium"
                          }`}
                        >
                          {formatNotificationMessage(notif.message)}
                        </p>
                        {notif.type === "SAFETY_REPORT" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!notif.read) handleMarkRead(notif.id);
                              const rId = parseReportId(notif.message);
                              if (rId) setSelectedDisputeId(rId);
                            }}
                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95"
                          >
                            <ShieldAlert size={12} />
                            Review dispute & respond
                          </button>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                          {formatTime(notif.createdAt)}
                        </span>
                        {isUnread && (
                          <div className="mt-2 flex justify-end">
                            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)] animate-pulse" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Summary Footer */}
      {!loading && notifications.length > 0 && (
        <div className="mt-10 py-6 border-t border-slate-800/60 flex items-center justify-between">
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">
            {notifications.length} total · {unreadCount} unread
          </p>
          {unreadCount === 0 && (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCheck size={14} />
              <span className="text-[11px] font-black uppercase tracking-widest">
                All Caught Up
              </span>
            </div>
          )}
        </div>
      )}
      {selectedDisputeId && (
        <SafetyResponseModal
          reportId={selectedDisputeId}
          onClose={() => {
            setSelectedDisputeId(null);
            fetchNotifications();
          }}
        />
      )}
    </div>
  );
};

const parseReportId = (message) => {
  if (!message) return null;
  const match = message.match(/ID:\s*#(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
};

const SafetyResponseModal = ({ reportId, onClose }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState("");
  const [evidence, setEvidence] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDisputeDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reports/${reportId}/dispute`);
        setReport(res.data);
        if (res.data.reportedResponse) {
          setResponse(res.data.reportedResponse);
        }
        if (res.data.reportedEvidence) {
          setEvidence(res.data.reportedEvidence);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dispute details. Please make sure you are authenticated.");
      } finally {
        setLoading(false);
      }
    };
    fetchDisputeDetails();
  }, [reportId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;
    try {
      setSubmitting(true);
      await api.put(`/reports/${reportId}/respond`, {
        reportedResponse: response,
        reportedEvidence: evidence,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to submit response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[600px] bg-[#0c1938] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-[scaleIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-850 bg-slate-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-white leading-none">Safety & Dispute Review</h2>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Case #{reportId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
              <Loader2 size={24} className="animate-spin mb-3 text-red-400" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Loading Dispute Details...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-400 bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
              <p className="text-sm font-bold">{error}</p>
              <button 
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition"
              >
                Close Portal
              </button>
            </div>
          ) : success ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCheck size={28} />
              </div>
              <h3 className="text-lg font-black text-white">Explanation Registered Successfully</h3>
              <p className="text-xs text-slate-300 max-w-[400px] mx-auto leading-relaxed">
                Your statement and evidence have been securely logged and sent to our moderation team. The case status has been updated to <strong>Under Review</strong>. We review both sides thoroughly before making any decisions.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-black uppercase tracking-widest text-white transition shadow-lg shadow-emerald-500/10"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Platforms Advisory */}
              <div className="bg-red-500/[0.03] border border-red-500/10 rounded-2xl p-4 flex gap-3.5">
                <AlertOctagon size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-400">Formal Safety Claim Filed</h4>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed">
                    A platform weaver has submitted a safety ticket concerning inappropriate conduct. To ensure complete fairness, we request that you provide your statement or evidence.
                  </p>
                </div>
              </div>

              {/* Anonymity Shield Banner */}
              <div className="bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl p-4 flex gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  🛡️
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400">Reporter Identity Protected</h4>
                  <p className="text-[11.5px] text-slate-400 leading-relaxed">
                    Under platform guidelines, the identity of the reporting weaver is kept strictly confidential. The safety team evaluates claims impartially and treats all accounts with equal dignity.
                  </p>
                </div>
              </div>

              {/* Anonymized Report Details */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-red-500/20 bg-red-500/5 text-red-400">
                    Category: {report.category}
                  </span>
                  <h4 className="text-[14px] font-black text-white mt-2">{report.title}</h4>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-xs text-slate-350 leading-relaxed font-medium">
                  {report.description}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>Related Entity: {report.relatedEntity}</span>
                  <span>•</span>
                  <span>Filed On: {new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Response Submission Form */}
              {report.status === "RESOLVED" || report.status === "REJECTED" ? (
                <div className="bg-slate-950/30 border border-slate-800 rounded-2xl p-5 text-center space-y-2 text-slate-500">
                  <p className="text-xs font-bold text-slate-400">Case Concluded</p>
                  <p className="text-[11px] leading-relaxed">
                    This moderation case is already {report.status.toLowerCase()}. The queue has closed and no further responses can be submitted.
                  </p>
                </div>
              ) : report.reportedResponse ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Your Submitted Statement</h4>
                  <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 space-y-4">
                    <p className="text-xs text-slate-250 leading-relaxed font-medium">{report.reportedResponse}</p>
                    {report.reportedEvidence && (
                      <div>
                        <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Submitted Evidence</h5>
                        <p className="text-xs text-slate-300 leading-relaxed p-3 bg-slate-950/60 rounded-xl border border-slate-900 font-mono text-[11px]">{report.reportedEvidence}</p>
                      </div>
                    )}
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[11px] text-emerald-400 text-center font-bold">
                      Your explanation has been securely registered and is under active review.
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                      Your Explanation / Statement <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows="4"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      required
                      placeholder="Please present your side of the story honestly. Be factual and clear..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-red-500/50 rounded-2xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/10 leading-relaxed transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                      Evidence / Relevant Logs (Optional)
                    </label>
                    <textarea
                      rows="2"
                      value={evidence}
                      onChange={(e) => setEvidence(e.target.value)}
                      placeholder="Paste chat message links, logs, or description of screenshots that demonstrate your perspective..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-red-500/50 rounded-2xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/10 leading-relaxed transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !response.trim()}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-xs uppercase tracking-widest hover:opacity-95 transition-all shadow-lg shadow-red-500/15 disabled:opacity-50 active:scale-[0.99]"
                  >
                    {submitting ? "Registering Explanation..." : "Securely Submit Side of Story"}
                  </button>
                </form>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
