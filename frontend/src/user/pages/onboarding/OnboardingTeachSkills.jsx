import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOnboarding } from "../../context/OnboardingContext";
import { useToast } from "../../context/ToastContext";

const PRESET_SKILLS = [
  "Web Development",
  "Python",
  "Graphic Design",
  "Guitar",
  "English Speaking",
  "Data Analysis",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];
const OnboardingTeachSkills = () => {
  const navigate = useNavigate();
  const {
    teachSkills,
    setTeachSkills,
    learnSkills,
    teachAvailability,
    setTeachAvailability,
    goToStep
  } = useOnboarding();
  const { showToast } = useToast();

  const [customSkill, setCustomSkill] = useState("");

  const toggleSkill = (skill) => {
    if (learnSkills.includes(skill)) {
      showToast("You can't teach a skill you are already learning!", "error");
      return;
    }

    setTeachSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustom = () => {
    const skill = customSkill.trim();
    if (!skill) return;

    if (learnSkills.includes(skill)) {
      showToast("You can't teach a skill you are already learning!", "error");
      return;
    }

    if (!teachSkills.includes(skill)) {
      setTeachSkills((prev) => [...prev, skill]);
    }

    setCustomSkill("");
  };

  const handleAvailabilityChange = (day, time) => {
    setTeachAvailability((prev) => ({
      ...prev,
      [day]: time,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();

    // ✅ required fields to avoid null/empty overwrite
    if (teachSkills.length === 0) {
      showToast("Please select at least one skill to teach.", "error");
      return;
    }

    // ✅ IMPORTANT: check VALUES not just keys (keys can exist with empty "")
    const teachSelected = Object.values(teachAvailability).filter(Boolean).length;
    if (teachSelected === 0) {
      showToast("Please select at least one teach availability slot.", "error");
      return;
    }

    goToStep(3);
    navigate("/onboarding/learn");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B101E] text-white overflow-hidden p-6">
      {/* Abstract Background Glow Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      {/* Corner Mandala Illustrations */}
      <img src={process.env.PUBLIC_URL + "/onboarding_teach_illustration_1779854532958.png"} alt="Mandala" className="absolute left-0 top-0 w-48 opacity-10 pointer-events-none" />
      <img src={process.env.PUBLIC_URL + "/onboarding_teach_illustration_1779854532958.png"} alt="Mandala" className="absolute right-0 bottom-0 w-48 opacity-10 transform rotate-180 pointer-events-none" />

      <div className="w-full max-w-xl bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[40px] shadow-2xl p-10 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Step 2 of 3</p>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">What can you teach?</h1>
        <p className="text-slate-400 text-sm font-medium mb-8">
          Choose skills you feel comfortable teaching and your availability.
        </p>

        <form onSubmit={handleNext} className="space-y-6">
          {/* Preset Skills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {PRESET_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-3 rounded-2xl border text-left font-bold transition duration-300 ${
                  teachSkills.includes(skill)
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                    : "border-slate-800 bg-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Custom Skill */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Add another skill
            </label>

            <div className="flex gap-2">
              <input
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition duration-300"
                placeholder="e.g. Photography"
              />

              <button
                type="button"
                onClick={handleAddCustom}
                className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-850 hover:bg-white/5 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Teach Availability */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                When are you usually available to teach?
              </label>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Set all:</span>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      DAYS.forEach(day => handleAvailabilityChange(day, val));
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition duration-300"
                  defaultValue=""
                >
                  <option value="" disabled>Choose...</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-12 text-slate-400 font-bold">{day}</span>

                  <select
                    value={teachAvailability[day] || ""}
                    onChange={(e) =>
                      handleAvailabilityChange(day, e.target.value)
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition duration-300"
                  >
                    <option value="">Select time</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest bg-indigo-500 text-[#0B101E] hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-xl shadow-indigo-500/10"
          >
            Next: Skills you want to learn
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingTeachSkills;