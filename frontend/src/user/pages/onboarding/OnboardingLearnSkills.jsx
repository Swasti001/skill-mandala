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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1d] to-[#121829] text-white overflow-hidden p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20" />
{/* Corner Mandala Illustrations */}
<img src={process.env.PUBLIC_URL + "/onboarding_learn_illustration_1779854926522.png"} alt="Mandala" className="absolute left-0 top-0 w-48 opacity-30" />
<img src={process.env.PUBLIC_URL + "/onboarding_learn_illustration_1779854926522.png"} alt="Mandala" className="absolute right-0 bottom-0 w-48 opacity-30 transform rotate-180" />

      <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl p-8 relative z-10">
        <p className="text-xs text-slate-400 mb-2">Step 3 of 3</p>

        <h1 className="text-2xl font-bold mb-2">What do you want to learn?</h1>

        <p className="text-sm text-slate-400 mb-6">
          Tell us your learning goals and availability so we can find the best
          matches.
        </p>

        <form onSubmit={handleFinish} className="space-y-4">
          {/* Preset Skills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {PRESET_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-2 rounded-xl border text-left ${
                  learnSkills.includes(skill)
                    ? "border-pink-400 bg-pink-500/20"
                    : "border-slate-600 hover:bg-slate-800"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          {/* Custom Skill */}
          <div>
            <label className="block text-xs font-semibold mb-1 mt-2">
              Add another skill
            </label>

            <div className="flex gap-2">
              <input
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Public Speaking"
              />

              <button
                type="button"
                onClick={handleAddCustom}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-600 hover:bg-slate-800"
              >
                Add
              </button>
            </div>
          </div>

          {/* Learn Availability */}
          <div>
            <label className="block text-xs font-semibold mb-1 mt-2">
              When are you usually available to learn?
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 mt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Set all days:</span>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    DAYS.forEach((day) => handleAvailabilityChange(day, val));
                  }
                }}
                className="px-2 py-1 rounded-xl bg-slate-950 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                defaultValue=""
              >
                <option value="" disabled>Choose slot...</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-12">{day}</span>
                  <select
                    value={learnAvailability[day] || ""}
                    onChange={(e) =>
                      handleAvailabilityChange(day, e.target.value)
                    }
                    className="flex-1 px-2 py-1 rounded-xl bg-slate-950 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold
            bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500
            hover:brightness-110 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Finish and go to dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingLearnSkills;