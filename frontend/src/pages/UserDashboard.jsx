import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "Loading...",
    email: "Loading...",
    role: "user",
  });

  // Demo update state
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Yahan aap backend se data fetch karenge
    // Filhal hum localStorage ya token se basic info nikaal sakte hain
    const user = JSON.parse(localStorage.getItem("user_info"));
    if (user) setUserData(user);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 font-medium">
            Manage your personal information
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-red-500 px-5 py-3 rounded-2xl font-bold shadow-sm hover:bg-red-50 transition-all">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
            <User size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {userData.username}
          </h3>
          <span className="mt-2 px-4 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase rounded-full tracking-wider">
            {userData.role}
          </span>
          <p className="mt-6 text-sm text-gray-400 leading-relaxed">
            As a standard user, you can view your profile and update your basic
            details.
          </p>
        </div>

        {/* Right Side: Settings/Details */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">
                  Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={userData.username}
                    readOnly={!isEditing}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Role Info (Non-editable) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 ml-1">
                Account Permissions
              </label>
              <div className="relative">
                <Shield
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value="Standard User Access"
                  disabled
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-500"
                />
              </div>
              <p className="text-[11px] text-amber-600 font-medium ml-1">
                * You do not have permission to change your role. Contact Admin
                for upgrades.
              </p>
            </div>

            {/* Update Button */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isEditing
                    ? "bg-gray-200 text-gray-700"
                    : "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                }`}>
                {isEditing ? "Cancel" : "Update Profile"}
              </button>

              {isEditing && (
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
