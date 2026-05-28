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
    <div className="min-h-screen flex bg-slate-950 items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-xl">
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Retype password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3 rounded-full bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 shadow-lg disabled:opacity-50"
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
              className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:brightness-90 transition inline-block w-full"
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
