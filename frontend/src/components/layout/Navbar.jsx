import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  ShieldCheck,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // LocalStorage se safe tarike se data nikalna
  const userStr = localStorage.getItem("user_info");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload(); // State clear karne ke liye
  };

  if (!user) return null;

  // Helper function active link check karne ke liye
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-black text-indigo-600 tracking-tighter">
          PM TECH
        </h1>

        <div className="flex gap-6 text-sm font-bold text-gray-500">
          {/* Dashboard Link (Common for all but dynamic label) */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-1 transition-colors ${
              isActive("/dashboard")
                ? "text-indigo-600"
                : "hover:text-indigo-600"
            }`}>
            <LayoutDashboard size={16} />
            {user.role === "admin"
              ? "Admin Console"
              : user.role === "manager"
                ? "Manager Desk"
                : "Dashboard"}
          </Link>

          {/* Manager & Admin specifically can see User Management */}
          {(user.role === "admin" || user.role === "manager") && (
            <Link
              to="/dashboard" // Aapka route /dashboard hi hai filhal
              className="hover:text-indigo-600 flex items-center gap-1">
              <User size={16} /> Users
            </Link>
          )}

          {/* Profile Link (Standard for all) */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-1 transition-colors ${
              isActive("/profile") ? "text-indigo-600" : "hover:text-indigo-600"
            }`}>
            <Settings size={16} /> My Profile
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <div className="hidden md:flex flex-col items-end mr-2">
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

        <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-sm transition-all px-3 py-2 rounded-xl hover:bg-red-50">
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
