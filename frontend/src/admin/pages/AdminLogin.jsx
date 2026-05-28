import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../adminApi";
import Logo from "../../user/components/Logo";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await adminApi.post("/auth/admin-login", {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        // Optional: store user details if needed
        localStorage.setItem("adminUser", JSON.stringify(response.data.user));
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed due to server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <form
        onSubmit={handleLogin}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-96 flex flex-col gap-4 shadow-xl"
      >
        <div className="flex justify-center mb-2">
          <Logo className="w-12 h-12" showText={true} />
        </div>
        <h2 className="text-xl font-semibold text-slate-50 text-center tracking-tight">Admin Console Login</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-50 placeholder-slate-400"
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
