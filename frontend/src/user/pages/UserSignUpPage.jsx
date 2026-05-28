import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import { Eye, EyeOff } from "lucide-react";
import api from "../api";
import { useUser } from "../../context/UserContext";

const UserSignUpPage = ({ setIsAuthenticated }) => {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setUser, refreshUser } = useUser();
  const navigate = useNavigate();

  const validatePassword = (p) => {
    let errs = [];
    if (p.length < 8) errs.push("at least 8 characters");
    if (!/[A-Z]/.test(p)) errs.push("one uppercase letter");
    if (!/[a-z]/.test(p)) errs.push("one lowercase letter");
    if (!/[0-9]/.test(p)) errs.push("one number");
    if (!/[!@#$%^&*()_+=\-{}[\]:;<>,.?/~]/.test(p)) errs.push("one special character");
    if (errs.length > 0) return "Password must include: " + errs.join(", ");
    return null;
  };

  const validateForm = () => {
    let newErrors = {};

    // Name
    if (!name.trim()) newErrors.name = "Full name is required";

    // DOB
    if (!dob) {
      newErrors.dob = "Please enter a valid date of birth";
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      if (birthDate > today) newErrors.dob = "Date of birth cannot be in the future";
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) newErrors.dob = "You must be at least 18 years old to join";
    }

    // Phone (Exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Username
    if (!username.trim()) newErrors.username = "Username is required";

    // Email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password
    const passPolicy = validatePassword(password);
    if (passPolicy) newErrors.password = passPolicy;

    // Confirm Password
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    // Clear stale cached/localStorage user data before signup
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("onboardingCompleted");
    localStorage.removeItem("currentOnboardingStep");

    try {
      const formattedDob = dob ? new Date(dob).toISOString().split("T")[0] : null;

      const payload = {
        name,
        dob: formattedDob,
        phone,
        username,
        email,
        password
      };

      const response = await api.post("/auth/register", payload);
      const data = response.data;

      if (data.token && data.user?.id) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        localStorage.setItem("onboardingCompleted", data.onboarding.completed ? "true" : "false");
        localStorage.setItem("currentOnboardingStep", data.onboarding.currentStep);

        setIsAuthenticated(true);
        
        // Fetch full user details from backend immediately
        await refreshUser();
        
        navigate("/onboarding/profile", { replace: true });
      } else {
        setErrors({ general: "Signup failed. Please check your details." });
      }
    } catch (err) {
      console.error("Signup failed:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: err.response?.data?.message || "Signup failed. Please try again later." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-50 relative overflow-hidden">

      {/* Background Ambient Glows */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Top-Left Revolving Small Yellow Geometric Mandala */}
      <motion.div 
        className="absolute -top-[200px] -left-[200px] pointer-events-none opacity-40 z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1000 1000" className="w-[600px] h-[600px] stroke-amber-500/40">
          <circle cx="500" cy="500" r="450" className="fill-none stroke-[6px]" strokeDasharray="120 40" />
          {[...Array(16)].map((_, i) => (
            <rect key={`tl-d1-${i}`} x="495" y="10" width="10" height="10" transform={`rotate(${i * 22.5 + 11.25} 500 500)`} className="fill-none stroke-[2px]" />
          ))}
          {[...Array(32)].map((_, i) => (
            <g key={`tl-b1-${i}`} transform={`rotate(${i * 11.25} 500 500)`}>
              <rect x="480" y="100" width="40" height="15" className="fill-none stroke-[2px]" />
              <line x1="500" y1="115" x2="500" y2="135" className="stroke-[2px]" />
              <rect x="495" y="140" width="10" height="10" transform="rotate(45 500 145)" className="fill-none stroke-[1.5px]" />
            </g>
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`tl-z1-${i}`} d="M 500 180 L 530 250 L 500 320 L 470 250 Z" transform={`rotate(${i * 15} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`tl-z2-${i}`} d="M 500 250 L 520 300 L 500 350 L 480 300 Z" transform={`rotate(${i * 15 + 7.5} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`tl-z3-${i}`} d="M 500 320 L 510 360 L 500 400 L 490 360 Z" transform={`rotate(${i * 15} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[1,2,3,4].map(r => <circle key={`tl-c-${r}`} cx="500" cy="500" r={r * 40} className="fill-none stroke-[1.5px]" />)}
          {[...Array(16)].map((_, i) => (
            <line key={`tl-sun-${i}`} x1="500" y1="500" x2="500" y2="460" transform={`rotate(${i * 22.5} 500 500)`} className="stroke-[2px]" />
          ))}
          <circle cx="500" cy="500" r="10" className="fill-none stroke-[3px]" />
        </svg>
      </motion.div>

      {/* Bottom-Right Revolving Large Yellow Geometric Mandala */}
      <motion.div 
        className="absolute -bottom-[400px] -right-[400px] pointer-events-none opacity-60 z-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 1000 1000" className="w-[1200px] h-[1200px] stroke-amber-500/40">
          <circle cx="500" cy="500" r="450" className="fill-none stroke-[6px]" strokeDasharray="120 40" />
          {[...Array(16)].map((_, i) => (
            <rect key={`br-d1-${i}`} x="495" y="10" width="10" height="10" transform={`rotate(${i * 22.5 + 11.25} 500 500)`} className="fill-none stroke-[2px]" />
          ))}
          {[...Array(32)].map((_, i) => (
            <g key={`br-b1-${i}`} transform={`rotate(${i * 11.25} 500 500)`}>
              <rect x="480" y="100" width="40" height="15" className="fill-none stroke-[2px]" />
              <line x1="500" y1="115" x2="500" y2="135" className="stroke-[2px]" />
              <rect x="495" y="140" width="10" height="10" transform="rotate(45 500 145)" className="fill-none stroke-[1.5px]" />
            </g>
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`br-z1-${i}`} d="M 500 180 L 530 250 L 500 320 L 470 250 Z" transform={`rotate(${i * 15} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`br-z2-${i}`} d="M 500 250 L 520 300 L 500 350 L 480 300 Z" transform={`rotate(${i * 15 + 7.5} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[...Array(24)].map((_, i) => (
            <path key={`br-z3-${i}`} d="M 500 320 L 510 360 L 500 400 L 490 360 Z" transform={`rotate(${i * 15} 500 500)`} className="fill-transparent stroke-[1.5px]" />
          ))}
          {[1,2,3,4].map(r => <circle key={`br-c-${r}`} cx="500" cy="500" r={r * 40} className="fill-none stroke-[1.5px]" />)}
          {[...Array(16)].map((_, i) => (
            <line key={`br-sun-${i}`} x1="500" y1="500" x2="500" y2="460" transform={`rotate(${i * 22.5} 500 500)`} className="stroke-[2px]" />
          ))}
          <circle cx="500" cy="500" r="10" className="fill-none stroke-[3px]" />
        </svg>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">
        <div className="w-full max-w-md bg-[#12182B]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Create your account</h2>
          <p className="text-sm text-slate-400 mb-6 text-center">
            Join Skill Mandala and start building your skill stack.
          </p>

          <form onSubmit={handleSignUp} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${errors.name ? 'border-red-500' : 'border-slate-700'} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Your name"
                required
              />
              {errors.name && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${errors.dob ? 'border-red-500' : 'border-slate-700'} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  required
                />
                {errors.dob && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.dob}</p>}
                {!errors.dob && <p className="text-[10px] text-slate-500 mt-0.5">Min 18 years old.</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${errors.phone ? 'border-red-500' : 'border-slate-700'} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="10 digit number"
                  required
                />
                {errors.phone && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${errors.username ? 'border-red-500' : 'border-slate-700'} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Choose a username"
                required
              />
              {errors.username && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${errors.email ? 'border-red-500' : 'border-slate-700'} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${errors.password ? 'border-red-500' : 'border-slate-700'} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.password}</p>}
              {!errors.password && (
                <p className="text-[10px] text-slate-500 mt-1 pl-1">
                  At least 8 chars, including A-Z, a-z, 0-9, and a special character.
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-700'} text-sm focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (<p className="text-[10px] text-red-500 mt-1 pl-1">{errors.confirmPassword}</p>)}
            </div>

            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/50 p-2 rounded-lg text-red-500 text-center text-xs">
                {errors.general}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold
                         bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500
                         hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-300 hover:text-purple-200">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignUpPage;