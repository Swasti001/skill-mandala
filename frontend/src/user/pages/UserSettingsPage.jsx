import React, { useState } from "react";
import { 
  LogOut, User, ChevronRight, Loader2, Smartphone, ShieldCheck, Moon,
  Bell, Globe, Eye, EyeOff, Mail, Clock, Palette, Volume2, VolumeX,
  Trash2, Download, Key, Monitor, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api";

/**
 * UserSettingsPage Component
 * Comprehensive account management, security, preferences, and system settings.
 */
const UserSettingsPage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    matchAlerts: true,
    sessionReminders: true,
    communityDigest: false,
    darkMode: true,
    language: i18n.language.startsWith('ne') ? 'ne' : 'en',
    profileVisibility: 'public',
    showOnlineStatus: true,
    showLastSeen: true,
    soundEffects: true,
    autoPlayAnimations: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await api.post("/auth/logout");
    } catch (error) {
       console.warn("Backend logout notification failed:", error);
    } finally {
       localStorage.removeItem("token");
       localStorage.removeItem("user");
       localStorage.removeItem("userId");
       localStorage.removeItem("onboardingCompleted");
       setIsLoggingOut(false);
       navigate("/login");
       window.location.reload(); 
    }
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button 
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-colors ${enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
    >
      <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${enabled ? 'left-6' : 'left-1'}`} />
    </button>
  );

  const SettingRow = ({ icon: Icon, label, description, children, iconColor = "text-indigo-400" }) => (
    <div className="flex items-center justify-between py-5 px-2 border-b border-slate-800/40 last:border-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${iconColor}`}>
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-slate-200">{label}</p>
          {description && <p className="text-[11px] text-slate-500 font-medium mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="shrink-0 ml-4">{children}</div>
    </div>
  );

  return (
    <div className="w-full max-w-[800px] mx-auto text-slate-100 flex flex-col gap-8 pt-8 px-6 relative z-10 pb-20">
      
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-[32px] font-black text-white tracking-tighter">Settings</h1>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Manage your preferences and account configuration</p>
      </div>

      {/* Account Section */}
      <div className="bg-[#111827]/60 border border-slate-700/60 rounded-[32px] overflow-hidden shadow-xl">
        <div className="p-6 bg-white/5 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Account</h3>
            <p className="text-[11px] text-slate-500 font-medium">Manage your profile and personal information</p>
          </div>
        </div>
        <div className="p-4">
          <SettingRow icon={User} label="Profile Information" description="Update your name, bio, and avatar photo">
            <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-xl bg-white/5 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-1">
              Edit <ChevronRight size={14} />
            </button>
          </SettingRow>
          <SettingRow icon={Mail} label="Email Address" description={user?.email || "Not configured"} iconColor="text-amber-400">
            <span className="text-[11px] text-emerald-400 font-bold">Verified</span>
          </SettingRow>
          <SettingRow icon={Clock} label="Timezone" description="Used for session scheduling and match discovery" iconColor="text-blue-400">
            <select className="bg-[#1C2133] border border-slate-700/60 rounded-xl px-3 py-2 text-[12px] text-white font-medium focus:outline-none appearance-none cursor-pointer">
              <option>GMT+5:45 (Nepal)</option>
              <option>GMT+5:30 (India)</option>
              <option>GMT+0 (London)</option>
              <option>GMT-5 (EST)</option>
              <option>GMT-8 (PST)</option>
            </select>
          </SettingRow>
          <SettingRow icon={Download} label="Download My Data" description="Export all your profile data, sessions, and history" iconColor="text-emerald-400">
            <button className="px-4 py-2 rounded-xl bg-white/5 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition">
              Export
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-[#111827]/60 border border-slate-700/60 rounded-[32px] overflow-hidden shadow-xl">
        <div className="p-6 bg-white/5 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Bell size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Notifications</h3>
            <p className="text-[11px] text-slate-500 font-medium">Control what alerts and updates you receive</p>
          </div>
        </div>
        <div className="p-4">
          <SettingRow icon={Mail} label="Email Notifications" description="Receive session confirmations and match alerts via email" iconColor="text-amber-400">
            <ToggleSwitch enabled={settings.emailNotifications} onToggle={() => toggleSetting('emailNotifications')} />
          </SettingRow>
          <SettingRow icon={Bell} label="Push Notifications" description="Browser notifications for new messages and updates" iconColor="text-amber-400">
            <ToggleSwitch enabled={settings.pushNotifications} onToggle={() => toggleSetting('pushNotifications')} />
          </SettingRow>
          <SettingRow icon={User} label="New Match Alerts" description="Get notified when the system finds a compatible skill partner" iconColor="text-rose-400">
            <ToggleSwitch enabled={settings.matchAlerts} onToggle={() => toggleSetting('matchAlerts')} />
          </SettingRow>
          <SettingRow icon={Clock} label="Session Reminders" description="Reminders 30 minutes before scheduled sessions" iconColor="text-blue-400">
            <ToggleSwitch enabled={settings.sessionReminders} onToggle={() => toggleSetting('sessionReminders')} />
          </SettingRow>
          <SettingRow icon={Globe} label="Weekly Community Digest" description="Summary of top community posts and platform updates" iconColor="text-emerald-400">
            <ToggleSwitch enabled={settings.communityDigest} onToggle={() => toggleSetting('communityDigest')} />
          </SettingRow>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-[#111827]/60 border border-slate-700/60 rounded-[32px] overflow-hidden shadow-xl">
        <div className="p-6 bg-white/5 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Eye size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Privacy</h3>
            <p className="text-[11px] text-slate-500 font-medium">Control your visibility and data sharing preferences</p>
          </div>
        </div>
        <div className="p-4">
          <SettingRow icon={Eye} label="Profile Visibility" description="Who can see your profile in search and match results" iconColor="text-emerald-400">
            <select 
              value={settings.profileVisibility}
              onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="bg-[#1C2133] border border-slate-700/60 rounded-xl px-3 py-2 text-[12px] text-white font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="public">Public</option>
              <option value="matches">Matches Only</option>
              <option value="private">Private</option>
            </select>
          </SettingRow>
          <SettingRow icon={Monitor} label="Show Online Status" description="Let others see when you're currently active on the platform" iconColor="text-emerald-400">
            <ToggleSwitch enabled={settings.showOnlineStatus} onToggle={() => toggleSetting('showOnlineStatus')} />
          </SettingRow>
          <SettingRow icon={Clock} label="Show Last Seen" description="Display the last time you were active to your matches" iconColor="text-blue-400">
            <ToggleSwitch enabled={settings.showLastSeen} onToggle={() => toggleSetting('showLastSeen')} />
          </SettingRow>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-[#111827]/60 border border-slate-700/60 rounded-[32px] overflow-hidden shadow-xl">
        <div className="p-6 bg-white/5 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Security</h3>
            <p className="text-[11px] text-slate-500 font-medium">Protect your account and manage authentication</p>
          </div>
        </div>
        <div className="p-4">
          <SettingRow icon={Key} label="Change Password" description="Update your account password (min 8 chars, letters + numbers)" iconColor="text-rose-400">
            <button className="px-4 py-2 rounded-xl bg-white/5 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-1">
              Update <ChevronRight size={14} />
            </button>
          </SettingRow>
          <SettingRow icon={ShieldCheck} label="Two-Factor Authentication" description="Add an extra layer of security with 2FA verification" iconColor="text-rose-400">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">Coming Soon</span>
          </SettingRow>
          <SettingRow icon={Smartphone} label="Active Sessions" description="1 device currently logged in" iconColor="text-blue-400">
            <button className="px-4 py-2 rounded-xl bg-white/5 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-1">
              Manage <ChevronRight size={14} />
            </button>
          </SettingRow>
          <SettingRow icon={Monitor} label="Login History" description="View recent login attempts and locations" iconColor="text-indigo-400">
            <button className="px-4 py-2 rounded-xl bg-white/5 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition flex items-center gap-1">
              View <ChevronRight size={14} />
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-[#111827]/60 border border-slate-700/60 rounded-[32px] overflow-hidden shadow-xl">
        <div className="p-6 bg-white/5 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">Preferences</h3>
            <p className="text-[11px] text-slate-500 font-medium">Customize your Skill Mandala experience</p>
          </div>
        </div>
        <div className="p-4">
          <SettingRow icon={Moon} label="Dark Mode" description="Currently active — optimized for low-light environments" iconColor="text-purple-400">
            <ToggleSwitch enabled={settings.darkMode} onToggle={() => toggleSetting('darkMode')} />
          </SettingRow>
          <SettingRow icon={Globe} label="Language" description="Switch between English and Nepali interface" iconColor="text-blue-400">
            <select 
              value={settings.language}
              onChange={(e) => { 
                setSettings(prev => ({ ...prev, language: e.target.value }));
                i18n.changeLanguage(e.target.value);
              }}
              className="bg-[#1C2133] border border-slate-700/60 rounded-xl px-3 py-2 text-[12px] text-white font-medium focus:outline-none appearance-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ne">नेपाली (Nepali)</option>
            </select>
          </SettingRow>
          <SettingRow icon={settings.soundEffects ? Volume2 : VolumeX} label="Sound Effects" description="Notification sounds and UI interaction feedback" iconColor="text-amber-400">
            <ToggleSwitch enabled={settings.soundEffects} onToggle={() => toggleSetting('soundEffects')} />
          </SettingRow>
          <SettingRow icon={Palette} label="Mandala Animations" description="Enable smooth animations on the Mandala Tracker" iconColor="text-emerald-400">
            <ToggleSwitch enabled={settings.autoPlayAnimations} onToggle={() => toggleSetting('autoPlayAnimations')} />
          </SettingRow>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-[#111827]/60 border border-slate-700/60 rounded-[32px] overflow-hidden shadow-xl">
        <div className="p-6 bg-white/5 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-400 flex items-center justify-center">
            <Smartphone size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">System</h3>
            <p className="text-[11px] text-slate-500 font-medium">Platform information and diagnostics</p>
          </div>
        </div>
        <div className="p-4">
          <SettingRow icon={Monitor} label="App Version" description="Skill Mandala v2.4.1 (Production Build)">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Latest</span>
          </SettingRow>
          <SettingRow icon={Globe} label="API Server" description="Connected to localhost:8080 — Spring Boot Backend" iconColor="text-emerald-400">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Online</span>
          </SettingRow>
          <SettingRow icon={ShieldCheck} label="Authentication" description="JWT Token — Stateless session management" iconColor="text-indigo-400">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">Active</span>
          </SettingRow>
          <SettingRow icon={Trash2} label="Clear Local Cache" description="Remove cached data and force a fresh sync" iconColor="text-slate-400">
            <button className="px-4 py-2 rounded-xl bg-white/5 text-[12px] font-bold text-slate-400 hover:text-white hover:bg-white/10 transition">
              Clear
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[rgba(59,10,20,0.3)] border border-red-500/20 rounded-[32px] overflow-hidden shadow-xl">
        <div className="p-6 bg-red-500/5 flex items-center gap-4 border-b border-red-500/10">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-lg font-black text-red-400 tracking-tight">Danger Zone</h3>
            <p className="text-[11px] text-red-300/50 font-medium">Irreversible actions — proceed with caution</p>
          </div>
        </div>
        <div className="p-4">
          <SettingRow icon={EyeOff} label="Deactivate Account" description="Temporarily hide your profile from all users" iconColor="text-red-400">
            <button className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[12px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition">
              Deactivate
            </button>
          </SettingRow>
          <SettingRow icon={Trash2} label="Delete Account" description="Permanently remove your account and all associated data" iconColor="text-red-400">
            <button className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[12px] font-bold text-red-400 hover:bg-red-500 hover:text-white transition">
              Delete
            </button>
          </SettingRow>
        </div>
      </div>

      {/* Logout Action */}
      <div className="mt-4 pt-8 border-t border-slate-800 flex flex-col items-center gap-4">
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-5 rounded-[24px] bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black text-[13px] uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition shadow-xl flex items-center justify-center gap-3 active:scale-95"
        >
          <LogOut size={18} />
          Log Out
        </button>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Skill Mandala v2.4.1 • Built at Islington College</p>
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
              <h2 className="text-2xl font-black text-white mb-4 tracking-tighter">Log Out?</h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 px-4">
                Are you sure you want to log out? You will need to sign in again to access your dashboard, messages, and sessions.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="w-full py-4 rounded-2xl bg-rose-500 text-white font-black text-[13px] uppercase tracking-widest hover:bg-rose-600 transition shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? <Loader2 className="animate-spin" size={18} /> : "Yes, Log Out"}
                </button>
                <button 
                  disabled={isLoggingOut}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-white/5 text-slate-300 font-black text-[13px] uppercase tracking-widest hover:bg-white/10 transition border border-white/5"
                >
                  Cancel
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
