import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, Sparkles } from "lucide-react";
import { AUTH_API_END_POINT } from "../utils/constant";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext"; // 🔥 Custom Hook

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 🔥 Context se login function nikala
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

 const handleLogin = async (e) => {
   e.preventDefault();
   if (!email || !password) return toast.error("Please fill in all fields");

   setLoading(true);
   try {
     const res = await fetch(`${AUTH_API_END_POINT}/login`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ email, password }),
     });

     const result = await res.json();
     console.log("Login Result:", result); // 🔥 Check role in console

     if (res.ok && result.success) {
       // 🔥 Structure check: agar role 'data' ke andar hai toh:
       const token = result.token || result.data?.token;
       const userData = result.data?.user || result.data; // Ensure role is inside this object

       if (token && userData) {
         // Context update karein (LocalStorage automatically handle hoga)
         login(userData, token);

         toast.success(`Welcome back, ${userData.role || "user"}!`);

         // Dashboard navigate karein
         setTimeout(() => {
           navigate("/dashboard", { replace: true });
         }, 500);
       } else {
         toast.error("User data or token missing!");
       }
     } else {
       toast.error(result.message || "Invalid credentials");
     }
   } catch (err) {
     toast.error("Server is not responding");
   } finally {
     setLoading(false);
   }
 };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F2F2F7] p-4 sm:p-8 font-sans relative overflow-x-hidden">
      <Toaster position="top-right" />

      {/* Decorative Background Orbs - Desktop Spacing Fix */}
      <div className="fixed top-[-10%] right-[-5%] w-72 h-72 sm:w-96 sm:h-96 bg-indigo-200 rounded-full blur-[100px] sm:blur-[120px] opacity-40 animate-pulse pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-5%] w-80 h-80 sm:w-[30rem] sm:h-[30rem] bg-blue-100 rounded-full blur-[120px] sm:blur-[150px] opacity-50 pointer-events-none" />

      <div className="relative w-full max-w-[440px] bg-white/75 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] p-8 sm:p-12 z-10 my-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl shadow-indigo-200 mb-6">
            <LogIn className="text-white w-8 h-8 sm:w-10 sm:h-10 ml-1" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 font-medium italic flex items-center justify-center gap-1">
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
              className="w-full pl-14 pr-5 py-4 sm:py-5 bg-white/50 border border-gray-100 rounded-[1.2rem] sm:rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-800 font-medium"
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
              className="w-full pl-14 pr-5 py-4 sm:py-5 bg-white/50 border border-gray-100 rounded-[1.2rem] sm:rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-800 font-medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 sm:py-5 rounded-[1.2rem] sm:rounded-[1.5rem] font-bold shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.97] disabled:opacity-70 transition-all flex items-center justify-center space-x-3 mt-6">
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm font-medium">
            New here?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
