import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from "lucide-react";
// 1. Constant ko import karein
import { AUTH_API_END_POINT } from "../utils/constant";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. URL ki jagah AUTH_API_END_POINT use karein
      const res = await fetch(`${AUTH_API_END_POINT}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] p-6 font-sans overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-blue-100 rounded-full blur-[150px] opacity-50" />

      <div className="relative w-full max-w-[420px] bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] p-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[2rem] shadow-2xl shadow-indigo-200 mb-6">
            <LogIn className="text-white w-10 h-10 ml-1" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium italic flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Enter your credentials to continue
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-14 pr-5 py-5 bg-white/50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder:text-gray-400 font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-14 pr-5 py-5 bg-white/50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder:text-gray-400 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-right px-2">
            <button
              type="button"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              Forgot Password?
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-70 transition-all flex items-center justify-center space-x-3 mt-8">
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm font-medium">
            New here?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:text-indigo-800 transition-all underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
