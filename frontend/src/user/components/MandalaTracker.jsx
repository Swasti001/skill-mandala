import React, { useState, useEffect } from "react";
import api from "../api";
import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";

const MandalaTracker = ({ streak = 0, teachingHours = 0, learningHours = 0, completedGoals = 0 }) => {
  const daysInMonth = 31;
  const habits = ["Teaching", "Learning", "Credits", "Badges"];
  const numRings = habits.length;
  
  // Center and sizes
  const cx = 200;
  const cy = 200;
  const maxRadius = 130;
  const innerRadius = 30; // Leave center empty
  const ringWidth = (maxRadius - innerRadius) / numRings;

  // [dayIndex][habitIndex]
  const [trackedData, setTrackedData] = useState({});

  useEffect(() => {
    const fetchMandalaData = async () => {
      try {
        const response = await api.get("/user/mandala");
        const data = response.data;
        if (Object.keys(data).length === 0) {
          const defaultData = {};
          for (let d = 0; d < daysInMonth; d++) {
            defaultData[d] = {};
            for (let h = 0; h < numRings; h++) {
              defaultData[d][h] = false;
            }
          }
          setTrackedData(defaultData);
        } else {
          setTrackedData(data);
        }
      } catch (err) {
        console.error("Failed to fetch mandala data", err);
      }
    };
    fetchMandalaData();
  }, [daysInMonth, numRings]);

  const toggleSegment = async (day, habit) => {
    if (!trackedData || Object.keys(trackedData).length === 0) return;

    const newData = {
      ...trackedData,
      [day]: {
        ...trackedData[day],
        [habit]: !trackedData[day][habit]
      }
    };
    
    // Optimistic update
    setTrackedData(newData);

    try {
      await api.post("/user/mandala", newData);
    } catch (err) {
      console.error("Failed to save mandala data", err);
      // Revert on failure could be implemented here
    }
  };

  // Helper to calculate SVG arc path for a segment
  const describeArc = (x, y, innerR, outerR, startAngle, endAngle) => {
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };

    const startOuter = polarToCartesian(x, y, outerR, endAngle);
    const endOuter = polarToCartesian(x, y, outerR, startAngle);
    const startInner = polarToCartesian(x, y, innerR, endAngle);
    const endInner = polarToCartesian(x, y, innerR, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      "M", startOuter.x, startOuter.y,
      "A", outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      "L", endInner.x, endInner.y,
      "A", innerR, innerR, 0, largeArcFlag, 1, startInner.x, startInner.y,
      "Z"
    ].join(" ");

    return d;
  };

  // Generate Segments
  const segments = [];
  const anglePerDay = 360 / daysInMonth;

  for (let d = 0; d < daysInMonth; d++) {
    const startAngle = d * anglePerDay;
    const endAngle = (d + 1) * anglePerDay;

    for (let h = 0; h < numRings; h++) {
      const rInner = innerRadius + (h * ringWidth);
      const rOuter = innerRadius + ((h + 1) * ringWidth);
      const isFilled = trackedData[d] && trackedData[d][h];
      
      // Determine color based on habit ring to make it beautiful
      const colors = ["fill-indigo-500", "fill-emerald-400", "fill-amber-400", "fill-rose-400"];
      const fillColor = isFilled ? colors[h % colors.length] : "fill-transparent";
      const opacity = isFilled ? "opacity-80 hover:opacity-100" : "opacity-0 hover:opacity-20 hover:fill-white";

      segments.push(
        <path
          key={`seg-${d}-${h}`}
          d={describeArc(cx, cy, rInner, rOuter, startAngle, endAngle)}
          className={`${fillColor} ${isFilled ? "opacity-80" : "opacity-0 hover:opacity-20 hover:fill-white"} stroke-white/20 stroke-[0.5px] transition-all duration-300 cursor-pointer`}
          onClick={() => toggleSegment(d, h)}
        />
      );
    }
  }

  // Generate decorative outer mandala petals
  const petals = [];
  const numPetals = 16;
  for(let i=0; i<numPetals; i++) {
    const angle = (360 / numPetals) * i;
    petals.push(
      <g key={`petal-${i}`} transform={`rotate(${angle} ${cx} ${cy})`}>
        <path 
          d={`M ${cx} ${cy - maxRadius - 5} 
              C ${cx + 30} ${cy - maxRadius - 20}, ${cx + 40} ${cy - maxRadius - 50}, ${cx} ${cy - maxRadius - 60} 
              C ${cx - 40} ${cy - maxRadius - 50}, ${cx - 30} ${cy - maxRadius - 20}, ${cx} ${cy - maxRadius - 5}`}
          className="fill-none stroke-white/10 stroke-[1px]"
        />
        <path 
          d={`M ${cx} ${cy - maxRadius - 15} 
              Q ${cx + 15} ${cy - maxRadius - 30} ${cx} ${cy - maxRadius - 45} 
              Q ${cx - 15} ${cy - maxRadius - 30} ${cx} ${cy - maxRadius - 15}`}
          className="fill-indigo-500/5 stroke-white/20 stroke-[0.5px]"
        />
      </g>
    );
  }

  // Generate day labels
  const labels = [];
  for (let d = 0; d < daysInMonth; d++) {
    const midAngle = (d + 0.5) * anglePerDay;
    const angleInRadians = (midAngle - 90) * Math.PI / 180.0;
    const labelRadius = maxRadius + 12; // Just outside the grid
    const x = cx + (labelRadius * Math.cos(angleInRadians));
    const y = cy + (labelRadius * Math.sin(angleInRadians));
    
    labels.push(
      <text
        key={`label-${d}`}
        x={x}
        y={y}
        fill="rgba(255,255,255,0.4)"
        fontSize="6"
        fontFamily="sans-serif"
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
        transform={`rotate(${midAngle + (midAngle > 90 && midAngle < 270 ? 180 : 0)} ${x} ${y})`}
      >
        {d + 1}
      </text>
    );
  }

  return (
    <div className="w-full bg-[#12182B]/60 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col xl:flex-row items-center gap-12">
      
      {/* TEXT INFO & HABIT LEGEND */}
      <div className="flex-1 space-y-8 z-10 w-full xl:max-w-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-white tracking-tight">Monthly Mandala</h2>
            <Sparkles className="text-amber-400 w-6 h-6" />
          </div>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Track your daily habits and skills over 31 days. Watch your mandala bloom as you maintain consistency. Click on the segments in the chart to toggle them.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <Info size={14} /> Tracking Legend
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {habits.map((habit, idx) => {
              const colors = ["bg-indigo-500", "bg-emerald-400", "bg-amber-400", "bg-rose-400"];
              return (
                <div key={habit} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition">
                  <div className={`w-3 h-3 rounded-full ${colors[idx]} shadow-[0_0_10px_currentColor]`} />
                  <span className="text-xs font-bold text-white tracking-wide">{habit}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Streak</p>
             <p className="text-xl font-black text-white mt-1">{streak} Days</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Weaving Sessions</p>
             <p className="text-xl font-black text-white mt-1">{teachingHours + learningHours} Sessions</p>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl">
          <p className="text-xs text-indigo-200 font-medium italic text-center">
            "A beautifully filled mandala is the reflection of a disciplined mind."
          </p>
        </div>
      </div>

      {/* MANDALA SVG */}
      <div className="relative w-full max-w-[500px] aspect-square flex-shrink-0 flex items-center justify-center">
        {/* Glow behind the mandala */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full -z-10" />

        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Decorative Petals */}
          {petals}

          {/* Main tracking grid segments */}
          {segments}

          {/* Concentric Grid Lines */}
          {[...Array(numRings + 1)].map((_, i) => (
            <circle
              key={`ringLine-${i}`}
              cx={cx} cy={cy}
              r={innerRadius + (i * ringWidth)}
              className="fill-none stroke-white/20 stroke-[0.5px]"
            />
          ))}

          {/* Radial Grid Lines (Days) */}
          {[...Array(daysInMonth)].map((_, d) => {
            const angleInRadians = (d * anglePerDay - 90) * Math.PI / 180.0;
            return (
              <line
                key={`radialLine-${d}`}
                x1={cx + (innerRadius * Math.cos(angleInRadians))}
                y1={cy + (innerRadius * Math.sin(angleInRadians))}
                x2={cx + (maxRadius * Math.cos(angleInRadians))}
                y2={cy + (maxRadius * Math.sin(angleInRadians))}
                className="stroke-white/20 stroke-[0.5px]"
              />
            );
          })}

          {/* Day Numbers 1 to 31 */}
          {labels}

          {/* Center Hub */}
          <circle cx={cx} cy={cy} r={innerRadius - 5} fill="rgba(30,41,59,0.8)" className="stroke-white/10 stroke-[1px]" />
          <circle cx={cx} cy={cy} r="8" fill="url(#centerGlow)" />
          <circle cx={cx} cy={cy} r="3" fill="#fff" />
        </svg>
      </div>

    </div>
  );
};

export default MandalaTracker;
