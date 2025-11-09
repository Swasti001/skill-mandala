import React from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import { useToast } from "../../context/ToastContext";

const OnboardingProfile = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData, goToStep } = useOnboarding();
  const { showToast } = useToast();

  // Synced by UserApp.jsx, no need for redundant check here

  const handleChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();

    // ✅ required fields
    if (!profileData.bio?.trim()) {
      showToast("Please enter a short bio.", "error");
      return;
    }
    if (!profileData.location?.trim()) {
      showToast("Please enter your location.", "error");
      return;
    }

    // ✅ extra required checks
    if (!profileData.experience?.trim()) {
      showToast("Please select your experience level.", "error");
      return;
    }
    if (!profileData.mode?.trim()) {
      showToast("Please select your preferred mode.", "error");
      return;
    }

    goToStep(2);
    navigate("/onboarding/teach");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <div className="w-full max-w-xl bg-slate-900/80 border border-slate-700 rounded-3xl shadow-2xl p-8">
        <p className="text-xs text-slate-400 mb-2">Step 1 of 3</p>
        <h1 className="text-2xl font-bold mb-2">Tell us about you</h1>
        <p className="text-sm text-slate-400 mb-6">
          This helps Skill Mandala personalize matches and recommendations.
        </p>

        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Short bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              placeholder="e.g. CS student interested in web dev & guitar."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Location (city / country)
            </label>
            <input
              value={profileData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Kathmandu, Nepal"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Experience level</label>
              <select
                value={profileData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Preferred mode</label>
              <select
                value={profileData.mode}
                onChange={(e) => handleChange("mode", e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm
                           focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select</option>
                <option value="online">Online only</option>
                <option value="in_person">In-person</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold
                       bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500
                       hover:brightness-110 transition"
          >
            Next: Skills you can teach
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingProfile;