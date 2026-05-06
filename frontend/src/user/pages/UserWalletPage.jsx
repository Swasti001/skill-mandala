import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coins, Zap, Trophy, History, ArrowUpRight, ArrowDownRight, 
  Star, ShieldCheck, Sparkles, TrendingUp, Layers
} from "lucide-react";
import { useUser } from "../../context/UserContext";
import api from "../api";
import { useTranslation } from "react-i18next";
import Avatar from "../components/Avatar";

const RepStat = ({ label, value, icon: Icon, color, percent }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
        <Icon size={12} className={color} /> {label}
      </div>
      <span className="text-sm font-black text-white">{value.toFixed(1)} / 5.0</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full bg-gradient-to-r ${color === 'text-emerald-400' ? 'from-emerald-600 to-emerald-400' : 'from-indigo-600 to-indigo-400'}`}
      />
    </div>
  </div>
);

const UserWalletPage = () => {
  const { t } = useTranslation();
  const { user, refreshUser } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.id;

  const fetchTransactions = React.useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/user/wallet/transactions/${userId}`);
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Failed to synchronize with the Mandala Ledger.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshUser();
    fetchTransactions();
  }, [userId, fetchTransactions]); // Removed refreshUser from deps as it's stable now and we don't want to loop if it refetches user

  const credits = user?.credits || 0;
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  
  // Reputation stats
  const teachRep = user?.teachingReputation || 5.0;
  const learnRep = user?.learningReputation || 5.0;
  const totalSess = (user?.totalTeachingSessions || 0) + (user?.totalLearningSessions || 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 relative overflow-hidden text-left">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      {/* Header */}
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">
           <ShieldCheck size={12} /> Mandala Financial Integrity
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-2">My <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400">Wealth</span></h1>
        <p className="text-slate-400 text-sm font-medium max-w-xl leading-relaxed">
          The flow of shared wisdom. Track your credits, level progression, and the resonance of your teaching aura.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Wallet Summary */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20"
          >
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-8">{t('total_credits')}</p>
              <div className="flex items-end gap-3 mb-10">
                <span className="text-6xl font-black tracking-tighter">{credits.toLocaleString()}</span>
                <span className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Credits</span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">XP Power</p>
                  <p className="text-lg font-bold">{xp.toLocaleString()}</p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Neural Level</p>
                  <p className="text-lg font-bold">{level}</p>
                </div>
              </div>
            </div>
            {/* Glass decoration */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <Sparkles className="absolute top-8 right-8 opacity-20" size={40} />
          </motion.div>

          <div className="bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[40px] p-8 space-y-8 shadow-xl">
             <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
               <TrendingUp size={16} className="text-emerald-400" /> Mandala Wisdom
             </h3>
             
             <div className="space-y-6">
               <RepStat 
                 label="Guide Aura (Teaching)" 
                 value={teachRep} 
                 percent={teachRep * 20} 
                 icon={Sparkles} 
                 color="text-emerald-400" 
               />
               <RepStat 
                 label="Seeker Clarity (Learning)" 
                 value={learnRep} 
                 percent={learnRep * 20} 
                 icon={Zap} 
                 color="text-indigo-400" 
               />
             </div>

             <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Sessions</span>
                <span className="text-xl font-black text-white">{totalSess}</span>
             </div>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#12182B]/30 backdrop-blur-md border border-slate-700/30 rounded-[40px] overflow-hidden h-full flex flex-col shadow-2xl"
          >
            <div className="px-10 py-8 border-b border-slate-800/60 flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-4 tracking-tight">
                <History className="text-indigo-400" size={24} /> Neural Ledger
              </h2>
              <Layers size={20} className="text-slate-600 opacity-20" />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center p-20 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                   Synchronizing Ledger...
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-32 text-rose-400">
                   <Zap size={48} className="mb-6 opacity-30" />
                   <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                   <button onClick={() => fetchTransactions()} className="mt-4 px-4 py-2 bg-white/5 rounded-lg border border-white/5 text-[10px] uppercase font-black tracking-widest hover:bg-white/10 transition"> {t('retry')} </button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 opacity-30">
                   <Coins size={48} className="mb-6" />
                   <p className="text-xs font-black uppercase tracking-widest">No transactions discovered</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/40">
                  <AnimatePresence>
                    {transactions.map((tx, idx) => (
                      <motion.div 
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-10 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
                      >
                        <div className="flex items-center gap-6">
                           <div className="relative">
                            <Avatar src={tx.otherUserProfilePicture} name={tx.otherUserName} size="md" border={false} className="rounded-2xl" />
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0B101E] ${tx.amount > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                              {tx.amount > 0 ? <ArrowDownRight size={12} strokeWidth={4} /> : <ArrowUpRight size={12} strokeWidth={4} />}
                            </div>
                           </div>
                          <div>
                            <p className="text-[15px] font-bold text-white mb-1 tracking-tight">{tx.description}</p>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                               {new Date(tx.createdAt).toLocaleDateString()} 
                               <span className="opacity-20">•</span> 
                               <span className={tx.amount > 0 ? 'text-emerald-400/60' : 'text-rose-400/60'}>Partner: {tx.otherUserName || 'External'}</span>
                            </p>
                          </div>
                        </div>
                        <div className={`text-xl font-black text-right ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                          <span className="text-[9px] font-black uppercase tracking-widest ml-2 opacity-40">CR</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="p-8 border-t border-slate-800/60 bg-black/20 text-center">
               <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Encrypted Financial Loop v2.0</p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default UserWalletPage;
