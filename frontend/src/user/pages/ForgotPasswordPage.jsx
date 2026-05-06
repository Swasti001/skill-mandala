import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to process request.");
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h2>
        <p className="text-sm text-slate-400 mb-8 text-center">
          Securing your access to the Skill Mandala.
        </p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-xl mb-6 text-center">{error}</div>}

        {!success ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm hover:brightness-110 shadow-lg"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-4 rounded-xl mb-6">
              If an account is registered to this email, we have sent a reset link. Please check your inbox.
            </div>
            <Link to="/login" className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:brightness-90 transition inline-block">
              Back to Login
            </Link>
          </div>
        )}

        {!success && (
          <div className="mt-8 text-center">
            <Link to="/login" className="text-slate-400 text-xs hover:text-white transition underline">
              Wait, I remember my password
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
