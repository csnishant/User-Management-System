import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();

  // Scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardLabel = () => {
    if (user.role === "admin") return "Admin Console";
    if (user.role === "manager") return "Manager Desk";
    return "Dashboard";
  };

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`relative px-4 sm:px-6 h-16 flex items-center justify-between transition-all duration-300 rounded-[1.5rem] border border-white/40 shadow-2xl overflow-hidden ${
            scrolled
              ? "bg-white/70 backdrop-blur-xl shadow-indigo-100/50"
              : "bg-white"
          }`}>
          {/* Decorative background light (Visible on scroll) */}
          {scrolled && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/20 to-purple-50/20 pointer-events-none" />
          )}

          {/* --- Left: Logo & Desktop Links --- */}
          <div className="flex items-center gap-8 z-10">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-200">
                <Zap size={18} className="text-white fill-current" />
              </div>
              <h1 className="text-xl font-black text-gray-900 tracking-tighter">
                UM<span className="text-indigo-600">.</span>SYS
              </h1>
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              <NavLink
                to="/dashboard"
                active={isActive("/dashboard")}
                icon={<LayoutDashboard size={16} />}
                label={getDashboardLabel()}
              />

              {(user.role === "admin" || user.role === "manager") && (
                <NavLink
                  to="/dashboard"
                  active={false}
                  icon={<User size={16} />}
                  label="Team Management"
                />
              )}
            </div>
          </div>

          {/* --- Right: User Info & Actions --- */}
          <div className="hidden md:flex items-center gap-4 z-10">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-black leading-none mb-1">
                Verified {user.role}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-gray-700">
                  {user.username}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-100 mx-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={18} />
              <span>Exit</span>
            </button>
          </div>

          {/* --- Mobile: Toggle --- */}
          <div className="md:hidden z-10">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Drawer Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 md:hidden z-[90]">
            <div className="bg-white/90 backdrop-blur-2xl rounded-[2rem] border border-white p-4 shadow-2xl shadow-indigo-200/50">
              <div className="flex items-center gap-4 p-4 mb-4 bg-indigo-50 rounded-2xl">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-tight">
                    {user.username}
                  </h4>
                  <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <MobileNavLink
                  to="/dashboard"
                  icon={<LayoutDashboard size={20} />}
                  label={getDashboardLabel()}
                  onClick={() => setIsMenuOpen(false)}
                />
                {(user.role === "admin" || user.role === "manager") && (
                  <MobileNavLink
                    to="/dashboard"
                    icon={<User size={20} />}
                    label="Team Control"
                    onClick={() => setIsMenuOpen(false)}
                  />
                )}
                <MobileNavLink
                  to="/dashboard"
                  icon={<Settings size={20} />}
                  label="Settings"
                  onClick={() => setIsMenuOpen(false)}
                />
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center justify-center gap-3 p-4 text-base font-black text-white bg-red-500 hover:bg-red-600 rounded-2xl shadow-lg shadow-red-100 transition-all">
                <LogOut size={20} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Helper Components for Cleanliness ---

const NavLink = ({ to, active, icon, label }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
      active
        ? "bg-indigo-50 text-indigo-600"
        : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
    }`}>
    {icon}
    {label}
  </Link>
);

const MobileNavLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-4 p-4 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl font-bold transition-all">
    <span className="p-2 bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
      {icon}
    </span>
    {label}
  </Link>
);

export default Navbar;
