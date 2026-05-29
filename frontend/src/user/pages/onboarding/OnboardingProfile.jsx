import React from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";
import { useToast } from "../../context/ToastContext";

const OnboardingProfile = () => {
  const navigate = useNavigate();
  const { profileData, setProfileData, goToStep } = useOnboarding();
  const { showToast } = useToast();

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = e => {
    e.preventDefault();
    if (!profileData.bio?.trim()) { showToast("Please enter a short bio.", "error"); return; }
    if (!profileData.location?.trim()) { showToast("Please enter your location.", "error"); return; }
    if (!profileData.experience?.trim()) { showToast("Please select your experience level.", "error"); return; }
    if (!profileData.mode?.trim()) { showToast("Please select your preferred mode.", "error"); return; }
    goToStep(2);
    navigate("/onboarding/teach");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0B101E] text-white overflow-hidden p-6">
      {/* Abstract Background Glow Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      {/* Corner Mandala Illustrations */}
      <img src={process.env.PUBLIC_URL + "/onboarding_profile_illustration_1779854496977.png"} alt="Mandala" className="absolute left-0 top-0 w-48 opacity-10 pointer-events-none" />
      <img src={process.env.PUBLIC_URL + "/onboarding_profile_illustration_1779854496977.png"} alt="Mandala" className="absolute right-0 bottom-0 w-48 opacity-10 transform rotate-180 pointer-events-none" />
      
      {/* Card */}
      <div className="w-full max-w-xl bg-[#12182B]/60 backdrop-blur-xl border border-slate-700/50 rounded-[40px] shadow-2xl p-10 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Step 1 of 3</p>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Tell us about you</h1>
        <p className="text-slate-400 text-sm font-medium mb-8">This helps Skill Mandala personalize matches and recommendations.</p>
        <form onSubmit={handleNext} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Short bio</label>
            <textarea
              value={profileData.bio}
              onChange={e => handleChange("bio", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition duration-300"
              rows={3}
              placeholder="e.g. CS student interested in web dev & guitar."
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Location (city / country)</label>
            <input
              value={profileData.location}
              onChange={e => handleChange("location", e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition duration-300"
              placeholder="Kathmandu, Nepal"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Experience level</label>
              <select
                value={profileData.experience}
                onChange={e => handleChange("experience", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition duration-300"
              >
                <option value="">Select</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Preferred mode</label>
              <select
                value={profileData.mode}
                onChange={e => handleChange("mode", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition duration-300"
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
            className="w-full mt-4 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest bg-indigo-500 text-[#0B101E] hover:bg-white hover:text-indigo-600 transition-all duration-300 shadow-xl shadow-indigo-500/10"
          >
            Next: Skills you can teach
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingProfile;