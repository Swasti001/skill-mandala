import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import api from "../api";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset token.");
    }
  }, [token]);

  const validatePassword = (p) => {
    if (p.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passError = validatePassword(newPassword);
    if (passError) {
      setError(passError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-slate-50 items-center justify-center px-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="w-full max-w-md bg-[#12182B]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-10 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Set New Password</h2>
        <p className="text-sm text-slate-400 mb-8 text-center">
          Please enter your new password below.
        </p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-xl mb-6 text-center">{error}</div>}

        {!success ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-[20px] bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition duration-300"
                placeholder="Min 8 characters"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-[20px] bg-slate-950 border border-slate-800 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition duration-300"
                placeholder="Retype password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full mt-4 py-4 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:brightness-110 transition-all duration-300 shadow-xl shadow-purple-500/10 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Confirm New Password"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-4 rounded-xl mb-6">
              Your password has been successfully reset! You can now log in.
            </div>
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-4 py-4 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white hover:brightness-110 transition-all duration-300 shadow-xl shadow-purple-500/10"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-slate-400 text-xs hover:text-white transition underline">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
