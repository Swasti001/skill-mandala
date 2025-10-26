import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import api from "../api";
import { useToast } from "../context/ToastContext";

const UserLoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to redirect after login
  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      if (!data.token || !data.user?.id) {
        showToast("Login failed. Check your credentials.", "error");
        return;
      }

      // Admin check
      if (data.user.role === "ADMIN") {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // Store user auth info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Store onboarding info
      localStorage.setItem("onboardingCompleted", data.onboarding.completed ? "true" : "false");
      localStorage.setItem("currentOnboardingStep", data.onboarding.currentStep);

      setIsAuthenticated(true);
      showToast("Welcome to Skill Mandala! 🌟");

      if (data.onboarding.completed) {
        navigate(from, { replace: true });
      } else {
        const step = data.onboarding.currentStep;
        const target = step === 3 ? "learn" : step === 2 ? "teach" : "profile";
        // If they were trying to access a specific onboarding step, let them
        const redirectPath = from.startsWith("/onboarding") ? from : `/onboarding/${target}`;
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
      showToast(err.response?.data?.message || "Login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-50 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Top-Right Revolving Small Yellow Geometric Mandala */}
      <motion.div 
        className="absolute -top-[200px] -right-[200px] pointer-events-none opacity-40 z-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1000 1000" className="w-[600px] h-[600px] stroke-amber-500/40">
          <circle cx="500" cy="500" r="450" className="fill-none stroke-[6px]" strokeDasharray="120 40" />
          {[...Array(16)].map((_, i) => (
            <rect key={`tr-d1-${i}`} x="495" y="10" width="10" height="10" transform={`rotate(${i * 22.5 + 11.25} 500 500)`} className="fill-none stroke-[2px]" />
          ))}
          {[...Array(32)].map((_, i) => (
            <g key={`tr-b1-${i}`} transform={`rotate(${i * 11.25} 500 500)`}>
              <rect x="480" y="100" width="40" height="15" className="fill-none stroke-[2px]" />
              <line x1="500" y1="115" x2="500" y2="135" className="stroke-[2px]" />
              <rect x="495" y="140" width="10" height="10" transform="rotate(45 500 145)" className="fill-none stroke-[1.5px]" />
            </g>
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`tr-z1-${i}`} d="M 500 180 L 530 250 L 500 320 L 470 250 Z" transform={`rotate(${i * 15} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`tr-z2-${i}`} d="M 500 250 L 520 300 L 500 350 L 480 300 Z" transform={`rotate(${i * 15 + 7.5} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`tr-z3-${i}`} d="M 500 320 L 510 360 L 500 400 L 490 360 Z" transform={`rotate(${i * 15} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[1,2,3,4].map(r => <circle key={`tr-c-${r}`} cx="500" cy="500" r={r * 40} className="fill-none stroke-[1.5px]" />)}
          {[...Array(16)].map((_, i) => (
            <line key={`tr-sun-${i}`} x1="500" y1="500" x2="500" y2="460" transform={`rotate(${i * 22.5} 500 500)`} className="stroke-[2px]" />
          ))}
          <circle cx="500" cy="500" r="10" className="fill-none stroke-[3px]" />
        </svg>
      </motion.div>

      {/* Bottom-Left Revolving Large Yellow Geometric Mandala */}
      <motion.div 
        className="absolute -bottom-[400px] -left-[400px] pointer-events-none opacity-60 z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1000 1000" className="w-[1200px] h-[1200px] stroke-amber-500/40">
          <circle cx="500" cy="500" r="450" className="fill-none stroke-[6px]" strokeDasharray="120 40" />
          {[...Array(16)].map((_, i) => (
            <rect key={`c-d1-${i}`} x="495" y="10" width="10" height="10" transform={`rotate(${i * 22.5 + 11.25} 500 500)`} className="fill-none stroke-[2px]" />
          ))}
          {[...Array(32)].map((_, i) => (
            <g key={`c-b1-${i}`} transform={`rotate(${i * 11.25} 500 500)`}>
              <rect x="480" y="100" width="40" height="15" className="fill-none stroke-[2px]" />
              <line x1="500" y1="115" x2="500" y2="135" className="stroke-[2px]" />
              <rect x="495" y="140" width="10" height="10" transform="rotate(45 500 145)" className="fill-none stroke-[1.5px]" />
            </g>
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`c-z1-${i}`} d="M 500 180 L 530 250 L 500 320 L 470 250 Z" transform={`rotate(${i * 15} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`c-z2-${i}`} d="M 500 250 L 520 300 L 500 350 L 480 300 Z" transform={`rotate(${i * 15 + 7.5} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`c-z3-${i}`} d="M 500 320 L 510 360 L 500 400 L 490 360 Z" transform={`rotate(${i * 15} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[1,2,3,4].map(r => <circle key={`c-c-${r}`} cx="500" cy="500" r={r * 40} className="fill-none stroke-[1.5px]" />)}
          {[...Array(16)].map((_, i) => (
            <line key={`c-sun-${i}`} x1="500" y1="500" x2="500" y2="460" transform={`rotate(${i * 22.5} 500 500)`} className="stroke-[2px]" />
          ))}
          <circle cx="500" cy="500" r="10" className="fill-none stroke-[3px]" />
        </svg>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">
        <div className="w-full max-w-md bg-[#12182B]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome back</h2>
          <p className="text-sm text-slate-400 mb-6 text-center">
            Log in to continue learning with Skill Mandala.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  size={10}
                  className="text-[10px] text-purple-400 hover:text-purple-300 transition"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 text-xs font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold
                         bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500
                         hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-4 text-center">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-purple-300 hover:text-purple-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;