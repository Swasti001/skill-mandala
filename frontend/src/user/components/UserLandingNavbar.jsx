import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";

const UserLandingNavbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("onboardingCompleted");
    navigate("/", { replace: true });
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-md border-b border-white/5 text-slate-50 px-8 py-5 flex justify-between items-center transition-all duration-300">
      <div className="flex gap-10 items-center">
        <Link to="/" className="transition-transform hover:scale-105">
          <Logo />
        </Link>

        <div className="hidden md:flex gap-6">
          {token && (
            <>
              <Link to="/skill-hub" className="text-[13px] font-bold uppercase tracking-widest hover:text-blue-400 transition">
                {t('dashboard')}
              </Link>
              <Link to="/profile" className="text-[13px] font-bold uppercase tracking-widest hover:text-blue-400 transition">
                {t('profile')}
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
           <button 
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 text-[10px] uppercase font-black tracking-widest rounded-full transition-all ${i18n.language.startsWith('en') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
           >
             EN
           </button>
           <button 
            onClick={() => changeLanguage('ne')}
            className={`px-4 py-1 text-[10px] font-bold rounded-full transition-all ${i18n.language.startsWith('ne') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
           >
             नेपाली
           </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          {token ? (
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:brightness-110 transition-all shadow-xl"
            >
              {t('logout')}
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs font-black uppercase tracking-widest hover:text-blue-400 transition mr-4"
              >
                {t('login')}
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:brightness-110 transition-all shadow-xl"
              >
                {t('join_now')}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UserLandingNavbar;
