import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu toggle state

  const userStr = localStorage.getItem("user_info");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  // Role based text helper
  const getDashboardLabel = () => {
    if (user.role === "admin") return "Admin Console";
    if (user.role === "manager") return "Manager Desk";
    return "Dashboard";
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <h1 className="text-xl font-black text-indigo-600 tracking-tighter">
              PM TECH
            </h1>

            {/* Desktop Links - Hidden on Mobile */}
            <div className="hidden md:flex ml-10 space-x-8 text-sm font-bold text-gray-500">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1 transition-colors ${
                  isActive("/dashboard")
                    ? "text-indigo-600"
                    : "hover:text-indigo-600"
                }`}>
                <LayoutDashboard size={16} /> {getDashboardLabel()}
              </Link>

              {(user.role === "admin" || user.role === "manager") && (
                <Link
                  to="/dashboard"
                  className="hover:text-indigo-600 flex items-center gap-1">
                  <User size={16} /> Users
                </Link>
              )}

              <Link
                to="/dashboard"
                className="hover:text-indigo-600 flex items-center gap-1">
                <Settings size={16} /> My Profile
              </Link>
            </div>
          </div>

          {/* Right Side (Role & Logout) - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Access Level
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  user.role === "admin"
                    ? "bg-red-50 text-red-600"
                    : user.role === "manager"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-green-50 text-green-600"
                }`}>
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-all">
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Button - Visible only on Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 p-2 hover:bg-gray-100 rounded-lg">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <div className="px-3 py-2 border-b border-gray-50 mb-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Logged in as
            </p>
            <p className="text-sm font-bold text-indigo-600 uppercase">
              {user.role}
            </p>
          </div>

          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-3 text-base font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} /> {getDashboardLabel()}
            </div>
          </Link>

          {(user.role === "admin" || user.role === "manager") && (
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-3 text-base font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
              <div className="flex items-center gap-3">
                <User size={20} /> Users
              </div>
            </Link>
          )}

          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="block px-3 py-3 text-base font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl">
            <div className="flex items-center gap-3">
              <Settings size={20} /> My Profile
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center gap-3 px-3 py-3 text-base font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
