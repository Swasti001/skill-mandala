import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCheck, Users, Presentation, FileText,
  Loader2, Inbox, Zap, Heart, MessageSquare
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
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
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
};

const getTypeConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG["POST"];

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
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const FILTERS = ["ALL", "MATCH", "SESSION", "POST"];

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
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Bell size={22} />
            </div>
            <h1 className="text-[32px] font-black tracking-tighter text-white leading-none">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-rose-500 text-white text-[11px] font-black rounded-full animate-pulse">
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
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20"
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
                  onClick={() => !notif.read && handleMarkRead(notif.id)}
                  className={`group relative flex items-start gap-5 p-5 rounded-[28px] border transition-all cursor-pointer
                    ${isUnread
                      ? "bg-[#12182B] border-slate-700/70 hover:border-indigo-500/40 shadow-lg"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/5 opacity-60 hover:opacity-100"
                    }`}
                >
                  {/* Unread indicator */}
                  {isUnread && (
                    <div
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full ${cfg.dot} shadow-lg`}
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
                          {notif.message}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">
                          {formatTime(notif.createdAt)}
                        </span>
                        {isUnread && (
                          <div className="mt-2 flex justify-end">
                            <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
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
    </div>
  );
};

export default UserNotifications;
