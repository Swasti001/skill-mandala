import React, { useState } from "react";
import { LogOut, User, ChevronRight, Loader2, Smartphone, ShieldCheck, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * UserSettingsPage Component
 * Provides account management options and a high-security logout flow.
 */
const UserSettingsPage = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const currentToken = localStorage.getItem("token");

    // 1. Optimistic Cleanup
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("onboardingCompleted");

    try {
      // 2. Notify backend (authenticated if token exists)
      if (currentToken) {
        await axios.post("http://localhost:8080/api/auth/logout", {}, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
      }
    } catch (error) {
       console.warn("Backend logout notification failed:", error);
    } finally {
       setIsLoggingOut(false);
       navigate("/login");
       window.location.reload(); 
    }
  };

  const sections = [
    { title: "Account", icon: User, items: ["Profile Information", "Email Preferences", "Phone Verification"] },
    { title: "Security", icon: ShieldCheck, items: ["Change Password", "Two-Factor Auth", "active Sessions"] },
    { title: "Preferences", icon: Moon, items: ["Theme Sync", "Haptic Feedback", "Privacy Mode"] },
    { title: "System", icon: Smartphone, items: ["Biometric Login", "Clear Cache", "Version 2.4.1"] },
  ];

  return (
    <div className="w-full max-w-[800px] mx-auto text-slate-100 flex flex-col gap-8 pt-8 px-6 relative z-10 pb-20">
      
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-[32px] font-black text-white tracking-tighter">Command Center</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Manage your mandala node and sync settings</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-[#111827]/60 border border-slate-700/60 rounded-[32px] overflow-hidden shadow-xl">
            <div className="p-6 bg-white/5 flex items-center gap-4 border-b border-white/5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <section.icon size={20} />
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">{section.title}</h3>
            </div>
            <div className="p-2">
               {section.items.map((item, i) => (
                 <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition group text-left">
                    <span className="text-[14px] font-medium text-slate-400 group-hover:text-white transition">{item}</span>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition" />
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Action (Red / Distinct) */}
      <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col items-center gap-4">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-5 rounded-[24px] bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-[13px] uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition shadow-xl flex items-center justify-center gap-3 active:scale-95"
        >
          <LogOut size={18} />
          Terminate Authorization
        </button>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Skill Mandala Node Sync v2.4.0</p>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-[400px] bg-[#111827] border border-slate-700/60 rounded-[40px] p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <LogOut size={32} />
              </div>
              <h2 className="text-2xl font-black text-white mb-4 tracking-tighter">Confirm Terminate?</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 px-4">
                Are you sure you want to log out? Your current session sync will be invalidated across all nodes.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="w-full py-4 rounded-2xl bg-rose-500 text-white font-black text-[13px] uppercase tracking-widest hover:bg-rose-600 transition shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? <Loader2 className="animate-spin" size={18} /> : "Yes, Terminate Hub"}
                </button>
                <button 
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 text-slate-300 font-black text-[13px] uppercase tracking-widest hover:bg-white/10 transition border border-white/5"
                >
                  Stay Connected
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default UserSettingsPage;
