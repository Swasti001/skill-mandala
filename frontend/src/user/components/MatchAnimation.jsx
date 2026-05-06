import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRightLeft, MessageSquare, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";

/**
 * MatchAnimation Component
 * Redesigned to match the "Mandala Synchronized" aesthetic requested by the user.
 */
const MatchAnimation = ({ 
  isVisible, 
  onClose, 
  otherUserName, 
  otherUserId, 
  otherUserProfilePictureUrl,
  exchangeInfo 
}) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const myName = user?.name || "Me";

  // Default exchange info if none provided
  const displayExchange = exchangeInfo || {
    give: "Knowledge",
    receive: "Expertise"
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B101E]/98 backdrop-blur-3xl p-6"
        >
          {/* Confetti Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  scale: 0, 
                  rotate: 0,
                  opacity: 0.8
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`, 
                  scale: Math.random() * 1.2, 
                  rotate: 720,
                  opacity: 0
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-indigo-400' : 'bg-purple-400'}`}
              />
            ))}
          </div>

          <motion.div 
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-[480px] bg-[#12182B] border border-white/10 rounded-[48px] p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col items-center"
          >
            {/* Header Labels */}
            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-4 text-center">
              Mandala Synchronized
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-white flex items-center gap-3 mb-10">
              <span className="text-3xl">🎉</span> It's a Match!
            </h2>

            {/* Avatar Sync Section */}
            <div className="flex items-center gap-6 mb-12">
               {/* My Avatar Card */}
               <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-24 h-24 rounded-[32px] bg-indigo-600/20 border-2 border-indigo-500/30 p-1 flex items-center justify-center shadow-2xl shadow-indigo-500/10"
               >
                  <Avatar src={user?.profilePictureUrl} name={myName} size="lg" border={false} className="rounded-[28px]" />
               </motion.div>

               <div className="flex flex-col items-center gap-2">
                  <ArrowRightLeft className="text-slate-600" size={20} />
               </div>

               {/* Other User Avatar Card */}
               <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-24 h-24 rounded-[32px] bg-emerald-600/20 border-2 border-emerald-500/30 p-1 flex items-center justify-center shadow-2xl shadow-emerald-500/10"
               >
                  <Avatar src={otherUserProfilePictureUrl} name={otherUserName} size="lg" border={false} className="rounded-[28px]" />
               </motion.div>
            </div>

            {/* The Exchange Section */}
            <div className="w-full bg-white/5 border border-white/5 rounded-[32px] p-6 mb-10 text-center">
               <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">The Exchange</div>
               <p className="text-[13px] font-medium text-slate-200">
                  Exchange <span className="text-indigo-400 font-black">{displayExchange.give}</span> for <span className="text-emerald-400 font-black">{displayExchange.receive}</span>
               </p>
            </div>

            {/* Actions */}
            <div className="w-full space-y-4">
               <button
                 onClick={() => {
                   onClose();
                   navigate('/messages', { state: { autoSelectUserId: otherUserId } });
                 }}
                 className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3"
               >
                 Open Chat <MessageSquare size={18} />
               </button>

               <button
                 onClick={onClose}
                 className="w-full py-4 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
               >
                 <Compass size={14} /> Continue Exploring
               </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchAnimation;
