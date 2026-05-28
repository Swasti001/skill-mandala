import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  User,
  CircleHelp,
  Search,
  Bell,
  Settings,
  Sparkles,
  LogOut,
  Loader2,
  Heart,
  Users,
  Clock,
  Languages,
  Wallet,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "../context/OnboardingContext";
import { useUser } from "../../context/UserContext";
import api from "../api";

import Avatar from "./Avatar";
import Logo from "./Logo";

const UserNavbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { terminateSession } = useOnboarding();
  const dropdownRef = useRef(null);

  const { user, loading } = useUser();
  const currentUserId = user?.id;

  const displayName =
    user?.name ||
    (user?.firstName || user?.lastName ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : null) ||
    user?.username ||
    "";



  const sidebarLinks = [
    { name: t("skill_hub"), path: "/skill-hub", icon: Sparkles },
    { name: t("dashboard"), path: "/dashboard", icon: LayoutDashboard },
    { name: t("matches"), path: "/matches", icon: Heart },
    { name: t("sessions"), path: "/sessions", icon: CalendarDays },
    { name: t("community"), path: "/community", icon: Users },
    { name: t("messages"), path: "/messages", icon: MessageSquare },
    { name: t("profile"), path: "/profile", icon: User },
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: t("help"), path: "/help", icon: CircleHelp },
  ];

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadSessions, setUnreadSessions] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  useEffect(() => {
    if (currentUserId) {
      fetchMessageCount();
      fetchNotifications();
      fetchSessionCount();
      const interval = setInterval(() => {
        fetchMessageCount();
        fetchSessionCount();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  const fetchMessageCount = async () => {
    try {
      const res = await api.get(`/user/messages/unread-count/${currentUserId}`);
      setUnreadMessages(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Message count sync failed:", err);
    }
  };

  const fetchSessionCount = async () => {
    try {
      const res = await api.get(`/user/sessions/${currentUserId}`);
      const incomingPending = (res.data || []).filter(s => s.status === 'PENDING' && s.incoming).length;
      setUnreadSessions(incomingPending);
    } catch (err) {
      console.error("Session count sync failed:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/notifications/${currentUserId}`);
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const markAsRead = async (id, type) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (type === "MATCH") navigate("/matches");
      else if (type === "SESSION") navigate("/sessions");
      else if (type === "POST") navigate("/community");
      setShowNotifications(false);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const currentToken = localStorage.getItem("token");
    try {
      if (currentToken) {
        await api.post("/auth/logout");
      }
    } catch (error) {
       console.warn("Backend logout notification failed:", error);
    } finally {
       setIsLoggingOut(false);
       // Clear stale cached/localStorage user data
       localStorage.removeItem("token");
       localStorage.removeItem("userId");
       localStorage.removeItem("user");
       localStorage.removeItem("onboardingCompleted");
       localStorage.removeItem("currentOnboardingStep");
       terminateSession();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  // Show spinner while loading or if user not available
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-16 bg-[#0B101E]">
        <div className="w-4 h-4 border-2 border-t-2 border-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar/Aside */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-[220px] border-r border-slate-800/60 bg-[#0B101E] text-slate-100 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-10 flex cursor-pointer items-center px-2" onClick={() => { navigate("/skill-hub"); setIsMobileMenuOpen(false); }}>
            <Logo />
          </div>

          <nav className="flex flex-1 flex-col gap-1.5">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] font-medium transition ${
                      isActive ? "bg-slate-800/50 text-[#C4B5FD] border-l-2 border-[#C4B5FD]" : "text-slate-400 hover:bg-slate-800/30 hover:text-white border-l-2 border-transparent"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </div>
                  {link.path === "/messages" && unreadMessages > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white shadow-lg ring-1 ring-[#0B101E]">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                  {link.path === "/sessions" && unreadSessions > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-black text-[#0B101E] shadow-lg ring-1 ring-[#0B101E]">
                      {unreadSessions}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Header */}
      <header className="fixed left-0 md:left-[220px] right-0 top-0 z-20 border-b border-slate-800/60 bg-[#0B101E]/95 px-4 md:px-8 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between w-full gap-4">
          
          {/* Hamburger Menu Toggle Button on Mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-xl border border-white/5 md:hidden transition"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center justify-end flex-1 gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-[#1C2333] border border-slate-700/50 rounded-full p-1 self-center">
               <button 
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full transition-all ${i18n.language.startsWith('en') ? 'bg-indigo-500 text-[#0B101E]' : 'text-slate-500 hover:text-white'}`}
               >
                 EN
               </button>
               <button 
                onClick={() => changeLanguage('ne')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${i18n.language.startsWith('ne') ? 'bg-indigo-500 text-[#0B101E]' : 'text-slate-500 hover:text-white'}`}
               >
                 नेपाली
               </button>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full transition-all relative ${showNotifications ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-[#0B101E]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-[340px] bg-[#111827] border border-slate-700/60 rounded-[24px] shadow-2xl overflow-hidden z-50 origin-top-right"
                  >
                    <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                      <h3 className="text-[14px] font-black text-white">{t('notifications')}</h3>
                      <button className="text-[10px] uppercase font-black tracking-widest text-indigo-400 hover:text-indigo-300">View All</button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center opacity-20">
                          <Bell size={32} className="mx-auto mb-2" />
                          <p className="text-[11px] font-bold uppercase tracking-widest">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => markAsRead(notif.id, notif.type)}
                            className={`px-5 py-4 border-b border-slate-800/40 cursor-pointer transition-all hover:bg-white/5 relative group ${!notif.read ? 'bg-indigo-500/[0.03]' : ''}`}
                          >
                            {!notif.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                            <div className="flex gap-4">
                              <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center bg-white/5 border border-white/5 group-hover:border-white/10">
                                {notif.type === 'MATCH' ? <Heart size={14} className="text-rose-400" /> : notif.type === 'SESSION' ? <CalendarDays size={14} className="text-emerald-400" /> : <Sparkles size={14} className="text-indigo-400" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[12.5px] leading-snug break-words ${!notif.read ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5 opacity-60">
                                  <Clock size={10} />
                                  <span className="text-[10px] font-bold uppercase tracking-wide">{formatTime(notif.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center gap-3">
               <button 
                onClick={() => navigate("/profile")}
                className="bg-[#1C2333] border border-slate-700/50 px-4 py-1.5 rounded-full text-[12px] font-bold text-white hover:border-slate-500 transition"
               >
                 Hi, {displayName.split(' ')[0]}
               </button>
               <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] hover:scale-105 transition overflow-hidden"
               >
                 <Avatar src={user?.profilePictureUrl} name={displayName} size="sm" border={false} className="w-full h-full" />
               </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-[380px] bg-[#111827] border border-slate-700/60 rounded-[32px] p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"><LogOut size={28} /></div>
              <h2 className="text-xl font-black text-white mb-2">{t("exit_node")}</h2>
              <p className="text-slate-400 text-[13px] mb-8">{t("terminate_session")}</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleLogout} className="w-full py-3.5 rounded-xl bg-rose-500 text-white font-black text-[12px] uppercase tracking-widest hover:bg-rose-600 transition shadow-lg">{isLoggingOut ? "Logging out..." : t("yes_terminate")}</button>
                <button onClick={() => setShowLogoutConfirm(false)} className="w-full py-3.5 rounded-xl bg-white/5 text-slate-300 font-black text-[12px] uppercase tracking-widest hover:bg-white/10 transition">{t("stay_connected")}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserNavbar;