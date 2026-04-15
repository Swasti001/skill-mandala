import React from 'react';

const Logo = ({ className = "w-10 h-10", showText = true }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]">
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="45" className="fill-none stroke-slate-700/50 stroke-[2px]" strokeDasharray="4 4" />
          
          {/* Base Octagon */}
          <polygon points="50,10 78,22 90,50 78,78 50,90 22,78 10,50 22,22" className="fill-none stroke-amber-500/80 stroke-[3px]" />
          
          {/* Overlapping Squares forming an 8-point star */}
          <rect x="25" y="25" width="50" height="50" className="fill-none stroke-indigo-400/90 stroke-[2.5px]" />
          <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" className="fill-none stroke-emerald-400/90 stroke-[2.5px]" />
          
          {/* Inner core */}
          <circle cx="50" cy="50" r="14" className="fill-[#020617] stroke-amber-400 stroke-[3px]" />
          <circle cx="50" cy="50" r="4" className="fill-amber-400" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-widest text-slate-100 uppercase leading-none font-sans">
            Skill
          </span>
          <span className="text-[0.65rem] font-medium tracking-[0.25em] text-amber-500 uppercase leading-none mt-1">
            Mandala
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
