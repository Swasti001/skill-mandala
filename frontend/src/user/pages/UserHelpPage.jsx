import React, { useState } from "react";
import { 
  User, Lock, Bell, MessageCircle, ArrowUpRight, ShieldCheck, Rocket, 
  RefreshCcw, AlertOctagon, HelpCircle, Edit2, Search, ChevronDown, 
  ChevronUp, BookOpen, Target, Users, Wallet, CalendarDays, Brain, 
  Sparkles, Globe, Zap, Heart, Award, TrendingUp
} from "lucide-react";
import Avatar from "../components/Avatar";

const FAQItem = ({ question, answer, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-800/60 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between py-5 px-2 text-left group"
      >
        <span className={`text-[14px] font-bold transition ${isOpen ? 'text-[#C4B5FD]' : 'text-slate-300 group-hover:text-white'}`}>
          {question}
        </span>
        {isOpen ? <ChevronUp size={16} className="text-[#C4B5FD] shrink-0" /> : <ChevronDown size={16} className="text-slate-500 shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-2 pb-5 text-[13px] text-slate-400 leading-relaxed font-medium">
          {answer}
        </div>
      )}
    </div>
  );
};

const UserHelpPage = () => {
  const userJson = localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;
  const displayName = user?.name || user?.username || null;
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "getting-started", label: "Getting Started", icon: Rocket, color: "text-[#C4B5FD]" },
    { id: "matching", label: "Matching & Sessions", icon: Heart, color: "text-rose-400" },
    { id: "tracker", label: "Mandala Tracker", icon: Target, color: "text-amber-400" },
    { id: "wallet", label: "Wallet & Credits", icon: Wallet, color: "text-emerald-400" },
    { id: "community", label: "Community", icon: Users, color: "text-blue-400" },
    { id: "security", label: "Security & Privacy", icon: ShieldCheck, color: "text-red-400" },
  ];

  const faqData = {
    "getting-started": [
      {
        q: "What is Skill Mandala?",
        a: "Skill Mandala is a peer-to-peer skill exchange platform where you can teach what you know and learn what you want. It connects teachers and learners through a neural matching algorithm, tracks daily habits with a sacred geometry-inspired Mandala Tracker, and rewards participation with Universal Credits.",
        open: true
      },
      {
        q: "How do I set up my profile?",
        a: "After signing up, you'll go through a guided onboarding flow. You'll be asked to add your name, bio, select skills you can teach (Guiding Skills), and skills you want to learn (Seeking Skills). You can also set your availability schedule so the matching engine can find compatible partners in your timezone."
      },
      {
        q: "What are Guiding and Seeking skills?",
        a: "Guiding Skills are subjects you are confident teaching to others (e.g., Python, Guitar, Cooking). Seeking Skills are subjects you want to learn from others. The matching algorithm pairs you with users who have complementary skill sets — someone who teaches what you seek, and seeks what you teach."
      },
      {
        q: "How does the matching algorithm work?",
        a: "Our Neural Hub Matching engine scans all user profiles and finds reciprocal matches. For example, if you teach 'React' and seek 'UI/UX Design', and another user teaches 'UI/UX Design' and seeks 'React', you'll be matched. Matches are ranked by skill overlap, availability compatibility, and reputation scores."
      },
      {
        q: "Can I use the platform in Nepali?",
        a: "Yes! Skill Mandala supports both English and Nepali (नेपाली). You can switch languages anytime using the language toggle in the top navigation bar. The entire interface, including navigation labels and notifications, will update instantly."
      }
    ],
    "matching": [
      {
        q: "How do I accept or decline a match?",
        a: "When a new match is found, you'll receive a notification. Go to the Matches page to view the match card. You can see the other user's profile, their skills, and availability. Accept to start a conversation, or pass to skip.",
        open: true
      },
      {
        q: "What is a Skill Agreement?",
        a: "A Skill Agreement is a formal commitment between a teacher and a learner. Only the teacher can initiate an agreement by defining the subject (e.g., 'Python Basics'), the goal (e.g., 'Build a calculator app'), and the number of sessions. This ensures both parties have clear expectations."
      },
      {
        q: "How do I book a session?",
        a: "Once you have an active match, go to the Messages page and open the conversation. You can use the 'Book Session' button to propose a date and time. The other person will receive a notification to accept or suggest an alternative time."
      },
      {
        q: "Can I have multiple active sessions?",
        a: "Yes! You can have multiple active matches and sessions simultaneously. The Mandala Tracker supports tracking up to 4 concurrent skill rings, so you can manage your teaching and learning commitments visually."
      },
      {
        q: "What happens if someone doesn't show up?",
        a: "If a session partner doesn't attend, you can report the no-show through the Sessions page. This affects their reputation score. Repeated no-shows may result in reduced match priority in the system."
      }
    ],
    "tracker": [
      {
        q: "What is the Mandala Tracker?",
        a: "The Mandala Tracker is a 31-day visual habit tracker displayed as a polar coordinate grid (like a sacred geometry mandala). Each day is a segment, and each skill you're tracking is a ring. When you log a habit for a day, the corresponding segment fills in with color, gradually 'blooming' the mandala over the month.",
        open: true
      },
      {
        q: "How do I log a daily habit?",
        a: "Navigate to your Dashboard where the Mandala Tracker is displayed. Click on any segment (day + skill ring intersection) to toggle it. Filled segments represent completed activities. You can track teaching sessions, learning sessions, practice time, and self-study."
      },
      {
        q: "What do the different rings represent?",
        a: "The Mandala Tracker has 4 concentric rings: Ring 1 (innermost) = Teaching sessions completed, Ring 2 = Learning sessions completed, Ring 3 = Self-practice/study time, Ring 4 (outermost) = Community engagement (posts, comments, helping others)."
      },
      {
        q: "Can I view past months?",
        a: "Currently the tracker shows the current month. Your historical data is preserved and can be viewed through the monthly summary statistics displayed below the tracker on your Dashboard."
      },
      {
        q: "What is the 'Aura Balance' indicator?",
        a: "The Aura Balance shows the ratio between your Teaching energy (Guiding) and Learning energy (Seeking). A balanced aura means you're contributing as much as you're receiving, which is the philosophy behind Skill Mandala — mutual growth through balanced exchange."
      }
    ],
    "wallet": [
      {
        q: "What are Universal Credits (UC)?",
        a: "Universal Credits are the internal currency of Skill Mandala. You earn credits by teaching others and spend them by booking learning sessions. Every new user starts with a welcome bonus of 100 UC to get started.",
        open: true
      },
      {
        q: "How do I earn credits?",
        a: "You earn credits primarily by completing teaching sessions. After each session, the learner confirms completion and the agreed credit amount is transferred to your wallet. You can also earn bonus credits through community engagement, maintaining streaks on the Mandala Tracker, and receiving positive reviews."
      },
      {
        q: "How do I spend credits?",
        a: "Credits are spent when you book a learning session with a teacher. The cost is determined by the teacher's rate (visible on their profile) and the session duration. Credits are held in escrow during the session and released to the teacher upon completion confirmation."
      },
      {
        q: "Can I transfer credits to another user?",
        a: "Direct peer-to-peer credit transfers are not currently supported to maintain system integrity. Credits can only be earned through teaching and spent through booking sessions."
      },
      {
        q: "Where can I see my transaction history?",
        a: "Go to the Wallet page from the sidebar navigation. You'll see your current balance, recent transactions with user avatars, and a breakdown of earnings vs. spending over time."
      }
    ],
    "community": [
      {
        q: "What is the Community Feed?",
        a: "The Community Feed is a social space where Skill Mandala members can share knowledge, ask questions, post tips, and engage with each other. You can create text posts, receive upvotes, and participate in threaded comment discussions.",
        open: true
      },
      {
        q: "Can I share resources or links?",
        a: "Yes! You can include links, code snippets, and recommendations in your community posts. This is a great way to share learning resources, tutorials, and helpful tools with the community."
      },
      {
        q: "How do I report inappropriate content?",
        a: "If you encounter any content that violates community guidelines, click the report button (flag icon) on the post or comment. Our admin team reviews all reports within 24 hours and takes appropriate action."
      },
      {
        q: "How does community engagement affect my profile?",
        a: "Active community participation positively impacts your reputation score. Helpful posts, thoughtful comments, and positive interactions contribute to your 'Aura' rating, making you more visible in match results."
      }
    ],
    "security": [
      {
        q: "How is my data protected?",
        a: "All data transmissions are encrypted using industry-standard protocols. Your password is hashed using BCrypt before storage. Authentication uses stateless JWT tokens that expire after a set period, ensuring your sessions are secure.",
        open: true
      },
      {
        q: "How do I change my password?",
        a: "Go to Settings > Security > Change Password. You'll need to enter your current password and then set a new one. For security, your new password must be at least 8 characters with a mix of letters and numbers."
      },
      {
        q: "What happens to my data if I delete my account?",
        a: "If you choose to deactivate your account through Settings > Danger Zone, your profile will be hidden from other users. Your data is retained for 30 days in case you change your mind, after which it is permanently deleted from our servers."
      },
      {
        q: "Are my messages private?",
        a: "Yes, all messages between matched users are private and only visible to the participants of the conversation. Messages are transmitted through secure WebSocket connections and stored with encryption at rest."
      },
      {
        q: "How do I log out from all devices?",
        a: "Go to Settings > Security > Active Sessions. You can view all currently active sessions and terminate any or all of them. This invalidates the JWT tokens on those devices, forcing a re-login."
      }
    ]
  };

  const currentFAQs = faqData[activeCategory] || [];
  const filteredFAQs = searchQuery 
    ? currentFAQs.filter(faq => faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentFAQs;

  const quickStats = [
    { label: "Total FAQs", value: "30+", icon: HelpCircle, color: "text-indigo-400" },
    { label: "Categories", value: "6", icon: BookOpen, color: "text-amber-400" },
    { label: "Avg Response", value: "< 24h", icon: Zap, color: "text-emerald-400" },
    { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "text-rose-400" },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto text-slate-100 flex flex-col gap-10 lg:gap-14 pt-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div>
            <h1 className="text-[34px] font-bold text-white tracking-tight leading-tight">Help Center</h1>
            <p className="text-[14px] text-slate-400 mt-2 font-medium">
               Everything you need to know about using Skill Mandala effectively.
            </p>
         </div>
         <div className="flex items-center gap-3">
            <span className="px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
               System Status: <span className="text-emerald-400">Optimal</span>
            </span>
         </div>
      </div>


      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-10">
         
         {/* Category Sidebar */}
         <div className="w-full lg:w-[280px] shrink-0 space-y-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-[14px] transition ${
                  activeCategory === cat.id 
                    ? 'bg-slate-800/80 text-[#C4B5FD] border border-slate-700' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <cat.icon size={18} className={activeCategory === cat.id ? cat.color : ''} />
                  {cat.label}
                </span>
                {activeCategory === cat.id && <span className="text-slate-500">&rsaquo;</span>}
              </button>
            ))}

            {/* Support Widget */}
            <div className="bg-[#1C2133] border border-slate-700/60 rounded-[20px] p-6 mt-8 shadow-xl">
               <h3 className="font-bold text-white mb-2 text-[15px]">Still need help?</h3>
               <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-4">
                 Can't find what you're looking for? Reach out to our support team and we'll get back to you within 24 hours.
               </p>
               <div className="flex items-center gap-3 bg-white/5 border border-slate-700/40 rounded-xl px-4 py-3 mb-4">
                 <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Phone:</span>
                 <a href="tel:9851062167" className="text-[14px] font-bold text-white hover:text-[#C4B5FD] transition">9851062167</a>
               </div>
               <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-[#a78bfa] hover:text-[#0B101E] text-slate-300 font-bold text-[13px] flex items-center justify-center gap-2 transition cursor-pointer">
                  Contact Support <ArrowUpRight size={14} />
               </button>
            </div>

            {/* Platform Info */}
            <div className="bg-[#1C2133] border border-slate-700/60 rounded-[20px] p-6 mt-4 shadow-xl">
               <h3 className="font-bold text-white mb-3 text-[15px]">About Skill Mandala</h3>
               <div className="space-y-3 text-[12px] text-slate-400 font-medium leading-relaxed">
                 <p><span className="text-slate-300 font-bold">Version:</span> 2.4.1</p>
                 <p><span className="text-slate-300 font-bold">Platform:</span> React + Spring Boot</p>
                 <p><span className="text-slate-300 font-bold">Database:</span> PostgreSQL</p>
                 <p><span className="text-slate-300 font-bold">Real-time:</span> WebSocket (STOMP)</p>
                 <p><span className="text-slate-300 font-bold">Auth:</span> JWT + BCrypt</p>
                 <p className="pt-2 border-t border-slate-700/60 text-[10px] text-slate-500">
                   Built as a Final Year Project at Islington College, Kathmandu.
                 </p>
               </div>
            </div>
         </div>

         {/* FAQ Content Area */}
         <div className="flex-1 space-y-8">
            
            {/* FAQ List */}
            <div className="bg-[#12182B] border border-slate-700/60 rounded-[28px] p-8 lg:p-10 shadow-xl">
               <div className="flex items-center justify-between mb-6 border-b border-slate-800/80 pb-5">
                  <h2 className="text-[20px] font-bold text-white">
                    {categories.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <span className="text-[11px] text-slate-500 font-bold">
                    {filteredFAQs.length} {filteredFAQs.length === 1 ? 'article' : 'articles'}
                  </span>
               </div>

               {filteredFAQs.length > 0 ? (
                 <div>
                   {filteredFAQs.map((faq, i) => (
                     <FAQItem key={i} question={faq.q} answer={faq.a} defaultOpen={faq.open && !searchQuery} />
                   ))}
                 </div>
               ) : (
                 <div className="py-16 text-center">
                   <HelpCircle size={40} className="mx-auto mb-4 text-slate-600" />
                   <p className="text-slate-500 font-bold text-[14px]">No results found</p>
                   <p className="text-slate-600 text-[12px] mt-1">Try a different search term or browse categories</p>
                 </div>
               )}
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="bg-[#12182B] border border-slate-700/60 rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer group shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-[#C4B5FD] mb-5 group-hover:scale-110 transition">
                     <Globe size={16} />
                  </div>
                  <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-[#C4B5FD] transition">Platform Overview</h3>
                  <p className="text-[12px] text-slate-400 leading-relaxed font-medium mb-3">
                    Skill Mandala is a peer-to-peer skill exchange network built as a Final Year Project at Islington College, Kathmandu.
                  </p>
                  <ul className="space-y-2 text-[11px] text-slate-500 font-medium">
                    <li className="flex items-start gap-2"><span className="text-[#C4B5FD] mt-0.5">•</span> Built with React 18, Spring Boot 3, and PostgreSQL</li>
                    <li className="flex items-start gap-2"><span className="text-[#C4B5FD] mt-0.5">•</span> Real-time messaging via WebSocket (STOMP protocol)</li>
                    <li className="flex items-start gap-2"><span className="text-[#C4B5FD] mt-0.5">•</span> JWT-based stateless authentication with BCrypt hashing</li>
                    <li className="flex items-start gap-2"><span className="text-[#C4B5FD] mt-0.5">•</span> Bilingual support: English and Nepali (i18n)</li>
                    <li className="flex items-start gap-2"><span className="text-[#C4B5FD] mt-0.5">•</span> Responsive dark-mode UI with TailwindCSS and Framer Motion</li>
                  </ul>
               </div>

               <div className="bg-[#12182B] border border-slate-700/60 rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer group shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition">
                     <Award size={16} />
                  </div>
                  <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-emerald-400 transition">Reputation System</h3>
                  <p className="text-[12px] text-slate-400 leading-relaxed font-medium mb-3">
                    Your reputation is built through verified interactions and is visible to potential matches.
                  </p>
                  <ul className="space-y-2 text-[11px] text-slate-500 font-medium">
                    <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> <strong className="text-slate-400">Guiding Aura:</strong> Score based on teaching sessions completed and learner ratings</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> <strong className="text-slate-400">Seeking Aura:</strong> Score based on learning commitment and session attendance</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> <strong className="text-slate-400">Universal Credits:</strong> Earn by teaching, spend by learning — blockchain-inspired economy</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> <strong className="text-slate-400">Streaks:</strong> Consecutive daily activity on the Mandala Tracker boosts your Aura</li>
                    <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">•</span> Higher reputation = higher priority in match results</li>
                  </ul>
               </div>

               <div className="bg-[#12182B] border border-slate-700/60 rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer group shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition">
                     <Brain size={16} />
                  </div>
                  <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-amber-400 transition">Neural Matching Deep Dive</h3>
                  <p className="text-[12px] text-slate-400 leading-relaxed font-medium mb-3">
                    The matching engine is the core intelligence of Skill Mandala.
                  </p>
                  <ul className="space-y-2 text-[11px] text-slate-500 font-medium">
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> <strong className="text-slate-400">Step 1:</strong> Scans all users' Guiding and Seeking skill tags</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> <strong className="text-slate-400">Step 2:</strong> Finds reciprocal pairs (User A teaches what User B seeks & vice versa)</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> <strong className="text-slate-400">Step 3:</strong> Ranks matches by skill overlap count and availability compatibility</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> <strong className="text-slate-400">Step 4:</strong> Factors in past session ratings and reputation scores</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Results presented as interactive Match Cards with accept/pass actions</li>
                  </ul>
               </div>

               <div className="bg-[#12182B] border border-slate-700/60 rounded-2xl p-6 hover:-translate-y-1 transition-transform cursor-pointer group shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-110 transition">
                     <Sparkles size={16} />
                  </div>
                  <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-rose-400 transition">Tips for Success</h3>
                  <p className="text-[12px] text-slate-400 leading-relaxed font-medium mb-3">
                    Maximize your Skill Mandala experience with these proven strategies.
                  </p>
                  <ul className="space-y-2 text-[11px] text-slate-500 font-medium">
                    <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">•</span> Add at least 3 Guiding and 3 Seeking skills for better match diversity</li>
                    <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">•</span> Keep your availability schedule updated for accurate session booking</li>
                    <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">•</span> Use the Mandala Tracker daily — even logging 1 ring builds momentum</li>
                    <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">•</span> Engage in the Community Feed to boost visibility and reputation</li>
                    <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">•</span> Always confirm session completion — both parties earn credits and reputation</li>
                  </ul>
               </div>
            </div>

            {/* Account Details */}
            <div className="bg-[#12182B] border border-slate-700/60 rounded-[28px] p-8 lg:p-10 shadow-xl">
               <h2 className="text-[20px] font-bold text-white mb-8">Your Account</h2>

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
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Logged in as</span>
                        <h3 className="text-[20px] font-bold text-white leading-none">{displayName}</h3>
                        <p className="text-[12px] text-slate-500 mt-1">{user?.email || "No email set"}</p>
                     </div>
                  </div>
                  <div className="flex flex-col items-end text-right">
                     <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1.5">Role</span>
                     <span className="text-[14px] font-bold text-[#C4B5FD] leading-none">Member</span>
                  </div>
               </div>

               {/* Encryption */}
               <div className="flex items-center justify-between bg-[#161C2C] border border-slate-700/60 rounded-2xl p-6 shadow-inner">
                  <div className="max-w-[300px]">
                     <span className="text-[10px] uppercase font-bold tracking-widest text-[#A78BFA] mb-2 block">Session Security</span>
                     <h3 className="text-lg font-bold text-white mb-2">Encryption is active</h3>
                     <p className="text-[12px] text-slate-400 font-medium leading-relaxed">Your messages and sessions are secured with JWT authentication and encrypted WebSocket connections.</p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#1C2133] border border-slate-700 flex items-center justify-center text-[#C4B5FD] shadow-inner">
                     <ShieldCheck size={32} />
                  </div>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
};

export default UserHelpPage;
