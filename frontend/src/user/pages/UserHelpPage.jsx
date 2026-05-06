import React from "react";
import { User, Lock, Bell, MessageCircle, ArrowUpRight, ShieldCheck, Rocket, RefreshCcw, AlertOctagon, HelpCircle, Edit2 } from "lucide-react";
import Avatar from "../components/Avatar";

const UserHelpPage = () => {
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const displayName = user?.name || user?.username || "Weaver";

  return (
    <div className="w-full max-w-[1200px] mx-auto text-slate-100 flex flex-col gap-10 lg:gap-14 pt-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="text-[34px] font-bold text-white tracking-tight leading-tight">Help & Settings</h1>
            <p className="text-[14px] text-slate-400 mt-2 font-medium">
               Manage your expert profile and find answers to your questions.
            </p>
         </div>
         <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-[9px] font-bold text-slate-300 uppercase letter-spacing-widest">
               System Status: <span className="text-emerald-400">Optimal</span>
            </span>
         </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-10">
         
         {/* Settings Menu Sidebar */}
         <div className="w-full lg:w-[280px] shrink-0 space-y-2">
            
            <button className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-slate-800/80 text-[#C4B5FD] border border-slate-700 font-bold text-[14px] transition">
               <span className="flex items-center gap-3"><User size={18} /> Account</span>
               <span className="text-slate-500">&rsaquo;</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/40 hover:text-white font-medium text-[14px] transition">
               <span className="flex items-center gap-3"><Lock size={18} /> Privacy</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/40 hover:text-white font-medium text-[14px] transition">
               <span className="flex items-center gap-3"><Bell size={18} /> Notifications</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/40 hover:text-white font-medium text-[14px] transition">
               <span className="flex items-center gap-3"><MessageCircle size={18} /> Support</span>
            </button>

            {/* Support Widget */}
            <div className="bg-[#1C2133] border border-slate-700/60 rounded-[20px] p-6 mt-8 shadow-xl">
               <h3 className="font-bold text-white mb-2 text-[15px]">Need expert help?</h3>
               <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-6">
                 Our premium support team is available 24/7 for Expert Tier members.
               </p>
               <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-[#a78bfa] hover:text-[#0B101E] text-slate-300 font-bold text-[13px] flex items-center justify-center gap-2 transition cursor-pointer">
                  Contact Support <ArrowUpRight size={14} />
               </button>
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 space-y-8">
            
            {/* Knowledge Base */}
            <div className="bg-[#12182B] border border-slate-700/60 rounded-[28px] p-8 lg:p-10 shadow-xl overflow-hidden relative">
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-800/80 pb-5">
                  <h2 className="text-[20px] font-bold text-white">Knowledge Base</h2>
                  <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                     <button className="px-4 py-2 rounded-full bg-slate-800/60 text-slate-300 text-[11px] font-bold border border-slate-700/60 hover:text-white">Getting Started</button>
                     <button className="px-4 py-2 rounded-full text-slate-400 hover:text-white text-[11px] font-bold">Payments</button>
                     <button className="px-4 py-2 rounded-full text-slate-400 hover:text-white text-[11px] font-bold">Mentorship</button>
                     <button className="px-4 py-2 rounded-full text-slate-400 hover:text-white text-[11px] font-bold">Security</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Article 1 */}
                  <div className="bg-[#161C2C] border border-slate-700/60 rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer group shadow-lg">
                     <div className="w-10 h-10 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-[#C4B5FD] mb-6 group-hover:scale-110 transition">
                        <Rocket size={16} />
                     </div>
                     <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-[#C4B5FD] transition">How do I start a live session?</h3>
                     <p className="text-[12px] text-slate-400 leading-relaxed font-medium">Learn the basics of setting up your virtual mandala workspace for clients.</p>
                  </div>

                  {/* Article 2 */}
                  <div className="bg-[#161C2C] border border-slate-700/60 rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer group shadow-lg">
                     <div className="w-10 h-10 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition">
                        <RefreshCcw size={16} />
                     </div>
                     <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-emerald-400 transition">Withdrawing your earnings</h3>
                     <p className="text-[12px] text-slate-400 leading-relaxed font-medium">Securely transfer your earned credits to your preferred payment method.</p>
                  </div>

                  {/* Article 3 */}
                  <div className="bg-[#161C2C] border border-slate-700/60 rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer group shadow-lg">
                     <div className="w-10 h-10 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition">
                        <ShieldCheck size={16} />
                     </div>
                     <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-blue-400 transition">Two-Factor Authentication</h3>
                     <p className="text-[12px] text-slate-400 leading-relaxed font-medium">Add an extra layer of protection to your expert profile and messages.</p>
                  </div>

                  {/* Article 4 */}
                  <div className="bg-[#161C2C] border border-slate-700/60 rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer group shadow-lg">
                     <div className="w-10 h-10 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-red-400 mb-6 group-hover:scale-110 transition">
                        <AlertOctagon size={16} />
                     </div>
                     <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-red-400 transition">Reporting a violation</h3>
                     <p className="text-[12px] text-slate-400 leading-relaxed font-medium">Guidelines on maintaining the sanctity and respect of the Mandala community.</p>
                  </div>

               </div>
               
               <div className="flex justify-center mt-10">
                  <button className="text-[13px] font-bold text-slate-300 hover:text-white transition">
                     View All 150+ FAQ Articles
                  </button>
               </div>
            </div>

            {/* Account Details */}
            <div className="bg-[#12182B] border border-slate-700/60 rounded-[28px] p-8 lg:p-10 shadow-xl overflow-hidden relative">
               <h2 className="text-[20px] font-bold text-white mb-8">Account Details</h2>

               <div className="bg-[#161C2C] border border-slate-700/60 rounded-2xl p-6 flex items-center justify-between mb-8 shadow-inner">
                  <div className="flex items-center gap-5">
                     <div className="relative">
                        <Avatar 
                          src={user?.profilePictureUrl} 
                          name={displayName} 
                          size="lg" 
                          border={true} 
                          className="w-[70px] h-[70px] rounded-full border-2 border-slate-600" 
                        />
                        <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#C4B5FD] rounded-full flex items-center justify-center border-2 border-[#161C2C] text-[#2E1065] shadow-lg hover:scale-110 transition">
                           <Edit2 size={12} strokeWidth={3} />
                        </button>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Display Name</span>
                        <h3 className="text-[20px] font-bold text-white leading-none">{displayName}</h3>
                     </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                     <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Member Since</span>
                     <span className="text-[16px] font-bold text-white leading-none">Jan 2024</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="flex flex-col gap-2 relative">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                     <input type="text" value={user?.email || "expert@mandala.io"} className="bg-[#1C2133] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white font-medium text-[14px] focus:outline-none focus:border-[#a78bfa] transition" readOnly />
                  </div>
                  <div className="flex flex-col gap-2 relative">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Timezone</label>
                     <select className="bg-[#1C2133] border border-slate-700/60 rounded-xl px-4 py-3.5 text-white font-medium text-[14px] focus:outline-none focus:border-[#a78bfa] transition appearance-none cursor-pointer">
                        <option>GMT+2 (Eastern Europe)</option>
                        <option>GMT-5 (EST)</option>
                        <option>GMT+0 (London)</option>
                     </select>
                  </div>
               </div>

               <div className="flex justify-end gap-3 border-t border-slate-800/80 pt-6">
                  <button className="px-6 py-3 rounded-xl text-[14px] font-bold text-slate-300 hover:text-white transition">Cancel</button>
                  <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C4B5FD] to-[#E9D5FF] text-[#2E1065] text-[14px] font-bold shadow-[0_4px_10px_rgba(216,180,254,0.3)] hover:scale-105 transition-transform">Save Changes</button>
               </div>
            </div>

            {/* Bottom Security / Danger Zone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
               <div className="bg-[#12182B] border border-slate-700/60 rounded-[28px] p-8 shadow-xl flex items-center justify-between group cursor-pointer hover:border-[#a78bfa]/50 transition">
                  <div className="max-w-[300px]">
                     <span className="text-[10px] uppercase font-bold tracking-widest text-[#A78BFA] mb-2 block">Session Security</span>
                     <h3 className="text-lg font-bold text-white mb-2">Encryption is active</h3>
                     <p className="text-[12px] text-slate-400 font-medium leading-relaxed">Your peer-to-peer streams are secured with 256-bit AES.</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-[#C4B5FD] shadow-inner group-hover:scale-110 transition">
                     <ShieldCheck size={32} />
                  </div>
               </div>

               <div className="bg-[rgba(59,10,20,0.4)] border border-red-500/20 rounded-[28px] p-8 shadow-xl hover:border-red-500/40 transition cursor-pointer flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 mb-2 block">Danger Zone</span>
                  <p className="text-[12px] text-red-200/70 font-medium leading-relaxed mb-6">Deactivate your expert profile and hide your data.</p>
                  <span className="text-[12px] font-bold text-red-400 flex items-center gap-1 hover:text-red-300">Manage Account &rsaquo;</span>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
};

export default UserHelpPage;
