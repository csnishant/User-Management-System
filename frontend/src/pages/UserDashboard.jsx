import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Shield, Save, LogOut, Loader2, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constant";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    role: "",
  });

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Axios Instance for User Profile
  const userAxios = axios.create({
    baseURL: USER_API_END_POINT,
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userAxios.get("/profile");
      if (res.data.success) {
        setUserData(res.data.data);
      }
    } catch (err) {
      console.error("Profile Fetch Error");
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updatePayload = { username: userData.username };
      if (password) updatePayload.password = password;

      const res = await userAxios.put("/profile", updatePayload);
      if (res.data.success) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        setPassword("");
        fetchProfile(); // Data refresh
      }
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7]">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] p-8 font-sans">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Profile</h1>
          <p className="text-gray-500 font-medium">
            Manage your personal information
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-red-500 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-red-50 transition-all border border-gray-100">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-4 font-black text-3xl uppercase">
            {userData.username[0]}
          </div>
          <h3 className="text-xl font-black text-gray-900">
            {userData.username}
          </h3>
          <span className="mt-2 px-4 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-indigo-100">
            {userData.role}
          </span>
          <p className="mt-6 text-sm text-gray-400 leading-relaxed font-medium">
            You are currently logged in as a <b>{userData.role}</b>. You can
            modify your display name and security credentials.
          </p>
        </div>

        {/* Right Side: Settings Form */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">
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
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all font-bold ${
                      isEditing
                        ? "bg-white border-2 border-indigo-500"
                        : "bg-gray-50 border border-gray-100 cursor-default"
                    }`}
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">
                  Email (Primary)
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                    size={18}
                  />
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Password Field (Only shows when editing) */}
            {isEditing && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">
                  Update Password
                </label>
                <div className="relative">
                  <Key
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder="Enter new password (optional)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-indigo-500 rounded-2xl outline-none font-bold"
                  />
                </div>
              </div>
            )}

            {/* Role Display */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">
                Permissions
              </label>
              <div className="relative">
                <Shield
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                  size={18}
                />
                <input
                  type="text"
                  value={`${userData.role.toUpperCase()} ACCESS`}
                  disabled
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 font-bold"
                />
              </div>
              <p className="text-[10px] text-amber-600 font-bold ml-1 italic">
                * To change your role, please contact the system administrator.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  Edit Profile Information
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-2xl font-black transition-all hover:bg-gray-300">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                    {isUpdating ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
