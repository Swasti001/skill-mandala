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
const OnboardingLearnSkills = () => {
  const navigate = useNavigate();
  const {
    profileData,
    teachSkills,
    learnSkills,
    setLearnSkills,
    teachAvailability,
    learnAvailability,
    setLearnAvailability,
    submitOnboarding,
  } = useOnboarding();
  const { showToast } = useToast();

  const [customSkill, setCustomSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    if (teachSkills.includes(skill)) {
      showToast("You can't learn a skill you are already teaching!", "error");
      return;
    }

    setLearnSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustom = () => {
  const entries = customSkill.split(',').map((s) => s.trim()).filter(Boolean);
  if (entries.length === 0) return;

  const validated = [];
  entries.forEach((skill) => {
    if (teachSkills.includes(skill)) {
      showToast(`You can't learn a skill you are already teaching: ${skill}`, "error");
      return;
    }
    if (!learnSkills.includes(skill) && !validated.includes(skill)) {
      validated.push(skill);
    }
  });

  if (validated.length) {
    setLearnSkills((prev) => [...prev, ...validated]);
  }
  setCustomSkill("");
};;

  const handleAvailabilityChange = (day, time) => {
    setLearnAvailability((prev) => ({
      ...prev,
      [day]: time,
    }));
  };

  const handleFinish = async (e) => {
    e.preventDefault();

    // ✅ required validations so DB fields don't become null/empty
    if (!profileData.bio?.trim()) {
      showToast("Bio is required. Please go back and fill it.", "error");
      return;
    }
    if (!profileData.location?.trim()) {
      showToast("Location is required. Please go back and fill it.", "error");
      return;
    }
    if (!profileData.experience?.trim()) {
      showToast("Experience is required. Please go back and select it.", "error");
      return;
    }
    if (!profileData.mode?.trim()) {
      showToast("Mode is required. Please go back and select it.", "error");
      return;
    }

    if (teachSkills.length === 0) {
      showToast("Please select at least one skill to teach.", "error");
      return;
    }
    if (learnSkills.length === 0) {
      showToast("Please select at least one skill to learn.", "error");
      return;
    }

    const teachSelected = Object.values(teachAvailability).filter(Boolean).length;
    const learnSelected = Object.values(learnAvailability).filter(Boolean).length;

    if (teachSelected === 0) {
      showToast("Please select at least one teach availability slot.", "error");
      return;
    }
    if (learnSelected === 0) {
      showToast("Please select at least one learn availability slot.", "error");
      return;
    }

    try {
      setLoading(true);

      await submitOnboarding();
      showToast("Registration Complete! Welcome aboard. 🚀");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Error submitting onboarding:", err);
      showToast("Failed to submit onboarding.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B101E] text-white overflow-hidden p-6">
      {/* Abstract Background Glow Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      {/* Corner Mandala Illustrations */}
      <img src={process.env.PUBLIC_URL + "/onboarding_learn_illustration_1779854926522.png"} alt="Mandala" className="absolute left-0 top-0 w-48 opacity-10 pointer-events-none" />
      <img src={process.env.PUBLIC_URL + "/onboarding_learn_illustration_1779854926522.png"} alt="Mandala" className="absolute right-0 bottom-0 w-48 opacity-10 transform rotate-180 pointer-events-none" />

      <div className="w-full max-w-xl bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[40px] shadow-2xl p-10 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Step 3 of 3</p>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">What do you want to learn?</h1>
        <p className="text-slate-400 text-sm font-medium mb-8">
          Tell us your learning goals and availability so we can find the best matches.
        </p>

        <form onSubmit={handleFinish} className="space-y-6">
          {/* Preset Skills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {PRESET_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-4 py-3 rounded-2xl border text-left font-bold transition duration-300 ${
                  learnSkills.includes(skill)
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
                placeholder="e.g. Public Speaking"
              />

              <button
                type="button"
                onClick={handleAddCustom}
                className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-800 hover:bg-white/5 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Learn Availability */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                When are you usually available to learn?
              </label>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Set all:</span>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      DAYS.forEach((day) => handleAvailabilityChange(day, val));
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
                    value={learnAvailability[day] || ""}
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

          {/* Finish */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest bg-indigo-500 text-[#0B101E] hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-xl shadow-indigo-500/10 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Finish & Go to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingLearnSkills;