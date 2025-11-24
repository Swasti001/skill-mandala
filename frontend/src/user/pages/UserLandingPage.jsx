import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Zap, Brain, Sparkles, Target, ArrowRight, ShieldCheck, Users } from "lucide-react";
import UserLandingNavbar from "../components/UserLandingNavbar";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="group relative p-8 bg-[#12182B]/60 backdrop-blur-xl border border-white/5 rounded-[32px] hover:bg-[#1C2333]/80 hover:border-indigo-500/30 transition-all cursor-pointer overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all" />
    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all">
      <Icon className="text-indigo-400 group-hover:text-amber-400 transition-colors" size={28} />
    </div>
    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    <div className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white transition-colors">
      Explore System <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
    </div>
  </motion.div>
);

const UserLandingPage = () => {
  const { t } = useTranslation();
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans overflow-x-hidden">
      <UserLandingNavbar />

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="relative z-10 space-y-8 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md"
          >
            <Sparkles size={14} className="text-amber-400" /> 
            Skill Mandala Network Online
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black leading-none tracking-tighter"
          >
            Balance Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
              Knowledge Aura
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium"
          >
            A peer-to-peer neural network where you exchange skills, track daily habits, and grow your reputation through verified teaching and learning sessions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
          >
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest
                         bg-white text-[#020617] shadow-[0_0_40px_rgba(255,255,255,0.3)]
                         hover:scale-105 transition-all flex items-center gap-3"
            >
              {isAuthenticated ? "Enter Dashboard" : "Initiate Sequence"} <Zap size={16} fill="currentColor" />
            </Link>
            <Link
              to="/explore-skills"
              className="px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest
                         border border-white/10 text-white/70 hover:bg-white/5 hover:text-white transition-all"
            >
              Explore Hub
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Showcase */}
      <section className="py-32 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Core Architecture</h2>
            <p className="text-4xl md:text-5xl font-black tracking-tighter">Everything you need to evolve.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Target} 
              title="Monthly Mandala Tracker" 
              description="Visualize your 31-day skill progression. Log your daily habits into an interactive, concentric mandala grid that blooms as you grow."
              delay={0}
            />
            <FeatureCard 
              icon={Brain} 
              title="Neural Hub Matching" 
              description="Find your exact counterpart. Our system matches what you want to learn with what others want to teach, ensuring perfect resonance."
              delay={0.2}
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Aura & Reputation" 
              description="Build a verifiable track record. Earn Guiding and Seeking reputation scores backed by blockchain-inspired Universal Credits."
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Interactive Visual Section - The Tracker Teaser */}
      <section className="py-32 relative z-10 bg-gradient-to-b from-[#020617] to-[#0A0F1E] border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              Live Feature
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
              Watch your <br/> habits bloom.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We ditched the boring checklists. The <strong>Mandala Tracker</strong> uses polar coordinate grids to map your 31-day habits into a sacred geometry visualization. 
              Click segments, balance your Teaching vs. Learning energy, and build unbreakable streaks.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-4 text-sm font-bold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Zap size={14} /></div>
                4 Concurrent Skill Rings
              </li>
              <li className="flex items-center gap-4 text-sm font-bold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Users size={14} /></div>
                Syncs with Live Sessions
              </li>
              <li className="flex items-center gap-4 text-sm font-bold text-slate-300">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400"><Target size={14} /></div>
                Visualizes Burnout & Balance
              </li>
            </ul>
            <div className="pt-8">
              <Link to="/signup" className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white transition flex items-center gap-2">
                Start Tracking Free <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Static representation of the Mandala Tracker for the landing page */}
          <div className="relative aspect-square flex items-center justify-center">
             <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
             <svg viewBox="0 0 400 400" className="w-full h-full relative z-10 drop-shadow-2xl">
                {/* Petals */}
                {[...Array(8)].map((_, i) => (
                  <path 
                    key={`p-${i}`}
                    d="M 200 60 Q 240 10 200 -20 Q 160 10 200 60"
                    transform={`rotate(${i * 45} 200 200)`}
                    className="fill-indigo-500/10 stroke-indigo-400/30"
                  />
                ))}
                
                {/* Circular Grid Rings */}
                {[1,2,3,4].map(ring => (
                  <circle key={`r-${ring}`} cx="200" cy="200" r={40 + (ring * 25)} className="fill-none stroke-white/10 stroke-[0.5px]" />
                ))}
                
                {/* Radial Lines */}
                {[...Array(31)].map((_, i) => (
                   <line 
                     key={`l-${i}`} 
                     x1="200" y1="200" 
                     x2="200" y2="60" 
                     transform={`rotate(${i * (360/31)} 200 200)`} 
                     className="stroke-white/10 stroke-[0.5px]" 
                   />
                ))}

                {/* Simulated Filled Segments */}
                <path d="M 200 200 L 200 115 A 85 85 0 0 1 216 116 L 200 200" className="fill-emerald-400/80" transform="rotate(35 200 200)"/>
                <path d="M 200 200 L 200 90 A 110 110 0 0 1 220 92 L 200 200" className="fill-indigo-500/80" transform="rotate(70 200 200)"/>
                <path d="M 200 200 L 200 140 A 60 60 0 0 1 210 141 L 200 200" className="fill-amber-400/80" transform="rotate(105 200 200)"/>
                <path d="M 200 200 L 200 115 A 85 85 0 0 1 216 116 L 200 200" className="fill-rose-400/80" transform="rotate(140 200 200)"/>
                <path d="M 200 200 L 200 90 A 110 110 0 0 1 220 92 L 200 200" className="fill-emerald-400/80" transform="rotate(175 200 200)"/>
                
                {/* Core */}
                <circle cx="200" cy="200" r="35" className="fill-[#0A0F1E] stroke-white/20" />
                <circle cx="200" cy="200" r="10" className="fill-amber-400 animate-pulse" />
             </svg>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-10 bg-white/5 border border-white/10 rounded-[40px] p-16 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-rose-500/20 -z-10" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Ready to synchronize?</h2>
          <p className="text-slate-400 text-lg">Join the network. Offer a skill, learn a skill, and watch your mandala grow.</p>
          <Link
            to="/signup"
            className="inline-block px-12 py-5 bg-white text-[#020617] rounded-2xl
                       text-sm font-black uppercase tracking-widest shadow-2xl
                       hover:scale-105 transition-all"
          >
            Create Your Profile
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UserLandingPage;
