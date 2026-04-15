import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { AUTH_API_END_POINT } from "../utils/constant";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend integration logic
      const response = await fetch(`${AUTH_API_END_POINT}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Token save karein aur redirect
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] p-6 font-sans overflow-hidden">
      {/* Background Decor - Glassmorphism touch */}
      <div className="absolute top-[-5%] left-[-5%] w-80 h-80 bg-indigo-300 rounded-full blur-[100px] opacity-20" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30rem] h-[30rem] bg-blue-300 rounded-full blur-[120px] opacity-20" />

      <div className="relative w-full max-w-[420px] bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.07)] p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[2rem] shadow-2xl shadow-indigo-200 mb-6">
            <ShieldCheck className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Join Us
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Create your professional account
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>
          {/* Username */}
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-14 pr-5 py-5 bg-white/50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-800 placeholder:text-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-14 pr-5 py-5 bg-white/50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-14 pr-5 py-5 bg-white/50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Action Button */}
          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold shadow-2xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-70 transition-all flex items-center justify-center space-x-3 mt-8">
            <span>{loading ? "Creating Account..." : "Register Now"}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
