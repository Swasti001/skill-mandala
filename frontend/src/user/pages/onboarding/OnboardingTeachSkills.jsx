// src/user/pages/onboarding/OnboardingTeachSkills.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-xl bg-slate-900/80 border border-slate-700 rounded-3xl shadow-2xl p-8">
        <p className="text-xs text-slate-400 mb-2">Step 2 of 3</p>
        <h1 className="text-2xl font-bold mb-2">What can you teach?</h1>
        <p className="text-sm text-slate-400 mb-6">
          Choose skills you feel comfortable teaching and your availability.
        </p>

        <form onSubmit={handleNext} className="space-y-4">
          {/* Preset Skills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {PRESET_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-2 rounded-xl border text-left ${
                  teachSkills.includes(skill)
                    ? "border-purple-400 bg-purple-500/20"
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
                placeholder="e.g. Photography"
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

          {/* Teach Availability */}
          <div>
            <label className="block text-xs font-semibold mb-1 mt-2">
              When are you usually available to teach?
            </label>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <span className="w-12">{day}</span>

                  <select
                    value={teachAvailability[day] || ""}
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

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold
            bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500
            hover:brightness-110 transition"
          >
            Next: Skills you want to learn
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingTeachSkills;